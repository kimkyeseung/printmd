import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function captureIcons() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const sizes = [16, 48, 128];

  for (const size of sizes) {
    // Create HTML content for each size
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .icon {
            width: ${size * 0.6}px;
            height: ${size * 0.6}px;
            background: white;
            border-radius: ${size * 0.12}px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 ${size * 0.02}px ${size * 0.1}px rgba(0,0,0,0.15);
          }
          .icon svg {
            width: ${size * 0.38}px;
            height: ${size * 0.38}px;
            fill: #667eea;
          }
        </style>
      </head>
      <body>
        <div class="icon">
          <svg viewBox="0 0 24 24">
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm0 2h7v5h5v11H6V4zm9 .5L18.5 8H15V4.5zM8 12v2h8v-2H8zm0 4v2h5v-2H8z"/>
          </svg>
        </div>
      </body>
      </html>
    `;

    await page.setViewport({ width: size, height: size });
    await page.setContent(html);
    await page.screenshot({
      path: join(__dirname, `icon${size}.png`),
      omitBackground: false
    });
    console.log(`Created: icon${size}.png (${size}x${size})`);
  }

  await browser.close();
  console.log('\nDone! Copy these to extension/icons/ folder');
}

captureIcons().catch(console.error);
