#!/usr/bin/env node

/**
 * Update Course URLs from Local to GitHub Releases
 * 
 * This script reads url-mappings.json and updates courses.jsx
 * to use GitHub Release URLs instead of local /uploads/ paths.
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_FILE = path.join(__dirname, 'url-mappings.json');
const COURSES_FILE = path.join(__dirname, '../app/routes/courses.jsx');
const BACKUP_FILE = path.join(__dirname, '../app/routes/courses.jsx.backup');

console.log('🔄 Updating Course URLs...\n');

// Check if mappings file exists
if (!fs.existsSync(MAPPINGS_FILE)) {
  console.error('❌ Error: url-mappings.json not found!');
  console.error('Please run upload-to-github-releases.js first.\n');
  process.exit(1);
}

// Load URL mappings
const mappings = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8'));
console.log(`✅ Loaded URL mappings for ${Object.keys(mappings).length} courses\n`);

// Read courses.jsx
let coursesContent = fs.readFileSync(COURSES_FILE, 'utf8');

// Create backup
fs.writeFileSync(BACKUP_FILE, coursesContent);
console.log(`✅ Backup created: ${path.basename(BACKUP_FILE)}\n`);

// Replace URLs
let replacementCount = 0;

Object.entries(mappings).forEach(([courseName, types]) => {
  console.log(`📚 Processing: ${courseName}`);
  
  Object.entries(types).forEach(([type, files]) => {
    files.forEach(({ oldUrl, newUrl, fileName }) => {
      // Escape special characters for regex
      const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Replace the URL
      const regex = new RegExp(escapedOldUrl, 'g');
      const matches = coursesContent.match(regex);
      
      if (matches) {
        coursesContent = coursesContent.replace(regex, newUrl);
        replacementCount += matches.length;
        console.log(`  ✅ ${fileName}`);
      } else {
        console.log(`  ⚠️  ${fileName} - URL not found in courses.jsx`);
      }
    });
  });
  
  console.log('');
});

// Write updated file
fs.writeFileSync(COURSES_FILE, coursesContent);

console.log('=' .repeat(60));
console.log(`✅ Update Complete!\n`);
console.log(`📊 Results:`);
console.log(`   URLs replaced: ${replacementCount}`);
console.log(`   Backup saved: ${path.basename(BACKUP_FILE)}\n`);
console.log('Next steps:');
console.log('1. Review the changes in courses.jsx');
console.log('2. Test the app locally: npm run dev');
console.log('3. Verify PDFs load from GitHub');
console.log('4. Deploy to production: git push\n');

// Show example URLs
console.log('Example updated URLs:');
const firstCourse = Object.keys(mappings)[0];
const firstType = Object.keys(mappings[firstCourse])[0];
const firstFile = mappings[firstCourse][firstType][0];
console.log(`  Old: ${firstFile.oldUrl}`);
console.log(`  New: ${firstFile.newUrl}\n`);
