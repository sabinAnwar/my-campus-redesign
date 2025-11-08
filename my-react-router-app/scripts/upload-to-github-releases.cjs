#!/usr/bin/env node

/**
 * Upload Course Materials to GitHub Releases
 * 
 * This script uploads all course materials (PDFs, MP3s, etc.) from public/uploads/
 * to GitHub Releases for free, unlimited CDN hosting.
 * 
 * Prerequisites:
 * 1. Install GitHub CLI: https://cli.github.com/
 * 2. Authenticate: gh auth login
 * 3. Run: node scripts/upload-to-github-releases.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO = 'sabinAnwar/website-bauen';
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const RELEASE_TAG = 'course-materials-v1.0';
const RELEASE_NAME = 'Course Materials - Wirtschaftsinformatik';

// Organize files by course
function organizeFilesByCourse() {
  console.log('📁 Scanning files in public/uploads/...\n');
  
  const courses = {};
  const studiengangPath = path.join(UPLOADS_DIR, 'studiengaenge/Wirtschaftsinformatik');
  
  if (!fs.existsSync(studiengangPath)) {
    console.error('❌ Error: uploads directory not found!');
    process.exit(1);
  }
  
  const courseDirs = fs.readdirSync(studiengangPath);
  
  courseDirs.forEach(courseDir => {
    const coursePath = path.join(studiengangPath, courseDir);
    if (!fs.statSync(coursePath).isDirectory()) return;
    
    const files = [];
    const types = ['skript', 'podcasts', 'folien', 'musterklausuren', 'tests'];
    
    types.forEach(type => {
      const typePath = path.join(coursePath, type);
      if (fs.existsSync(typePath)) {
        const typeFiles = fs.readdirSync(typePath);
        typeFiles.forEach(file => {
          const filePath = path.join(typePath, file);
          if (fs.statSync(filePath).isFile()) {
            const stats = fs.statSync(filePath);
            files.push({
              name: file,
              type: type,
              path: filePath,
              relativePath: path.relative(UPLOADS_DIR, filePath),
              size: stats.size,
              sizeReadable: formatBytes(stats.size)
            });
          }
        });
      }
    });
    
    if (files.length > 0) {
      courses[courseDir] = {
        name: courseDir,
        files: files,
        totalSize: files.reduce((sum, f) => sum + f.size, 0)
      };
    }
  });
  
  return courses;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    console.log('✅ GitHub CLI is installed\n');
    return true;
  } catch (error) {
    console.error('❌ GitHub CLI is not installed!');
    console.error('\nPlease install it:');
    console.error('Windows: winget install --id GitHub.cli');
    console.error('Or download: https://cli.github.com/\n');
    console.error('Then run: gh auth login\n');
    return false;
  }
}

function checkAuthentication() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    console.log('✅ GitHub CLI is authenticated\n');
    return true;
  } catch (error) {
    console.error('❌ Not authenticated with GitHub!');
    console.error('Please run: gh auth login\n');
    return false;
  }
}

async function createRelease(tag, name, isDraft = true) {
  console.log(`\n📦 Creating GitHub Release: ${tag}...`);
  
  try {
    const draftFlag = isDraft ? '--draft' : '';
    const cmd = `gh release create "${tag}" ${draftFlag} --repo ${REPO} --title "${name}" --notes "Course materials for Wirtschaftsinformatik program. Automatically uploaded from local storage."`;
    
    execSync(cmd, { stdio: 'inherit' });
    console.log('✅ Release created successfully!\n');
    return true;
  } catch (error) {
    // Release might already exist
    console.log('ℹ️  Release might already exist, continuing...\n');
    return true;
  }
}

async function uploadFilesToRelease(tag, files, courseName) {
  console.log(`\n📤 Uploading ${files.length} files for ${courseName}...`);
  
  let uploaded = 0;
  let failed = 0;
  
  for (const file of files) {
    try {
      console.log(`  Uploading ${file.name} (${file.sizeReadable})...`);
      
      // Upload file to release
      const cmd = `gh release upload "${tag}" "${file.path}" --repo ${REPO} --clobber`;
      execSync(cmd, { stdio: 'pipe' });
      
      uploaded++;
      console.log(`  ✅ Uploaded: ${file.name}`);
      
    } catch (error) {
      failed++;
      console.error(`  ❌ Failed: ${file.name}`);
      console.error(`     ${error.message}`);
    }
  }
  
  console.log(`\n✅ Uploaded: ${uploaded}/${files.length} files`);
  if (failed > 0) {
    console.log(`⚠️  Failed: ${failed} files\n`);
  }
  
  return { uploaded, failed };
}

function generateUrlMappings(courses, tag) {
  console.log('\n📝 Generating URL mappings...\n');
  
  const mappings = {};
  
  Object.entries(courses).forEach(([courseName, courseData]) => {
    mappings[courseName] = {};
    
    courseData.files.forEach(file => {
      const oldUrl = `/uploads/${file.relativePath.replace(/\\/g, '/')}`;
      const fileName = encodeURIComponent(file.name);
      const newUrl = `https://github.com/${REPO}/releases/download/${tag}/${fileName}`;
      
      if (!mappings[courseName][file.type]) {
        mappings[courseName][file.type] = [];
      }
      
      mappings[courseName][file.type].push({
        oldUrl,
        newUrl,
        fileName: file.name
      });
    });
  });
  
  // Save mappings to file
  const mappingsPath = path.join(__dirname, 'url-mappings.json');
  fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
  console.log(`✅ URL mappings saved to: ${mappingsPath}\n`);
  
  return mappings;
}

async function testSingleCourse(courseName = 'MatheGrundlageI') {
  console.log('🧪 TEST MODE: Uploading only one course first\n');
  console.log('=' .repeat(60));
  
  if (!checkGitHubCLI() || !checkAuthentication()) {
    process.exit(1);
  }
  
  const courses = organizeFilesByCourse();
  
  if (!courses[courseName]) {
    console.error(`❌ Course "${courseName}" not found!`);
    console.log('Available courses:', Object.keys(courses));
    process.exit(1);
  }
  
  const course = courses[courseName];
  console.log(`\n📚 Course: ${courseName}`);
  console.log(`   Files: ${course.files.length}`);
  console.log(`   Total Size: ${formatBytes(course.totalSize)}\n`);
  
  // Show file list
  console.log('Files to upload:');
  course.files.forEach(f => {
    console.log(`  - ${f.type}/${f.name} (${f.sizeReadable})`);
  });
  
  console.log('\n⚠️  This will create a DRAFT release (not public yet)');
  console.log('   You can review it on GitHub before publishing.\n');
  
  // Create release
  await createRelease(RELEASE_TAG, RELEASE_NAME, true);
  
  // Upload files
  const result = await uploadFilesToRelease(RELEASE_TAG, course.files, courseName);
  
  // Generate URLs
  const mappings = generateUrlMappings({ [courseName]: course }, RELEASE_TAG);
  
  console.log('\n✅ TEST UPLOAD COMPLETE!\n');
  console.log('Next steps:');
  console.log('1. Check the draft release: https://github.com/' + REPO + '/releases');
  console.log('2. Test downloading a file from the release');
  console.log('3. If it works, run the full upload: node scripts/upload-to-github-releases.js --all');
  console.log('4. Update courses.jsx with new URLs from url-mappings.json\n');
}

async function uploadAllCourses() {
  console.log('🚀 FULL MODE: Uploading ALL courses\n');
  console.log('=' .repeat(60));
  
  if (!checkGitHubCLI() || !checkAuthentication()) {
    process.exit(1);
  }
  
  const courses = organizeFilesByCourse();
  const totalCourses = Object.keys(courses).length;
  const totalFiles = Object.values(courses).reduce((sum, c) => sum + c.files.length, 0);
  const totalSize = Object.values(courses).reduce((sum, c) => sum + c.totalSize, 0);
  
  console.log(`\n📊 Summary:`);
  console.log(`   Courses: ${totalCourses}`);
  console.log(`   Total Files: ${totalFiles}`);
  console.log(`   Total Size: ${formatBytes(totalSize)}\n`);
  
  console.log('Courses:');
  Object.entries(courses).forEach(([name, data]) => {
    console.log(`  - ${name}: ${data.files.length} files (${formatBytes(data.totalSize)})`);
  });
  
  console.log('\n⚠️  This will create a DRAFT release');
  console.log('   Review it on GitHub before publishing.\n');
  
  // Create release
  await createRelease(RELEASE_TAG, RELEASE_NAME, true);
  
  // Upload all courses
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const [courseName, courseData] of Object.entries(courses)) {
    const result = await uploadFilesToRelease(RELEASE_TAG, courseData.files, courseName);
    totalUploaded += result.uploaded;
    totalFailed += result.failed;
  }
  
  // Generate URL mappings
  const mappings = generateUrlMappings(courses, RELEASE_TAG);
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ UPLOAD COMPLETE!\n');
  console.log(`📊 Results:`);
  console.log(`   Uploaded: ${totalUploaded}/${totalFiles} files`);
  console.log(`   Failed: ${totalFailed} files`);
  console.log(`   Success Rate: ${Math.round((totalUploaded/totalFiles)*100)}%\n`);
  console.log('Next steps:');
  console.log('1. Check the draft release: https://github.com/' + REPO + '/releases');
  console.log('2. Review all files are uploaded correctly');
  console.log('3. Publish the release (remove draft status)');
  console.log('4. Run: node scripts/update-course-urls.js');
  console.log('   (This will update courses.jsx with GitHub URLs)\n');
}

// Main
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  node scripts/upload-to-github-releases.js [options]

Options:
  --test          Upload only one course for testing (MatheGrundlageI)
  --all           Upload all courses
  --help, -h      Show this help message

Examples:
  # Test with one course first
  node scripts/upload-to-github-releases.js --test
  
  # Upload everything
  node scripts/upload-to-github-releases.js --all
  `);
  process.exit(0);
}

if (args.includes('--test')) {
  testSingleCourse();
} else if (args.includes('--all')) {
  uploadAllCourses();
} else {
  console.log('⚠️  Please specify --test or --all');
  console.log('Run with --help for more information\n');
  process.exit(1);
}
