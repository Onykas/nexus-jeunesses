const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // Homepage - navbar zone
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/navbar.png', clip: { x: 0, y: 0, width: 1280, height: 110 } });
  
  // Homepage - hero
  await page.screenshot({ path: 'screenshots/hero.png', clip: { x: 0, y: 0, width: 1280, height: 700 } });

  // Homepage - modules section
  await page.screenshot({ path: 'screenshots/modules.png', clip: { x: 0, y: 700, width: 1280, height: 900 } });

  // Footer
  const footerY = await page.evaluate(() => document.querySelector('footer').getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), footerY);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/footer.png', clip: { x: 0, y: footerY - await page.evaluate(() => window.scrollY) + 0, width: 1280, height: 350 } });

  await browser.close();
})();
