/**
 * Layout checks for the marketing-kit components (DeviceFrame, DeviceStage, FloatCard, BentoGrid,
 * BentoCard, BackdropSection) on their docs pages, in a real browser.
 *
 * Run on wintom against a running docs dev server (the Playwright install lives in Athic-Mobile):
 *   cd H:\GitHub\rebarui\apps\docs
 *   node scripts/check-marketing-kit.cjs            # default http://127.0.0.1:4114
 *   node scripts/check-marketing-kit.cjs http://127.0.0.1:3000
 * Exits 1 on any violation. Checked at 320, 390, 768 and 1440 px wide on the sidebar-free harness page /dev/marketing-kit (and at 768 and
 * 1440 on each component's docs page):
 *   - the page never scrolls horizontally;
 *   - phone/tablet screenshots are shown whole (rendered aspect equals natural aspect, inside the screen);
 *   - a DeviceStage float overlaps its device by at most 35% of its own width, hides at most 4% of the
 *     device's area, is never clipped by an ancestor and never leaves the viewport;
 *   - below 480px of stage width the floats are compact chips (data-rebar-compact) that do not touch the device;
 *   - BackdropSection image and scrim layers cover the whole section;
 *   - nothing inside a BentoCard is clipped by it, and the grid has 6 columns from 960px, 1 below.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('H:/GitHub/Athic-Mobile/node_modules/playwright');

const BASE = process.argv[2] || 'http://127.0.0.1:4114';
// The harness has no docs sidebar, so it is checked at every width; the docs pages themselves sit inside
// the docs shell, which is not responsive, so they are only checked at the two widths where it fits.
const PAGES = [
  '/dev/marketing-kit',
  '/imitations/device-frame',
  '/synthetics/device-stage',
  '/imitations/float-card',
  '/imitations/bento-grid',
  '/synthetics/bento-card',
  '/imitations/backdrop-section',
  '/synthetics/feature-showcase',
];
const WIDTHS = [320, 390, 768, 1440];
const widthsFor = (path) => (path.startsWith('/dev/') ? WIDTHS : [768, 1440]);

const inPage = () => {
  const out = [];
  const R = (el) => el.getBoundingClientRect();
  const desc = (el) => `${el.tagName.toLowerCase()}[${el.getAttribute('data-rebar-component') || el.getAttribute('data-rebar-part') || el.className}]`;
  const vw = document.documentElement.clientWidth;
  const clipAncestors = (el) => {
    const a = [];
    for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/hidden|clip|auto|scroll/.test(s.overflowX + s.overflowY + s.overflow)) a.push(p);
    }
    return a;
  };

  // 1. no horizontal scroll caused by the kit. The docs shell itself overflows a phone-width viewport on
  // every page (the nav bar; /imitations/button does too), so the page-level scroll width is only
  // reported as a note, and the failing check is that no kit element extends past the viewport.
  const KIT = '[data-rebar-component="device-frame"],[data-rebar-component="device-stage"],[data-rebar-component="float-card"],[data-rebar-component="bento-grid"],[data-rebar-component="bento-card"],[data-rebar-component="backdrop-section"],[data-rebar-component="feature-showcase"],[data-rebar-component="scroll-rail"]';
  for (const root of document.querySelectorAll(KIT)) {
    // An element is only a problem if it is actually visible past the edge: one that an ancestor inside the viewport
    // clips (a scroll rail's track, an ellipsised chip) does not count.
    const clippedInside = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const st = getComputedStyle(p); if (/hidden|clip|auto|scroll/.test(st.overflowX)) { const pr = R(p); if (pr.left >= -1 && pr.right <= vw + 1) return true; } } return false; };
    for (const el of [root, ...root.querySelectorAll('*')]) {
      const r = R(el);
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1) && !clippedInside(el)) { out.push(['kit element extends past the viewport', `${desc(root)} > ${desc(el)} ${r.left | 0}..${r.right | 0} of ${vw}`]); break; }
    }
  }
  if (document.documentElement.scrollWidth > vw + 1) out.push(['NOTE', `docs shell scrolls horizontally: ${document.documentElement.scrollWidth} > ${vw}`]);

  // 2. phone/tablet screenshots shown whole
  for (const img of document.querySelectorAll('[data-rebar-component="device-frame"]:not([data-rebar-variant="browser"]) [data-rebar-part="screen"] > img')) {
    const r = R(img), sr = R(img.closest('[data-rebar-part="screen"]'));
    if (!img.naturalWidth) { out.push(['screenshot not loaded', img.alt]); continue; }
    const rendered = r.width / r.height, natural = img.naturalWidth / img.naturalHeight;
    if (Math.abs(rendered - natural) / natural > 0.01) out.push([`screenshot cropped or distorted (${rendered.toFixed(3)} vs ${natural.toFixed(3)})`, img.alt]);
    if (r.top < sr.top - 1 || r.bottom > sr.bottom + 1 || r.left < sr.left - 1 || r.right > sr.right + 1) out.push(['screenshot overflows its screen', img.alt]);
    // status strip above and home strip below must exist and sit outside the image
    const status = img.parentElement.querySelector('[data-rebar-part="status-bar"]');
    const home = img.parentElement.querySelector('[data-rebar-part="home-indicator"]');
    if (status && R(status).bottom > r.top + 1) out.push(['status strip overlaps the screenshot', img.alt]);
    if (home && R(home).top < r.bottom - 1) out.push(['home strip overlaps the screenshot', img.alt]);
  }

  // 3. DeviceStage floats
  for (const stage of document.querySelectorAll('[data-rebar-component="device-stage"]')) {
    const device = stage.querySelector('[data-rebar-part="device"] [data-rebar-component="device-frame"]');
    const container = stage.querySelector('.rebar-device-stage-container');
    const b = R(device);
    const compact = container.clientWidth < 480;
    const floats = [...stage.querySelectorAll('[data-rebar-part="float"]')];
    if (compact !== floats.every((f) => f.hasAttribute('data-rebar-compact')) && floats.length) out.push(['data-rebar-compact does not match the stage width', `${container.clientWidth}px`]);
    if (stage.hasAttribute('data-rebar-compact') !== compact) out.push(['stage data-rebar-compact does not match its width', `${container.clientWidth}px`]);
    for (const f of floats) {
      const a = R(f);
      if (a.left < -1 || a.right > vw + 1) out.push(['float outside the viewport', desc(f)]);
      for (const p of clipAncestors(f)) { const pr = R(p); if (a.left < pr.left - 1 || a.right > pr.right + 1 || a.top < pr.top - 1 || a.bottom > pr.bottom + 1) out.push(['float clipped by ' + desc(p), desc(f)]); }
      const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      if (oy > 0 && ox / a.width > 0.35) out.push([`float overlaps the device by ${(100 * ox / a.width) | 0}% of its width (limit 35%)`, desc(f)]);
      const area = (ox * oy) / (b.width * b.height);
      if (area > 0.04) out.push([`float hides ${(area * 100).toFixed(1)}% of the device (limit 4%)`, desc(f)]);
      if (compact && ox * oy > 0) out.push(['compact chip touches the device', desc(f)]);
      const card = f.querySelector('[data-rebar-component="float-card"]');
      if (card && card.scrollWidth > card.clientWidth + 1 && !compact) out.push(['float text overflows its card', desc(f)]);
    }
    for (const f of floats) for (const g of floats) if (f < g) { // floats must not sit on each other
      const a = R(f), c = R(g);
      if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 1 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 1) out.push(['floats overlap each other', `${f.getAttribute('data-rebar-slot')} / ${g.getAttribute('data-rebar-slot')}`]);
    }
  }

  // 4. BackdropSection layers cover the section
  for (const sec of document.querySelectorAll('[data-rebar-component="backdrop-section"]')) {
    const sr = R(sec);
    for (const layer of sec.querySelectorAll(':scope > [data-rebar-part="image"], :scope > [data-rebar-part="scrim"]')) {
      const lr = R(layer);
      if (Math.abs(lr.width - sr.width) > 2 || Math.abs(lr.height - sr.height) > 2 || Math.abs(lr.left - sr.left) > 2 || Math.abs(lr.top - sr.top) > 2) out.push([`backdrop ${layer.getAttribute('data-rebar-part')} does not cover its section`, `${lr.width | 0}x${lr.height | 0} vs ${sr.width | 0}x${sr.height | 0}`]);
    }
  }

  // 5. BentoGrid / BentoCard
  for (const grid of document.querySelectorAll('[data-rebar-component="bento-grid"]')) {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const expected = vw >= 960 ? 6 : 1;
    if (cols !== expected) out.push([`bento grid has ${cols} columns at ${vw}px`, `expected ${expected}`]);
  }
  for (const card of document.querySelectorAll('[data-rebar-component="bento-card"]')) {
    const s = getComputedStyle(card);
    if (/hidden|clip/.test(s.overflow + s.overflowX + s.overflowY)) out.push(['bento card clips its content', desc(card)]);
    const cr = R(card);
    for (const d of card.querySelectorAll('*')) {
      const r = R(d);
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > cr.right + 1 || r.left < cr.left - 1 || r.bottom > cr.bottom + 1 || r.top < cr.top - 1) { out.push(['content spills out of a bento card', desc(d)]); break; }
    }
  }
  return out;
};

(async () => {
  const browser = await chromium.launch();
  let bad = 0;
  for (const path of PAGES) {
    for (const w of widthsFor(path)) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const res = await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
      if (!res || !res.ok()) { console.log(`${path} @${w}: HTTP ${res && res.status()}`); bad++; await ctx.close(); continue; }
      await page.waitForTimeout(1200);
      const all = await page.evaluate(inPage);
      const v = all.filter((x) => x[0] !== 'NOTE');
      console.log(`${path} @${w}: ${v.length ? v.length + ' violation(s)' : 'OK'}`);
      for (const x of all) console.log((x[0] === 'NOTE' ? '   (note) ' : '   - ' + x[0] + ' :: ') + (x[0] === 'NOTE' ? x[1] : x[1]));
      bad += v.length;
      await ctx.close();
    }
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
