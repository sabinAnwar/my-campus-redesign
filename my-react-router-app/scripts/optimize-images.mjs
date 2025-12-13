/**
 * Image Optimization Script
 * Converts and optimizes images for better LCP performance
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = 1920,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📷 Original: ${inputPath}`);
    console.log(`   Size: ${metadata.width}x${metadata.height}`);
    
    let pipeline = image.resize(width, null, { 
      withoutEnlargement: true,
      fit: 'inside'
    });
    
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    }
    
    await pipeline.toFile(outputPath);
    
    const stats = await sharp(outputPath).metadata();
    console.log(`✅ Optimized: ${outputPath}`);
    console.log(`   New size: ${stats.width}x${stats.height}`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  // Optimize the large background image
  const inputPath = join(publicDir, 'iu-students-football.png');
  
  if (existsSync(inputPath)) {
    // Create WebP version (much smaller)
    await optimizeImage(inputPath, join(publicDir, 'iu-students-football.webp'), {
      width: 1920,
      quality: 75,
      format: 'webp'
    });
    
    // Create smaller fallback JPEG
    await optimizeImage(inputPath, join(publicDir, 'iu-students-football-optimized.jpg'), {
      width: 1920,
      quality: 70,
      format: 'jpeg'
    });
    
    // Create mobile version
    await optimizeImage(inputPath, join(publicDir, 'iu-students-football-mobile.webp'), {
      width: 768,
      quality: 70,
      format: 'webp'
    });
  } else {
    console.log('⚠️ Image not found:', inputPath);
  }
  
  console.log('\n✨ Image optimization complete!');
}

main().catch(console.error);
