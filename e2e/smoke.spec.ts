import { expect, test } from "@playwright/test";

test.describe("landing page smoke", () => {
  test("renders the coming-soon headline and mode toggle", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /backroom — coming soon/i }),
    ).toBeVisible();

    const modeToggle = page.getByRole("radiogroup", { name: /colour mode/i });
    await expect(modeToggle).toBeVisible();

    // Three radio options: System / Light / Dark
    await expect(modeToggle.getByRole("radio")).toHaveCount(3);
  });
});
