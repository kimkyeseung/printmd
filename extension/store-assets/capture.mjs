import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function capture() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Small promo tile (440x280)
  await page.setViewport({ width: 440, height: 280 });
  await page.goto(`file://${join(__dirname, 'promo-small.html')}`);
  await page.screenshot({ path: join(__dirname, 'promo-small.png') });
  console.log('Created: promo-small.png (440x280)');

  // Marquee promo tile (1400x560)
  await page.setViewport({ width: 1400, height: 560 });
  await page.goto(`file://${join(__dirname, 'promo-marquee.html')}`);
  await page.screenshot({ path: join(__dirname, 'promo-marquee.png') });
  console.log('Created: promo-marquee.png (1400x560)');

  // Screenshot (1280x800)
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`file://${join(__dirname, 'screenshot.html')}`);
  await page.screenshot({ path: join(__dirname, 'screenshot.png') });
  console.log('Created: screenshot.png (1280x800)');

  await browser.close();
  console.log('\nDone! All images saved to store-assets/');
}

capture().catch(console.error);
