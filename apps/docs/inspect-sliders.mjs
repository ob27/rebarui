import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto("http://localhost:4173/dev/orb-comparison", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
const sliders = await page.locator('input[type="range"], [role="slider"]').all();
console.log("count:", sliders.length);
for (const s of sliders.slice(0, 3)) {
  console.log(await s.evaluate(el => el.outerHTML.slice(0, 300)));
}
await browser.close();
