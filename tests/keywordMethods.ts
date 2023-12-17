import { Page, expect } from "@playwright/test";

export function URLを開く(page: Page, url: string) {
  return page.goto(url);
}

export function Pathを確認する(page: Page, path: string) {
  return expect(page).toHaveURL(RegExp(path));
}

export function メニューをクリックする(page: Page, menu: string) {
  return page.getByRole("link", { name: menu }).click();
}
export function ボタンをクリックする(page: Page, menu: string) {
  return page.getByRole("button", { name: menu }).click();
}

export function プラン表示を確認する(page: Page, plans: string) {
  const plansArr: any[] = plans.split("|");
  plansArr.forEach((plan) => {
    expect(
      page.locator("h5.card-title").filter({ hasText: plan })
    ).toBeEnabled();
  });
}
