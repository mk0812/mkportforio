# mkportforio

個人ポートフォリオサイト用の Vue 3 + Vite テンプレートです。  
作品・スキル・経歴をデータファイルで管理し、コンポーネントを組み合わせてページを構成します。

## セットアップ

```bash
npm install
npm run dev
```

本番ビルド:

```bash
npm run build
npm run preview
```

## プロジェクト構成

```
src/
├── config/site.js          # サイト名・ナビ・SNS など
├── content/
│   ├── profile.js          # 自己紹介・スキル
│   ├── projects.js         # 作品一覧
│   └── experience.js       # 経歴タイムライン
├── components/
│   ├── layout/             # ヘッダー・フッター・セクション
│   ├── portfolio/          # ヒーロー・作品カード・タイムライン等
│   └── ui/                 # ボタン・タグなど汎用 UI
├── views/                  # ページ（ホーム / 作品 / プロフィール）
└── composables/
```

## カスタマイズの手順

1. **`src/config/site.js`** — 名前・タグライン・メール・SNS・ナビを更新
2. **`src/content/profile.js`** — 自己紹介文・スキル・興味
3. **`src/content/projects.js`** — 作品データ（`image` に `/projects/xxx.png` など）
4. **`src/content/experience.js`** — 経歴・活動履歴（後から職務経歴を追記しやすい形式）

作品画像は `public/projects/` に置き、`projects.js` の `image` フィールドで参照してください。

## ページ

| パス | 内容 |
|------|------|
| `/` | ヒーロー・注目作品・スキル概要・連絡先 |
| `/projects` | 作品一覧 |
| `/about` | プロフィール・スキル詳細・経歴タイムライン |

## 技術スタック

- Vue 3 (Composition API)
- Vue Router 4
- Vite 6

旧版（Vue 2 + p5.js の背景アニメーション）は撤去済みです。クリエイティブコーディング作品は `projects` に載せてリンクする想定です。
