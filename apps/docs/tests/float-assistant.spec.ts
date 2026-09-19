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

    // Click minimize button
    const minimizeBtn = page.locator('[aria-label="Minimize assistant"]');
    await expect(minimizeBtn).toBeVisible();
    await minimizeBtn.click();

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
