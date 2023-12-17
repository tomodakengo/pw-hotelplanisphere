import { test } from "@playwright/test";
import { parseCSV } from "./csvParser";
import * as km from "./keywordMethods";

const keywords = {
  URLを開く: km.URLを開く,
  Pathを確認する: km.Pathを確認する,
  メニューをクリックする: km.メニューをクリックする,
  ボタンをクリックする: km.ボタンをクリックする,
  プラン表示を確認する: km.プラン表示を確認する,
};


try {
  const csvFilePath = "./tests/KeywordDrivenTest.csv";
  const testSteps = parseCSV(csvFilePath);

  for (const [testStep, values] of Object.entries(testSteps)) {
    test(testStep, async ({ page }) => {
      for (const [keyword, args] of values) {
        await executeKeyword(page, keyword, args);
      }
      await page.screenshot({ path: "./screenshot.png" });
    });
  }

  async function executeKeyword(page: any, keyword: string, args: string) {
    if (typeof keywords[keyword] === "function") {
      await keywords[keyword](page, args);
    } else {
      console.error(`${keyword}は定義されていません`);
    }
  }
} catch (error) {
  console.error(error);
} finally {
  console.log("テスト終了");
}
