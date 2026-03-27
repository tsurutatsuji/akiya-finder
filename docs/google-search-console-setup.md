# Google Search Console 登録手順

サイトURL: https://akiya-finder.vercel.app

---

## 1. Google Search Console にアクセス

1. ブラウザで https://search.google.com/search-console を開く
2. Googleアカウントでログインする（まだの場合）

---

## 2. プロパティを追加

1. 左上のプロパティ選択ドロップダウンをクリック
2. **「プロパティを追加」** を選択
3. 右側の **「URLプレフィックス」** を選ぶ（左側の「ドメイン」ではない）
4. URLに `https://akiya-finder.vercel.app` と入力
5. **「続行」** をクリック

> **なぜURLプレフィックスか**: ドメイン方式はDNS設定が必要だが、Vercelのサブドメイン（vercel.app）ではDNSを直接編集できない。URLプレフィックス方式ならHTMLタグで簡単に確認できる。

---

## 3. 所有権の確認（HTMLタグ方式）

プロパティ追加後、所有権確認の画面が表示される。

1. **「HTMLタグ」** の方法を選ぶ（「その他の確認方法」の中にある場合もある）
2. 表示されるmetaタグをコピーする。以下のような形式:

```html
<meta name="google-site-verification" content="ここにランダムな文字列が入る" />
```

3. `content="..."` の中の文字列をメモしておく

---

## 4. metaタグを layout.tsx に追加

ファイル: `src/app/layout.tsx`

`metadata` オブジェクトに `verification` プロパティを追加する。

### 変更前（抜粋）

```typescript
export const metadata: Metadata = {
  title: "AkiyaFinder — Find Cheap Houses in Japan | From $0",
  description: "...",
  // ...その他の設定
};
```

### 変更後

```typescript
export const metadata: Metadata = {
  title: "AkiyaFinder — Find Cheap Houses in Japan | From $0",
  description: "...",
  // ...その他の設定
  verification: {
    google: "ここにSearch Consoleで表示されたcontent値を貼る",
  },
};
```

### 手順

1. `src/app/layout.tsx` を開く
2. `metadata` オブジェクトの中に `verification` を追加する（上の例を参照）
3. `"ここに..."` の部分を、手順3でコピーした `content` の値に置き換える
4. ファイルを保存する
5. Vercelにデプロイする（mainブランチにpushすれば自動デプロイされる）
6. デプロイ完了後、Search Consoleに戻り **「確認」** ボタンを押す
7. 「所有権を確認しました」と表示されれば成功

> **Next.jsのMetadata APIについて**: `verification.google` に値を設定すると、Next.jsが自動的に `<meta name="google-site-verification" content="...">` をHTMLの `<head>` に出力してくれる。HTMLファイルを直接編集する必要はない。

---

## 5. サイトマップを送信

所有権の確認が完了したら、サイトマップを送信する。

1. Search Consoleの左メニューから **「サイトマップ」** を選択
2. 「新しいサイトマップの追加」に以下のURLを入力:

```
https://akiya-finder.vercel.app/sitemap.xml
```

3. **「送信」** をクリック
4. ステータスが「成功しました」になれば完了

> **サイトマップが存在しない場合**: `src/app/sitemap.ts` を作成する必要がある。Next.js App Routerでは、このファイルを置くだけで `/sitemap.xml` が自動生成される。

---

## 6. 初期設定後にやるべきこと

### すぐにやること

- **URL検査ツールでトップページを確認**: 左メニュー「URL検査」にトップページURLを入力し、Googleから正しく見えているか確認する。問題があれば「インデックス登録をリクエスト」を押す
- **主要ページのインデックス登録リクエスト**: `/map`, `/akiya-bank`, `/contact`, ブログ記事など重要なページもURL検査から個別にリクエストする

### 1週間後にやること

- **カバレッジ（ページ）レポートを確認**: 左メニュー「ページ」でエラーや除外されているページがないかチェックする
- **検索パフォーマンスを確認**: 左メニュー「検索パフォーマンス」でどんなキーワードで表示されているか確認する

### 継続的にやること

- **検索パフォーマンスの定期確認**（週1回程度）: クリック数、表示回数、平均掲載順位の推移を見る
- **エラーの対応**: 「ページ」レポートでクロールエラーが出たら対処する
- **新しいページを追加したら**: URL検査からインデックス登録をリクエストする（サイトマップ経由でも自動的にクロールされるが、早くインデックスしたい場合）

---

## 補足: 確認がうまくいかない場合

| 症状 | 原因と対策 |
|------|-----------|
| 「確認できませんでした」と出る | デプロイが完了していない可能性。Vercelのダッシュボードでデプロイ状況を確認し、完了後に再度「確認」を押す |
| metaタグが出力されない | `metadata` オブジェクトの構文エラー。`npm run build` でビルドエラーがないか確認する |
| サイトマップが404になる | `src/app/sitemap.ts` が存在しないか、内容にエラーがある。ブラウザで `/sitemap.xml` にアクセスして確認する |
