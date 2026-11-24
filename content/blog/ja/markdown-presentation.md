---
title: "Markdown でプレゼン資料を作る：実践ガイド"
description: "Marp、Slidev、reveal.js などのツールを使って、Markdown で美しいプレゼン資料を作る方法を解説。基本的なスライドの書き方から応用機能、コードのハイライト、PDF 書き出しまで紹介します。"
date: 2025-03-25
tags:
  - Markdown
  - プレゼンテーション
  - スライド
  - 登壇
---

## なぜプレゼンに Markdown なのか？

PowerPoint や Google スライドでプレゼン資料を作るのはおなじみの作業ですが、おなじみの不満もつきものです。内容を書くよりもレイアウトの調整に時間がかかる、スライドごとに書式がばらばらになる、バイナリファイルなのでバージョン管理で変更を追えない、といったことです。

Markdown のプレゼン資料は、このやり方を逆転させます。内容はプレーンテキストで書き、シンプルな記号でスライドを区切り、見た目の描画はツールに任せます。その結果、より速く、より一貫性があり、バージョン管理とも相性のよい作業の流れになります。

この方法は特に次のような場面で人気があります。

- コード例のある**技術的な発表**
- シンタックスハイライトが必要な**カンファレンスでの登壇**
- 見た目の華やかさより中身が大切な**社内チーム向けの発表**
- 頻繁に更新する**教育コンテンツ**
- コードエディタから離れたくない**開発者**

このガイドでは、人気の Markdown プレゼンツール 3 つを紹介し、ゼロからスライドを作る方法と、プレゼン資料を PDF に書き出す方法を説明します。

## ツールの概要

### Marp（Markdown Presentation Ecosystem）

Marp は、Markdown でプレゼン資料を作るもっともシンプルなツールです。VS Code 拡張機能、CLI ツール、単体のアプリとして使えます。

**インストール：**

```bash
# CLI ツール
npm install -g @marp-team/marp-cli

# または VS Code 拡張機能「Marp for VS Code」を使う
```

**基本的なスライドの書き方：**

````markdown
---
marp: true
theme: default
paginate: true
---

# GraphQL 入門

**Jane Smith** - Acme Corp シニアエンジニア
2025 年 3 月

---

## GraphQL とは？

- API のためのクエリ言語
- 2012 年に Facebook が開発
- 2015 年にオープンソース化
- REST に代わる選択肢

---

## REST と GraphQL の比較

| 項目               | REST         | GraphQL        |
|:-------------------|:-------------|:---------------|
| エンドポイント     | 複数         | 1 つ           |
| データの取得       | 固定         | 柔軟           |
| 過剰な取得         | よくある     | 起こらない     |
| バージョン管理     | URL ベース   | スキーマベース |

---

## クエリの例

```graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
      publishedAt
    }
  }
}
```
````

Marp では、スライドを `---`（水平線）で区切ります。最初の `---` ブロックには設定用の YAML フロントマターを書きます。

**PDF への変換：**

```bash
# PDF を生成
marp presentation.md --pdf

# HTML を生成
marp presentation.md --html

# PowerPoint を生成
marp presentation.md --pptx

# カスタムテーマを使う
marp presentation.md --pdf --theme custom-theme.css
```

### Slidev

Slidev は、開発者向けの Vue ベースのプレゼンツールです。Marp よりもインタラクティブな表現やカスタマイズができますが、習得には少し時間がかかります。

**インストール：**

```bash
npm init slidev@latest
```

**基本的なスライドの書き方：**

````markdown
---
theme: seriph
background: https://source.unsplash.com/1920x1080/?nature
class: text-center
---

# Slidev へようこそ

開発者のためのプレゼンテーションスライド

---

## Slidev とは？

Slidev は開発者のために設計された
スライド作成・発表ツールです。

<v-click>

- Vue 3 で構築
- Markdown ベース
- シンタックスハイライト
- 録画に対応

</v-click>

---

## ハイライト付きのコード

```python {2-3|5-6}
def fibonacci(n):
    if n <= 1:
        return n
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
    return b
```
````

Slidev では、`<v-click>` で段階的に表示するアニメーション、`{2-3|5-6}` という書き方でのコードブロックの行ハイライト、スライド内での Vue コンポーネントの直接利用ができます。

**実行と書き出し：**

```bash
# ライブプレビュー付きの開発サーバーを起動
npx slidev

# PDF に書き出す
npx slidev export

# PNG 画像に書き出す
npx slidev export --format png
```

### reveal.js

reveal.js は、もっとも歴史があり機能も充実した Markdown プレゼンフレームワークです。2011 年から存在し、多くのカンファレンスの発表で使われています。

**セットアップ：**

```bash
git clone https://github.com/hakimel/reveal.js.git
cd reveal.js
npm install
npm start
```

**Markdown でのスライドの書き方：**

```html
<section data-markdown>
  <textarea data-template>
    ## スライド 1
    **太字**と*斜体*を含む段落。

    ---

    ## スライド 2
    - 項目 1
    - 項目 2
    - 項目 3

    ---

    ## スライド 3

    ```javascript
    console.log('Hello, reveal.js!');
    ```
  </textarea>
</section>
```

reveal.js は外部ファイルから Markdown を読み込むこともできます。

```html
<section
  data-markdown="slides.md"
  data-separator="---"
  data-separator-vertical="--"
></section>
```

## 伝わるスライドを作る

### 1 枚のスライドに 1 つのメッセージ

プレゼンでもっともよくある失敗は、1 枚のスライドに内容を詰め込みすぎることです。スライド 1 枚で伝えるのは 1 つのメッセージにしましょう。

```markdown
---

## 課題

ユーザーが購入手続きの途中で離脱している。

**68%** が支払いのステップで離脱。

---

## 根本原因

支払いフォームの入力項目が 12 個ある。

業界標準は 5〜7 個。

---

## 解決策

支払いフォームを必須の 6 項目に絞る。

保存済みのデータで可能な限り自動入力する。

---
```

焦点を絞った 3 枚のスライドは、詰め込みすぎた 1 枚のスライドよりもずっと効果的に伝わります。

### スライドでのコード例

Markdown のプレゼン資料の大きな利点のひとつは、コードをそのまま扱えることです。3 つのツールはいずれもシンタックスハイライトに対応しています。

````markdown
---

## API レスポンスの処理

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const result: ApiResponse<User> = await response.json();

  if (result.status !== 200) {
    throw new Error(result.message);
  }

  return result.data;
}
```

---
````

発表中にライブコーディングをするなら、Slidev ではスライド内で直接コードを実行できます。静的なプレゼンなら、シンタックスハイライト付きの整ったコードブロックで十分です。

### スピーカーノート

3 つのツールはいずれも、自分には見えて聴衆には見えないスピーカーノートに対応しています。

**Marp：**
```markdown
---

## 主要な指標

- 売上は前年比 23% 増
- 顧客獲得コストは 15% 減
- NPS（ネットプロモータースコア）：72

<!--
スピーカーノート：
- 第 4 四半期に売上の伸びが加速したことを強調する
- 新しい紹介プログラムの貢献に触れる
- NPS を業界平均の 45 と比較する
-->

---
```

**Slidev：**
```markdown
---

## 主要な指標

- 売上は前年比 23% 増

<!--
Slidev でもスピーカーノートはここに書きます。
発表者モードで表示されます。
-->

---
```

### 画像とメディア

```markdown
---

## アーキテクチャの概要

![システムアーキテクチャ図](./images/architecture.png)

---

## 改善前と改善後

| 改善前 | 改善後 |
|:------:|:------:|
| ![旧](./images/before.png) | ![新](./images/after.png) |

---
```

画像は適度な解像度に抑えましょう。プレゼンは通常 1920x1080 以下で表示されるので、読み込みを遅くする超高解像度の素材は必要ありません。

## プレゼン資料のスタイルを整える

### Marp のテーマ

Marp には `default`、`gaia`、`uncover` の 3 つのテーマが組み込まれています。CSS でカスタムテーマを作ることもできます。

```css
/* custom-theme.css */
section {
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  color: #00d4ff;
}

code {
  background-color: #16213e;
  color: #00d4ff;
}

table th {
  background-color: #0f3460;
  color: white;
}
```

フロントマターでテーマを適用します。

```markdown
---
marp: true
theme: custom-theme
---
```

### Slidev のテーマ

Slidev にはコミュニティ製のテーマが増え続けています。

```markdown
---
theme: seriph
---
```

人気のテーマには `seriph`、`apple-basic`、`dracula`、`penguin` などがあります。Slidev のテーマギャラリーで一覧を見たりプレビューしたりできます。

### スライドごとのスタイル

特定のスライドだけスタイルを変えたいこともあります。

**Marp：**
```markdown
---

<!-- _class: lead -->
<!-- _backgroundColor: #1a1a2e -->
<!-- _color: white -->

# ご清聴ありがとうございました

ご質問はありますか？

---
```

**Slidev：**
```markdown
---
layout: center
class: text-center
---

# ご清聴ありがとうございました

ご質問はありますか？

---
```

## すぐに使えるスライドのテンプレート

### タイトルスライド

```markdown
---
marp: true
theme: default
paginate: true
header: "会社名"
footer: "社外秘"
---

<!-- _class: lead -->

# 四半期業績レビュー

## 2024 年第 4 四半期の結果

**発表者：** Jane Smith（エンジニアリング担当 VP）
**日付：** 2025 年 1 月 15 日

---
```

### アジェンダのスライド

```markdown
---

## アジェンダ

1. **第 4 四半期の業績まとめ**（10 分）
2. **主な成果と課題**（15 分）
3. **2025 年ロードマップの紹介**（10 分）
4. **質疑応答**（10 分）

---
```

### 比較のスライド

```markdown
---

## フレームワークの比較

| 評価項目         | React    | Vue      | Svelte   |
|:-----------------|:--------:|:--------:|:--------:|
| 習得のしやすさ   | 普通     | 簡単     | 簡単     |
| パフォーマンス   | 良い     | 良い     | 非常に良い |
| エコシステム     | 巨大     | 大きい   | 成長中   |
| バンドルサイズ   | 42 KB    | 33 KB    | 1.6 KB   |
| 求人市場         | 最大     | 拡大中   | 新興     |

---
```

### 引用のスライド

```markdown
---

<!-- _class: lead -->

> 「コンピュータが理解できるコードは誰にでも書ける。
> 優れたプログラマーは、人間が理解できる
> コードを書く。」
>
> -- Martin Fowler

---
```

## PDF に書き出す

3 つのツールはいずれも PDF の書き出しに対応しています。発表後にプレゼン資料を共有したり、保管したりするのに欠かせません。

### Marp での PDF 書き出し

```bash
# 標準の書き出し
marp presentation.md --pdf

# PDF のアウトライン（しおり）付きで書き出す
marp presentation.md --pdf --pdf-outlines

# 出力先を指定する
marp presentation.md --pdf -o ./output/talk.pdf
```

### Slidev での PDF 書き出し

```bash
npx slidev export --output presentation.pdf
```

### printmd で配布資料を作る

プレゼンの文書版（スライドではなく、読み物としての資料）を作りたい場合は、Markdown の構成を整えて、printmd で PDF の配布資料に変換できます。次のような場合に便利です。

- あとで内容を見返したいカンファレンスの参加者
- 発表を聞き逃した関係者
- アーカイブやドキュメントとして残す場合

ポイントは、同じ Markdown の内容を、スライドツールではスライドとして、printmd では文書として使い回せることです。フロントマターを調整し、スライドの区切りを取り除くだけで済みます。

## よりよいプレゼンのためのコツ

### 本番のスライドでリハーサルする

発表者モードを使って通しで練習しましょう。3 つのツールにはいずれも、現在のスライド、次のスライド、スピーカーノート、タイマーを表示する発表者ビューがあります。

### 文字は最小限に

聴衆がスライドを読んでいるあいだは、あなたの話を聞いていません。スライドはカンペではなく、視覚的な手がかりとして使いましょう。

```markdown
---

## よくない例

私たちのチームは 6 か月にわたり、組織内の
規模や複雑さの異なる複数のプロジェクトを対象に、
コードレビューの実践とソフトウェアの欠陥率の
相関関係を調べる大規模な調査を
実施しました……

---

## よい例

**6 か月間、12 プロジェクトを対象にした調査**

コードレビューで欠陥が **40%** 減少

---
```

### 書式を統一する

見出しのレベル、箇条書きのスタイル、コードの書式は最初から最後まで統一しましょう。Markdown なら自然と統一できます。これも見た目で編集するツールに対する利点のひとつです。

### プレゼン資料もバージョン管理する

プレゼン資料をプロジェクトと一緒に Git で管理しましょう。

```
project/
  src/
  docs/
  presentations/
    2025-03-conference-talk/
      slides.md
      images/
      notes.md
```

すべての履歴が残り、プルリクエストで簡単に共同作業でき、同じ発表の別バージョンをブランチで管理することもできます。

## 比較：どのツールを選ぶべきか？

| 項目                 | Marp         | Slidev       | reveal.js      |
|:---------------------|:-------------|:-------------|:---------------|
| 習得のしやすさ       | 簡単         | 普通         | 普通           |
| セットアップの手間   | 少ない       | 普通         | 普通           |
| VS Code との連携     | 非常に良い   | 良い         | 限定的         |
| インタラクティブ性   | 基本的       | 高度         | 高度           |
| カスタムコンポーネント | CSS のみ   | Vue          | HTML/JS        |
| PDF 書き出し         | 標準搭載     | 標準搭載     | プラグイン     |
| PPTX 書き出し        | あり         | なし         | なし           |
| ライブコーディング   | なし         | あり         | プラグイン     |
| 発表者モード         | あり         | あり         | あり           |
| 向いている用途       | 手軽な発表   | 開発者向けの発表 | カンファレンス |

**Marp を選ぶ**：とにかくシンプルな準備で、主に情報を伝えるスライドを作りたい場合。

**Slidev を選ぶ**：インタラクティブな表現、アニメーション、Vue コンポーネントの組み込みが必要な場合。

**reveal.js を選ぶ**：最大限のカスタマイズが必要で、HTML と JavaScript に慣れている場合。

## まとめ

Markdown のプレゼン資料は、開発者の物珍しいおもちゃではありません。特に技術的な内容では、本当に速く、メンテナンスしやすいスライドの作り方です。内容はプレーンテキストで書き、デザインはツールに任せ、ピクセル単位の位置調整ではなくメッセージを磨くことに時間を使いましょう。

まずはシンプルな Marp から始め、インタラクティブな表現が必要になったら Slidev を試し、細部までこだわったカンファレンスの発表には reveal.js を検討しましょう。どのツールを選んでも、基本の流れは同じです。Markdown で書いて、プレビューして、発表する。
