# mkportforio

個人ポートフォリオサイト用の **Vue 3 + TypeScript + Vite** テンプレートです。  
作品・スキル・経歴をデータファイルで管理し、コンポーネントを組み合わせてページを構成します。

## セットアップ

```bash
npm install
npm run dev
```

型チェック:

```bash
npm run typecheck
```

本番ビルド（型チェック込み）:

```bash
npm run build
npm run preview
```

## プロジェクト構成

```
src/
├── types/                  # SiteConfig, Project, Experience などの型定義
├── config/site.ts          # サイト名・ナビ・SNS など
├── content/
│   ├── profile.ts          # 自己紹介・スキル
│   ├── projects.ts         # 作品一覧
│   └── experience.ts       # 経歴タイムライン
├── components/
│   ├── layout/             # ヘッダー・フッター・セクション
│   ├── portfolio/          # ヒーロー・作品カード・タイムライン等
│   └── ui/                 # ボタン・タグなど汎用 UI
├── views/                  # ページ（ホーム / 作品 / プロフィール）
└── composables/
```

コンテンツファイルは `satisfies` で型安全に定義しています。エディタの補完・型エラーが効きます。

## カスタマイズの手順

1. **`src/config/site.ts`** — 名前・タグライン・メール・SNS・ナビを更新
2. **`src/content/profile.ts`** — 自己紹介文・スキル・興味
3. **`src/content/projects.ts`** — 作品データ（`image` に `/projects/xxx.png` など）
4. **`src/content/experience.ts`** — 経歴・活動履歴

作品画像は `public/projects/` に置き、`projects.ts` の `image` フィールドで参照してください。

新しいフィールドを追加する場合は、先に `src/types/portfolio.ts` の型を更新してください。

## ページ

| パス | 内容 |
|------|------|
| `/` | ヒーロー・注目作品・スキル概要・連絡先 |
| `/projects` | 作品一覧 |
| `/about` | プロフィール・スキル詳細・経歴タイムライン |

## 技術スタック

- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript 5
- Vue Router 4
- Vite 6
- vue-tsc（ビルド前の型チェック）

旧版（Vue 2 + p5.js の背景アニメーション）は撤去済みです。クリエイティブコーディング作品は `projects` に載せてリンクする想定です。
