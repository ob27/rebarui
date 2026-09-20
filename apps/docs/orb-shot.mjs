import { chromium } from "@playwright/test";

const outDir = "/private/tmp/claude-501/-Users-tom-Documents-GitHub-rebarui/110bee77-8d61-4d9e-9b06-84a4ca20505c/scratchpad/orb-shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:4173/dev/orb-comparison", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForTimeout(1000);

const canvas = page.locator("canvas");
for (const t of [0, 2000, 4000, 6000, 8000]) {
  if (t > 0) await page.waitForTimeout(2000);
  await canvas.screenshot({ path: `${outDir}/t${t}.png` });
}

console.log("ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
