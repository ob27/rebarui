import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 700 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/docs/heuristics", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(500);

const sectionNav = page.locator('nav[aria-label="Section navigation"]');
const pageIndex = page.locator('nav[aria-label="Page index"]');
console.log("SectionNav (right, in-page) count:", await sectionNav.count());
console.log("NavIndex (left, cross-page) count:", await pageIndex.count());

const scrollBox = sectionNav.locator('[data-rebar-part="scroll"]');
const box = await scrollBox.boundingBox();
console.log("Scroll region height:", box?.height);
const isScrollable = await scrollBox.evaluate((el) => el.scrollHeight > el.clientHeight);
console.log("Is scrollable:", isScrollable);

await page.goto("http://localhost:3000/docs/archetypes", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const body = await page.locator("body").innerText();
console.log("Has 'page-index' entry:", body.includes("page-index"));
console.log("Has clickable 'Example section' link:", await page.getByRole("link", { name: "Example section" }).count());

console.log("errors:", errors.length ? errors : "none");
await browser.close();
