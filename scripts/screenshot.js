const { chromium } = require("playwright");

const URL = process.argv[2] || "http://localhost:3000";
const OUTPUT_DIR = process.argv[3] || "/tmp";

async function scrollPage(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 400) {
      window.scrollTo(0, i);
      await delay(250);
    }
    window.scrollTo(0, 0);
    await delay(500);
  });
}

(async () => {
  const browser = await chromium.launch();

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await scrollPage(page);

    const fullPath = `${OUTPUT_DIR}/sb-${vp.name}-full.png`;
    const heroPath = `${OUTPUT_DIR}/sb-${vp.name}-hero.png`;

    await page.screenshot({ path: fullPath, fullPage: true });
    await page.screenshot({ path: heroPath });

    console.log(`${vp.name}: ${fullPath}, ${heroPath}`);
    await page.close();
  }

  await browser.close();
  console.log("All screenshots captured.");
})();
