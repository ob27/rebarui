import { chromium } from "@playwright/test";
const outDir = "/private/tmp/claude-501/-Users-tom-Documents-GitHub-rebarui/110bee77-8d61-4d9e-9b06-84a4ca20505c/scratchpad/orb-shots";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto("http://localhost:4173/dev/orb-comparison", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForTimeout(500);
const canvas = page.locator("canvas");
const times = [0,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000];
let prev = 0;
for (const t of times) {
  if (t > prev) await page.waitForTimeout(t - prev);
  prev = t;
  await canvas.screenshot({ path: `${outDir}/d${t}.png` });
}
await browser.close();
