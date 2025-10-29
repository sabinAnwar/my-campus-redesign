import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, 'app/routes');

fs.readdirSync(routesDir)
  .filter(f => f.endsWith('.jsx') && !f.includes('api'))
  .forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has a loader
    if (content.includes('export const loader')) {
      console.log(`✓ ${file} already has loader`);
      return;
    }
    
    // Skip if it's an API route
    if (content.includes('/api/')) {
      console.log(`⊘ ${file} is an API route, skipping`);
      return;
    }
    
    // Find the "export default" line
    const lines = content.split('\n');
    const exportDefaultIndex = lines.findIndex(l => l.includes('export default'));
    
    if (exportDefaultIndex !== -1) {
      // Insert loader before export default
      const loaderCode = 'export const loader = async () => {\n  return null;\n};\n';
      lines.splice(exportDefaultIndex, 0, loaderCode);
      
      const newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Added loader to ${file}`);
    }
  });

console.log('\n✅ All loaders added!');
