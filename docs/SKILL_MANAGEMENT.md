# スキル管理システム

ポートフォリオサイトのスキル情報を効率的に管理するための仕組みです。

## 📁 ファイル構成

```
src/
├── content/
│   ├── skills.ts          # スキルデータ（カテゴリ別に整理）
│   ├── profile.ts         # プロフィール（skills.ts をインポート）
│   └── index.ts           # 統合エクスポート
└── utils/
    ├── skillHelpers.ts    # スキル操作用ヘルパー関数
    └── skillLevel.ts      # スキルレベル表示用ユーティリティ
```

## 🚀 基本的な使い方

### 1. スキルを追加する

`src/content/skills.ts` を開き、該当するカテゴリの配列に追加するだけです。

```typescript
// Development スキル
export const developmentSkills = [
  { name: 'JavaScript / TypeScript', level: 'advanced', category: 'Development' },
  { name: 'Vue / React', level: 'advanced', category: 'Development' },
  // ↓ 新しいスキルを追加
  { name: 'Next.js', level: 'intermediate', category: 'Development' },
] satisfies Skill[]
```

### 2. 新しいカテゴリを追加する

新しいカテゴリが必要な場合：

```typescript
// Backend スキル（新規カテゴリ）
export const backendSkills = [
  { name: 'Python / FastAPI', level: 'intermediate', category: 'Backend' },
  { name: 'PostgreSQL', level: 'intermediate', category: 'Backend' },
] satisfies Skill[]

// allSkills に追加
export const allSkills = [
  ...developmentSkills,
  ...creativeSkills,
  ...designSkills,
  ...toolsSkills,
  ...backendSkills, // ← 追加
] satisfies Skill[]

// skillsByCategory にも追加
export const skillsByCategory = {
  Development: developmentSkills,
  Creative: creativeSkills,
  Design: designSkills,
  Tools: toolsSkills,
  Backend: backendSkills, // ← 追加
} as const
```

### 3. ヘルパー関数を使う

`src/utils/skillHelpers.ts` には便利な関数が用意されています。

```typescript
import { createSkill, createSkills, filterSkillsByCategory } from '@/utils/skillHelpers'
import { allSkills } from '@/content'

// 単一スキル作成
const skill = createSkill('Rust', 'beginner', 'Development')

// 複数スキルを一括作成（同じカテゴリ・レベル）
const frameworks = createSkills(['Next.js', 'Nuxt', 'SvelteKit'], 'intermediate', 'Development')

// カテゴリでフィルタリング
const creativeSkills = filterSkillsByCategory(allSkills, 'Creative')

// レベルでフィルタリング
const advancedSkills = filterSkillsByLevel(allSkills, 'advanced')

// スキルをソート
const sortedByName = sortSkillsByName(allSkills)
const sortedByLevel = sortSkillsByLevel(allSkills)

// 統計情報を取得
const stats = getSkillStats(allSkills)
console.log(stats)
// {
//   total: 14,
//   byLevel: { advanced: 5, intermediate: 7, beginner: 2 },
//   categories: ['Creative', 'Design', 'Development', 'Tools']
// }
```

## 📊 スキルレベル

3段階のレベルが定義されています：

- `beginner` - 入門レベル（33%）
- `intermediate` - 中級レベル（66%）
- `advanced` - 上級レベル（100%）

レベル表示には `skillLevelLabel` と `skillLevelValue` を使用：

```typescript
import { skillLevelLabel, skillLevelValue } from '@/utils/skillLevel'

console.log(skillLevelLabel('advanced')) // '上級'
console.log(skillLevelValue('intermediate')) // 0.66
```

## 🎯 カテゴリ一覧

デフォルトで以下のカテゴリが定義されています：

- **Development** - プログラミング言語・フレームワーク
- **Creative** - クリエイティブコーディング・WebGL
- **Design** - デザインツール・UI/UX
- **Tools** - 開発ツール・インフラ

必要に応じてカテゴリを追加できます。

## ✅ 型安全性

すべてのスキルデータは TypeScript の `satisfies` 演算子で型チェックされています。

```typescript
// ❌ コンパイルエラー（不正なレベル）
{ name: 'Vue', level: 'expert', category: 'Development' }

// ✅ OK
{ name: 'Vue', level: 'advanced', category: 'Development' }
```

## 🔄 自動統合

`src/content/profile.ts` は自動的に `allSkills` をインポートしているため、
`skills.ts` を更新するだけで、プロフィールに反映されます。

```typescript
// profile.ts
import { allSkills } from './skills'

export const profile = {
  // ...
  skills: allSkills, // ← 自動で最新のスキル一覧が反映される
} satisfies Profile
```

## 📝 ベストプラクティス

1. **カテゴリごとに整理** - 関連するスキルをまとめて管理
2. **レベルは正直に** - スキルレベルは客観的に評価
3. **具体的な名前** - `JavaScript` より `JavaScript / TypeScript` の方が明確
4. **定期的に更新** - 新しく習得したスキルは随時追加
5. **型安全性を活用** - TypeScript の型チェックで品質を保証

## 🛠️ トラブルシューティング

### スキルが表示されない

1. `skills.ts` のスキルが `allSkills` に含まれているか確認
2. `oxlint` でエラーが出ていないか確認：`npm run lint`
3. TypeScript のエラーを確認：`npm run typecheck`

### 新しいカテゴリが動作しない

1. カテゴリ配列を `allSkills` に追加したか確認
2. `skillsByCategory` オブジェクトに追加したか確認
3. `satisfies Skill[]` で型チェックしているか確認

## 📚 関連ファイル

- [`src/types/portfolio.ts`](../src/types/portfolio.ts) - Skill 型定義
- [`src/content/skills.ts`](../src/content/skills.ts) - スキルデータ
- [`src/utils/skillHelpers.ts`](../src/utils/skillHelpers.ts) - ヘルパー関数
- [`src/utils/skillLevel.ts`](../src/utils/skillLevel.ts) - レベル表示ユーティリティ
