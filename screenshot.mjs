/**
 * screenshot.mjs
 * Usage: node screenshot.mjs [url] [outputName]
 * Requires puppeteer: npm install puppeteer
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
const url    = process.argv[2] || 'http://localhost:3000';
const name   = process.argv[3] || `screenshot_${Date.now()}`;
const outDir = join(__dir, 'temporary screenshots');

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();

// Desktop viewport
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200)); // allow animations to settle

const desktopPath = join(outDir, `${name}_desktop.png`);
await page.screenshot({ path: desktopPath, fullPage: true });
console.log(`✦ Desktop screenshot saved: ${desktopPath}`);

// Mobile viewport
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));

const mobilePath = join(outDir, `${name}_mobile.png`);
await page.screenshot({ path: mobilePath, fullPage: true });
console.log(`✦ Mobile screenshot saved:  ${mobilePath}`);

await browser.close();
console.log('\n✦ Done. Check "temporary screenshots/" folder.\n');
