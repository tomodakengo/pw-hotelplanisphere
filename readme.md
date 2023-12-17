![Static Badge](https://img.shields.io/badge/playwirhgt-1.40.1-green?link=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fplaywright)

# キーワードドリブン自動テスト

[HOTEL PLANISPHERE](https://hotel.testplanisphere.dev/ja/index.html)をテスト対象に、キーワードで駆動する自動テストのサンプルを作成しました。

## まずは動くところが見たい

リポジトリから Pull したら、下記のコマンドを実行してください。<br>
※UI モードでテストを実行することで、動きがかなり分かりやすいです。

`npx playwright test --ui`

## どんなテストケースが動くの？

作成したテストケースは`Keyword Driven Test`のみです。<br>
このテストケースでは下記の手順を実施しています。<br>

tc1_プラン全表示確認
1. https://hotel.testplanisphere.dev/ja/ に遷移する
1. URL に「/ja/」が含まれているか確認する
1. ナビゲーションメニューの「宿泊予約」をクリックする
1. URL に「/ja/plans.html」が含まれているか確認する
1. 宿泊プラン一覧に下記が表示されているか確認する
   - お得な特典付きプラン
   - 素泊まり
   - 出張ビジネスプラン
   - エステ・マッサージプラン
   - 貸し切り露天風呂プラン
   - カップル限定プラン
   - テーマパーク優待プラン

tc2_メニュークリック後の表示確認
1. https://hotel.testplanisphere.dev/ja/ に遷移する
1. URL に「/ja/」が含まれているか確認する
1. ナビゲーションメニューの「宿泊予約」をクリックする
1. URL に「/ja/plans.html」が含まれているか確認する
1. ナビゲーションメニューの「会員登録」をクリックする
1. URL に「/ja/signup.html」が含まれているか確認する
1. ナビゲーションメニューの「ログイン」ボタンをクリックする
1. URL に「/ja/login.html」が含まれているか確認する


## どうやって動いているの？

### ファイル構成

| ファイル名 | 説明 |
| ---- | ---- |
| `csvParser.ts` | CSV ファイルを`[[キーワード, 引数],[キーワード, 引数]]`の配列に変換する |
| `keywordMethods.ts` | キーワードごとにどんな操作・判定をするかを定義する |
| `testScript.spec.ts` | `csvParser.ts`で配列になった`testSteps`を周回させ、指定のキーワードと一致するメソッドを引数付きで実行する |

### csvParser.ts

引数に指定されたCSVを配列に変換します。<br>
ただし引数を複数指定する場合は「|」で区切った文字列を指定し、キーワードメソッド側でsplit処理を行います。

例えば下記のようなCSVは、このような配列に変換されます。

```
tc1,hogeをする, 引数A
tc1,fugaをする, 引数B
tc2,piyoをする, 引数C
tc1,hogeraをする, 引数D|引数E
```
```
[{
   "key": "tc1",
   "values": [
      ["hogeをする", "引数A"],
      ["fugaをする", "引数B"]
   ]
},
{
   "key": "tc2",
   "values": [
      ["piyoをする", "引数C"],
      ["hogeraをする", "引数D|引数E"]
   ]
}]
   
      
```

### keywordMethods.ts

キーワードに対応するメソッドを定義しています。
例えば「URLを開く」メソッドは、引数のURLをplaywrightが提供しているgotoメソッドに渡します。
```typescript
export function URLを開く(page: Page, url: string) {
  return page.goto(url);
}
```

### testScript.spec.ts

testStepsを周回させ、それぞれのキーワードに対応したメソッドを実行します。
```typescript
// CSVに記載したキーワードと、メソッドを対応付けます
const keywords = {
  URLを開く: km.URLを開く,
  Pathを確認する: km.Pathを確認する,
  メニューをクリックする: km.メニューをクリックする,
  プラン表示を確認する: km.プラン表示を確認する,
};

try {
  const csvFilePath = "./tests/KeywordDrivenTest.csv";
  const testSteps = parseCSV(csvFilePath);

  // testStepsからテストケース単位で周回させます
  for (const [testStep, values] of Object.entries(testSteps)) {
    test(testStep, async ({ page }) => {
      // testStepsの1番目から順番に[キーワード,引数]の配列を取り出します
      for (const [keyword, args] of values) {
        // メソッドを実行する関数を実行します
        await executeKeyword(page, keyword, args);
      }
      // テストケースの最後にスクリーンショットを撮影します
      await page.screenshot({ path: "./screenshot.png" });
    });
  }

  async function executeKeyword(page: any, keyword: string, args: string) {
    if (typeof keywords[keyword] === "function") {
      // キーワードに対応したメソッドを引数付きで実行します
      await keywords[keyword](page, args);
    } else {
      // 定義されていない場合はエラーメッセージを出します
      console.error(`${keyword}は定義されていません`);
    }
  }
}
```

## 将来的なお話し

- [x] 今回はテストケースが1件だけですが、CSVファイルにテストケース名を記載できる列を用意し、テストケースごとに周回させて実行させるようにできるとさらに実用的です。<br>
https://github.com/tomodakengo/pw-hotelplanisphere/issues/1
https://github.com/tomodakengo/pw-hotelplanisphere/tree/feat_add_col_tc

- [ ] また引数に複数の値を渡す場合に、TestDataのCSV pathを渡して、それを解析してメソッドに渡してあげると、TestDataの管理がしやすくなります。

- [ ] さらにキーワードとメソッドの対応付けをしなくても実行できるようにすれば、キーワード＝メソッドとなり、わざわざ対応付けの定義が必要なくなりメンテナンス性が向上します。
