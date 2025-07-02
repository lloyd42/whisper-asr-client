import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle("Vite + React + TS");
});

test("counter interaction", async ({ page }) => {
	await page.goto("/");
	const counter = page.getByRole("button", { name: /count is/i });
	await counter.click();
	await expect(counter).toHaveText("count is 1");
});
