import fs from "fs/promises";
import path from "path";

const PUBLIC_STUD_DIR = path.resolve("public", "uploads", "studiengaenge");
const OUTPUT_FILE = path.resolve("app", "data", "public-study-files.json");

async function collectFiles(dir, baseDir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await collectFiles(fullPath, baseDir)));
      } else if (entry.isFile()) {
        if (entry.name === ".gitkeep") continue;
        const rel = path.relative(baseDir, fullPath).split(path.sep).join("/");
        results.push(rel);
      }
    }
    return results;
  } catch (e) {
    console.warn(`Warning: Could not read ${dir}:`, e.message);
    return [];
  }
}

async function run() {
  console.log("Generating public study files manifest...");
  const files = await collectFiles(PUBLIC_STUD_DIR, PUBLIC_STUD_DIR);
  
  // Ensure the directory exists
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(files, null, 2));
  console.log(`Manifest saved to ${OUTPUT_FILE} with ${files.length} entries.`);
}

run();
