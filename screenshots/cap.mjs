const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/admin/nexus-jeunesses/screenshots/navbar.png', clip: { x: 0, y: 0, width: 1280, height: 100 } });
  await page.screenshot({ path: 'C:/Users/admin/nexus-jeunesses/screenshots/hero.png', clip: { x: 0, y: 0, width: 1280, height: 680 } });
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/admin/nexus-jeunesses/screenshots/modules.png', fullPage: false });
  await browser.close();
})();
