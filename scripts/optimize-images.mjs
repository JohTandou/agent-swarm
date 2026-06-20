#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'images');

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;
  
  const webpPath = filePath.replace(ext, '.webp');
  if (fs.existsSync(webpPath)) {
    const origStat = fs.statSync(filePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtime > origStat.mtime) {
      return { file: path.basename(filePath), status: 'skip', reason: 'already optimized' };
    }
  }
  
  try {
    const originalSize = fs.statSync(filePath).size;
    await sharp(filePath).webp({ quality: 85 }).toFile(webpPath);
    const webpSize = fs.statSync(webpPath).size;
    const ratio = ((1 - webpSize / originalSize) * 100).toFixed(1);
    return { file: path.basename(filePath), status: 'ok', originalSize, webpSize, ratio };
  } catch (err) {
    return { file: path.basename(filePath), status: 'error', error: err.message };
  }
}

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log('🔍 Scanning images in', IMAGES_DIR, '...');
  const files = walkDir(IMAGES_DIR).filter(f => !f.endsWith('.webp'));
  const results = [];
  
  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) results.push(result);
  }
  
  let ok = 0, skipped = 0, errors = 0;
  for (const r of results) {
    if (r.status === 'ok') { console.log(`  ✅ ${r.file} → WebP (${r.ratio}% smaller)`); ok++; }
    else if (r.status === 'skip') { skipped++; }
    else { console.log(`  ❌ ${r.file}: ${r.error}`); errors++; }
  }
  
  console.log(`\n📊 ${ok} converted, ${skipped} skipped, ${errors} errors`);
}

main().catch(console.error);
