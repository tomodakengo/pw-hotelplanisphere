import { test } from "@playwright/test";
import { parseCSV } from "./csvParser";
import * as km from "./keywordMethods";

const keywords = {
  URLを開く: km.URLを開く,
  Pathを確認する: km.Pathを確認する,
  メニューをクリックする: km.メニューをクリックする,
  プラン表示を確認する: km.プラン表示を確認する,
};

test("Keyword Driven Test", async ({ page }) => {
  try {
    const csvFilePath = "./tests/KeywordDrivenTest.csv";
    const testSteps = parseCSV(csvFilePath);

    for (const [keyword, args] of testSteps) {
      if (typeof keywords[keyword] === "function") {
        await keywords[keyword](page, args);
      } else {
        console.error(`${keyword}は定義されていません`);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await page.screenshot({ path: "./screenshot.png" });
  }
});
