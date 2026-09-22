import { test, expect } from "@playwright/test";

test.describe("FloatAssistant", () => {
  test("renders without canvas color errors", async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to the float assistant page
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");

    // Wait for the assistant button to appear
    const assistantButton = page.locator('[data-rebar-part="trigger"]');
    await expect(assistantButton).toBeVisible({ timeout: 5000 });

    // Check for canvas color parsing errors
    const colorErrors = errors.filter((e) =>
      e.includes("addColorStop") && e.includes("could not be parsed as a color")
    );
    expect(colorErrors).toHaveLength(0);

    // Verify the canvas is rendering (should have content)
    const canvas = page.locator("canvas.rebar-float-assistant-orb-canvas");
    await expect(canvas).toBeVisible();
  });

  test("assistant button is draggable", async ({ page }) => {
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");

    const assistantButton = page.locator('[data-rebar-part="trigger"]');
    await expect(assistantButton).toBeVisible();

    // Get initial position
    const initialBox = await assistantButton.boundingBox();
    expect(initialBox).not.toBeNull();

    // Drag the button
    if (initialBox) {
      const startX = initialBox.x + initialBox.width / 2;
      const startY = initialBox.y + initialBox.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 100, startY + 100, { steps: 10 });
      await page.mouse.up();

      // Verify position changed
      const newBox = await assistantButton.boundingBox();
      expect(newBox).not.toBeNull();
      if (newBox) {
        expect(Math.abs(newBox.x - initialBox.x)).toBeGreaterThan(10);
      }
    }
  });

  test("panel appears when button is clicked", async ({ page }) => {
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");

    const assistantButton = page.locator('[data-rebar-part="trigger"]');
    await assistantButton.click();

    // Panel should appear
    const panel = page.locator('[data-rebar-part="panel"]');
    await expect(panel).toBeVisible({ timeout: 3000 });
  });

  test("panel stays within viewport bounds", async ({ page }) => {
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");

    const assistantButton = page.locator('[data-rebar-part="trigger"]');
    await assistantButton.click();

    const panel = page.locator('[data-rebar-part="panel"]');
    await expect(panel).toBeVisible();

    // Get panel and viewport dimensions
    const panelBox = await panel.boundingBox();
    const viewport = page.viewportSize();

    expect(panelBox).not.toBeNull();
    expect(viewport).not.toBeNull();

    if (panelBox && viewport) {
      // Panel should not exceed viewport
      expect(panelBox.x).toBeGreaterThanOrEqual(0);
      expect(panelBox.y).toBeGreaterThanOrEqual(0);
      expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);
      expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(viewport.height);
    }
  });

  test("minimize button collapses to dot", async ({ page }) => {
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");

    // Open the assistant first
    const assistantButton = page.locator('[data-rebar-part="trigger"]');
    await assistantButton.click();

    // Wait for panel to appear
    const panel = page.locator('[data-rebar-part="panel"]');
    await expect(panel).toBeVisible();

    // Click minimize button inside panel header
    const minimizeBtn = panel.locator('[aria-label="Minimize assistant"]');
    await expect(minimizeBtn).toBeVisible();
    await minimizeBtn.click({ force: true });

    // Button should now be minimized (smaller)
    const buttonBox = await assistantButton.boundingBox();
    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      // Minimized button should be 15x15px
      expect(buttonBox.width).toBeCloseTo(15, 0);
      expect(buttonBox.height).toBeCloseTo(15, 0);
    }
  });
});

test.describe("FloatAssistant edge-dock", () => {
  // The demo page's own trigger defaults to the bottom-right corner, the same corner the docs
  // site's DevTools toggle occupies — hidden here so raw mouse coordinates land on the trigger
  // itself, not the DevTools button sitting on top of it.
  async function gotoAndHideDevtools(page: import("@playwright/test").Page) {
    await page.goto("/opinions/float-assistant");
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({ content: ".rebar-devtools-toggle, .rebar-devtools { display: none !important; }" });
  }

  test("dragging near the right edge reveals a peeking rail", async ({ page }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(page.viewportSize()!.width - 90 - box.width, box.y - 200, { steps: 5 });

    const rail = page.locator('[data-rebar-part="edge-rail"]');
    await expect(rail).toHaveAttribute("data-rebar-state", "peeking");

    await page.mouse.up();
  });

  test("holding in the peek band past the hold delay escalates to expanded", async ({ page }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(page.viewportSize()!.width - 90 - box.width, box.y - 200, { steps: 5 });

    const rail = page.locator('[data-rebar-part="edge-rail"]');
    await expect(rail).toHaveAttribute("data-rebar-state", "peeking");
    await expect(rail).toHaveAttribute("data-rebar-state", "expanded", { timeout: 2000 });

    await page.mouse.up();
  });

  test("dropping inside the expanded rail docks as a full-height sidebar", async ({ page }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    // Straight into the expand band — commits immediately, no hold needed.
    await page.mouse.move(page.viewportSize()!.width - 20 - box.width, box.y - 400, { steps: 8 });
    await page.mouse.up();

    const panel = page.locator('[data-rebar-part="panel"]');
    await expect(panel).toHaveAttribute("data-rebar-state", "sidebar", { timeout: 2000 });
    const panelBox = await panel.boundingBox();
    const viewport = page.viewportSize();
    expect(panelBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (panelBox && viewport) {
      expect(panelBox.height).toBeCloseTo(viewport.height, 0);
      // Right-anchored, not pixel-exact against the reported viewport width (a vertical
      // scrollbar/box-model rounding can shift this by a handful of px) — within 15px is "flush
      // against the right edge," not "somewhere in the middle of the page."
      expect(panelBox.x + panelBox.width).toBeGreaterThan(viewport.width - 15);
    }
    await expect(page.locator('[data-rebar-part="sidebar-input"]')).toBeVisible();
  });

  test("sidebar toolbar wiring — attachment, slash-command, and history buttons fire their handlers", async ({
    page,
  }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(page.viewportSize()!.width - 20 - box.width, box.y - 400, { steps: 8 });
    await page.mouse.up();

    const sidebarInput = page.locator('[data-rebar-part="sidebar-input"]');
    await expect(sidebarInput).toBeVisible();
    // The demo page wires all three to no-op handlers — asserting they're clickable (not
    // omitted, per the "no dead control" convention) rather than a spy result.
    await expect(page.locator(".rebar-float-assistant-sidebar-toolbar-btn")).toHaveCount(3);
    await expect(page.locator(".rebar-float-assistant-model-pill")).toHaveCount(1);
    for (const btn of await page.locator(".rebar-float-assistant-sidebar-toolbar-btn").all()) {
      await btn.click({ force: true });
    }
  });

  test("releasing while only peeking (not held, not deep) snaps back without docking", async ({ page }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(page.viewportSize()!.width - 90 - box.width, box.y - 200, { steps: 5 });
    await page.mouse.up(); // released well under the hold delay

    const rail = page.locator('[data-rebar-part="edge-rail"]');
    await expect(rail).toHaveCount(0);
    // A release that never committed the dock never opens the panel at all — it doesn't exist,
    // rather than existing with some other dockMode.
    await expect(page.locator('[data-rebar-part="panel"]')).toHaveCount(0);
  });

  test("dragging toward a non-right edge never shows the rail", async ({ page }) => {
    await gotoAndHideDevtools(page);
    const trigger = page.locator('[data-rebar-part="trigger"]');
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(200, 200, { steps: 8 }); // toward the top-left, away from the right edge

    const rail = page.locator('[data-rebar-part="edge-rail"]');
    await expect(rail).toHaveCount(0);

    await page.mouse.up();
  });
});
