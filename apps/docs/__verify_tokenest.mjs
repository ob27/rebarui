import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:4510/", { waitUntil: "networkidle" });
const heroText = await page.locator("main p").first().textContent();
console.log("Hero text:", heroText);

await page.goto("http://localhost:4510/docs/token-estimate", { waitUntil: "networkidle" });
console.log("token-estimate page loaded, errors:", errors.length ? errors : "none");

// Open devtools panel (forceEnabled via test harness? Check if toggle button exists in prod build)
const toggle = page.locator('[aria-label="Rebar DevTools"]');
const toggleCount = await toggle.count();
console.log("DevTools toggle present:", toggleCount);

console.log("All console errors so far:", errors.length ? errors : "none");
await browser.close();
