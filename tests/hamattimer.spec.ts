import { expect, test } from "@playwright/test";

test("ランディングページのタイトルにサービス名が含まれること", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/はまったいまー/);
});

test("「使ってみる」ボタンをクリックするとタイマーページに遷移すること", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "使ってみる" }).first().click();
	await expect(page).toHaveURL(/\/timer/);
});

test("タイマーページでスタートボタンをクリックするとタイマー設定のモーダルダイアログが消えること", async ({ page }) => {
	await page.goto("/timer");
	await page.getByRole("button", { name: "スタート" }).nth(1).click();
	await expect(page.getByText("今から取り組む問題に、どれくらいの時間を使う予定ですか？")).not.toBeVisible();
});

test("タイマーページでスタートボタンをクリックするとタイマー開始の注意喚起メッセージが消えること", async ({ page }) => {
	await page.goto("/timer");
	await page.getByRole("button", { name: "スタート" }).nth(1).click();
	await expect(page.getByText("用意ができたらタイマーをスタートしてください")).toBeVisible();
});
