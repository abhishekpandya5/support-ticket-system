/**
 * Captures ticket detail, status workflow, and edit screenshots.
 * Requires frontend (5173) and backend API running.
 *
 *   npx playwright install chromium
 *   node scripts/capture-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    'Playwright is not installed. Run: npx playwright install chromium\n' +
      'Or install locally: npm i -D playwright',
  );
  process.exit(1);
}

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const desktopDir = path.join(rootDir, 'docs/screenshots/desktop-view');

async function main() {
  await mkdir(desktopDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto(`${BASE_URL}/tickets`, { timeout: 15_000 });
    await page.waitForTimeout(1_500);

    const link = page.locator('table tbody tr a').first();
    if (await link.count()) {
      await link.click();
    } else {
      await page.goto(`${BASE_URL}/tickets/new`);
      await page.getByLabel(/title/i).fill('Screenshot detail ticket');
      await page.getByLabel(/description/i).fill('Created for screenshot capture.');
      await page.getByRole('button', { name: /create ticket/i }).click();
      await page.waitForURL(/\/tickets\/[a-f0-9]+$/, { timeout: 15_000 });
    }

    await page.waitForTimeout(1_000);
    await page.screenshot({
      path: path.join(desktopDir, 'desktop-view-ticket-detail.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(desktopDir, 'desktop-view-ticket-status-workflow.png'),
      fullPage: true,
    });

    const editLink = page.getByRole('link', { name: /^edit$/i });
    if (await editLink.count()) {
      await editLink.click();
      await page.waitForURL(/\/edit$/);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(desktopDir, 'desktop-view-edit-ticket.png'),
        fullPage: true,
      });
    }

    console.log('Screenshots saved to', desktopDir);
  } finally {
    await browser.close();
  }
}

void main();
