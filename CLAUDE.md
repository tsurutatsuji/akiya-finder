# AkiyaFinder

## コンセプト・目的・目標

### コンセプト
外国人投資家が日本の空き家を「投資目的の欲求」から探せるマップ中心のプラットフォーム。

### 目的
- 日本の空き家バンク情報を英語/中文に翻訳し、外国人が物件を探せるようにする
- 投資判断に必要な指標（㎡単価、築年数、駅距離、民泊ポテンシャル等）を可視化する
- 認可不動産業者とマッチングし、紹介料で収益を得る

### 目標
- 外国人向け空き家検索の第一想起サイトになる
- 月間問い合わせ10件→業者マッチング→紹介料獲得

### ターゲット
- 米国・英国・豪州・中国/香港の外国人
- 投資目的（民泊、値上がり、セカンドハウス、事業）

### 収益モデル
- 宅建業者への紹介料（成約時 仲介手数料の20%提案）
- リファラルコード（AKF-YYYYMMDD-XXXX）でトラッキング

---

## セッション開始時の必須確認

**毎回、コードを書く前に以下を実行すること:**

1. **Obsidian作業ログ確認**: `Claude Code Logs/YYYY-MM-DD.md` で前回の作業内容を把握
2. **active-sessions.md確認**: 他パネルと同じファイルを触っていないか確認
3. **データの現在状態確認**:
   - `data/scraped-properties.json` の件数と最終更新日時
   - `data/detail-cache.json` のエンリッチ状況
4. **git log --oneline -5** で最近の変更履歴を確認
5. **devサーバーの状態確認**: ポートが空いているか、`.next`キャッシュが壊れていないか

---

## 技術スタック

- Next.js 14 (App Router) + React 18 + TypeScript
- **next-intl 4.x**（多言語対応: zh/en/ja）
- Tailwind CSS 3.4（primary: #1a1a2e, accent: #e94560, warm: #f5f0eb）
- React-Leaflet + Leaflet（地図）
- Nominatim/OSM（ジオコーディング）
- Discord Webhook（問い合わせ通知）
- Buttondown（ニュースレター）
- Vercel（デプロイ）

## データパイプライン

```
@home空き家バンク → scrape-akiya-bank.ts（fetch）
  → geocode-properties.ts（Nominatim）
  → enrich-details.ts（詳細ページから画像・交通・構造等）
  → scraped-properties.json（901件 + エンリッチ済み）
  → フロントエンドで投資タグ計算 → マップ表示
```

## 主要ファイル

### ページ（全て `src/app/[locale]/` 配下）
- `[locale]/page.tsx` — ホーム
- `[locale]/map/page.tsx` — 投資マップ（メイン機能）
- `[locale]/akiya-bank/page.tsx` — 物件検索一覧
- `[locale]/contact/page.tsx` — リファラルコード付き問い合わせ
- `[locale]/blog/[slug]/page.tsx` — ブログ記事
- `[locale]/properties/[id]/page.tsx` — 物件詳細
- `[locale]/prefecture/[slug]/page.tsx` — 都道府県別
- `[locale]/price/[slug]/page.tsx` — 価格帯別
- `[locale]/tag/[slug]/page.tsx` — 投資タグ別

### i18n
- `src/i18n/routing.ts` — ルーティング設定（zh/en/ja、デフォルトzh）
- `src/i18n/request.ts` — next-intl設定
- `src/i18n/navigation.ts` — 多言語Link/useRouter等
- `src/middleware.ts` — ロケール検出・リダイレクト
- `src/messages/zh.json` — 中国語翻訳
- `src/messages/en.json` — 英語翻訳
- `src/messages/ja.json` — 日本語翻訳

### コンポーネント
- `src/components/PropertyMap.tsx` — Leafletマップ（投資指標付きPopup）
- `src/components/PropertyCard.tsx` — 物件カード

### ロジック
- `src/lib/investment-tags.ts` — 投資カテゴリ6種（High Value, Station Close, Airbnb Ready, Free/Near-Free, Move-in Ready, Cultural Gem）
- `src/lib/lifestyle-tags.ts` — ライフスタイルタグ（既存・共存）
- `src/lib/prefecture-coords.ts` — 都道府県座標 + ジッター

### スクレイパー
- `scripts/scrape-akiya-bank.ts` — @home空き家バンク（メイン）
- `scripts/scrape-homes-akiyabank.ts` — LIFULL HOMES（CAPTCHA問題で未使用）
- `scripts/enrich-details.ts` — 詳細エンリッチ（画像・交通・構造・備考）
- `scripts/geocode-properties.ts` — ジオコーディング

### データ
- `data/scraped-properties.json` — 全物件データ（901件）
- `data/detail-cache.json` — エンリッチキャッシュ
- `data/geocode-cache.json` / `geocode-cache-precise.json`
- `content/blog/*.md` — ブログ記事（EN 5本 + 中文 5本）
- `docs/` — 営業テンプレート、市場調査

## 既知の問題

### .next キャッシュ破損
- 複数ファイル同時変更後にHMRが壊れる
- **対策**: `rm -rf .next && npm run dev` で再起動
- 特にglobals.css + TSX同時変更時に発生しやすい

### LIFULL HOMES スクレイピング不可
- AWS WAF + CAPTCHA（Human Verification）でfetch/Playwright共に不可
- 8,314件のデータがあるが現時点ではアクセス手段がない

## 起動コマンド
```bash
npm run dev     # 開発サーバー（ポート3000〜）
npm run build   # 本番ビルド
```
