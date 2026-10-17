import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { spawn } = await import('node:child_process');
const server = process.env.INVITATION_DEV_URL ? undefined : spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5182', '--strictPort'], { stdio: 'ignore', windowsHide: true });
const baseUrl = process.env.INVITATION_DEV_URL || 'http://127.0.0.1:5182';
let available = false;
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(baseUrl)).ok) { available = true; break; } } catch {}
  await new Promise(resolve => setTimeout(resolve, 200));
}
if (!available) { server?.kill(); throw new Error('Preview server did not start'); }
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(baseUrl);
  const data = await page.evaluate(async () => {
    const { createInvitationImage } = await import('/src/lib/invitation-image.ts');
    const file = await createInvitationImage();
    return Array.from(new Uint8Array(await file.arrayBuffer()));
  });
  const png = Buffer.from(data);
  await writeFile(new URL('../public/images/invitation/invitation-card.png', import.meta.url), png);
  console.log(`Exported invitation-card.png: ${png.readUInt32BE(16)} x ${png.readUInt32BE(20)}`);
} finally { await browser.close(); server?.kill(); }
