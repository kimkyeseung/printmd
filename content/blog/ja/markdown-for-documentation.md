---
title: "Markdown で技術ドキュメントを書く"
description: "Markdown で技術ドキュメントを作るための実践ガイド。フォルダ構成、相互参照、バージョン管理、ドキュメントサイト向けのおすすめツールを解説します。"
date: 2025-02-10
tags:
  - Markdown
  - ドキュメント
  - テクニカルライティング
  - 開発
---

## なぜドキュメントに Markdown なのか？

技術ドキュメントには特有の要件があります。書きやすく、メンテナンスしやすく、バージョン管理ができ、複数の形式で公開できなければなりません。Markdown はこれらの要件をすべて満たしながら、専任のテクニカルライターだけでなくチームの誰もが参加できるほどシンプルです。

Markdown が標準になる前、チームは Wiki や Word 文書、独自のコンテンツ管理システムでドキュメントを書いていました。どの方法にも不便さがありました。Wiki には稼働し続けるサーバーが必要でした。Word 文書はバージョン管理でマージの衝突を起こしました。独自の CMS はコンテンツを専用の形式に閉じ込めてしまいました。

Markdown がこの状況を変えました。ドキュメントはコードと同じリポジトリに置かれ、変更は同じプルリクエストの流れで扱われます。テキストエディタさえあれば誰でも参加できます。出力は静的な Web サイトにも、PDF のマニュアルにも、その両方にもできます。

## ドキュメントの構成を整える

### フォルダ構成

整理されたフォルダ構成は、メンテナンスしやすいドキュメントの土台です。小規模から大規模なプロジェクトまで使えるパターンを紹介します。

```
docs/
  index.md
  getting-started/
    installation.md
    quick-start.md
    configuration.md
  guides/
    basic-usage.md
    advanced-features.md
    troubleshooting.md
  api/
    overview.md
    endpoints.md
    authentication.md
  reference/
    configuration-options.md
    environment-variables.md
    cli-commands.md
  contributing/
    development-setup.md
    code-style.md
    pull-requests.md
```

フォルダがセクション、ファイルがページに対応します。ルートの `index.md` がトップページになります。この構成は、ドキュメントサイトのナビゲーションにそのまま対応させられます。

### 命名規則

ファイル名は小文字をハイフンでつなげます。`Getting Started.md` や `getting_started.md` ではなく `getting-started.md` にしましょう。URL エンコードの問題を避けられ、どの OS でも同じように扱えます。

### トップページ

`index.md` では、次の 3 つの問いにすぐ答えましょう。

1. このプロジェクトは何か？
2. 誰のためのものか？
3. どうやって始めればよいか？

```markdown
# プロジェクト名

プロジェクト名は[簡単な説明]です。[対象ユーザー]が
[主なメリット]できるようにします。

## クイックリンク

- [インストールガイド](getting-started/installation.md)
- [クイックスタートチュートリアル](getting-started/quick-start.md)
- [API リファレンス](api/overview.md)
- [よくある質問](guides/troubleshooting.md)
```

## 伝わるドキュメントを書く

### ドキュメントの 4 つの種類

Diátaxis フレームワークでは、ドキュメントを目的の異なる 4 種類に分けています。

1. **チュートリアル**：学習が目的。初心者向けのステップごとのレッスン。「この手順に沿って最初のプロジェクトを作りましょう。」
2. **ハウツーガイド**：タスクが目的。特定のゴールを達成するための手順。「SSL 証明書の設定方法。」
3. **リファレンス**：情報が目的。API や設定を正確に記述したもの。「`--verbose` フラグで詳細なログを有効にします。」
4. **解説**：理解が目的。概念や設計判断についての説明。「なぜイベント駆動アーキテクチャを選んだのか。」

ドキュメントがうまくいかない原因の多くは、これらの種類を混ぜてしまうことです。チュートリアルの途中でアーキテクチャの説明を始めるべきではありませんし、リファレンスのページにステップごとの手順を入れるべきでもありません。分けて書きましょう。

### 相互参照

ドキュメント同士は積極的にリンクしましょう。読者が最初から順番に読むことはまれです。検索エンジンからいきなりあるページにたどり着くので、関連する内容へのリンクが必要です。

```markdown
認証の詳細については
[認証ガイド](../api/authentication.md)をご覧ください。

この機能には `advanced` プランが必要です。
詳しくは[料金](../reference/pricing.md)をご覧ください。
```

内部リンクには相対パスを使いましょう。そうすれば、ドキュメントサイト上でも GitHub 上でファイルを直接見るときでもリンクが機能します。

### コード例

技術ドキュメントの良し悪しはコード例で決まります。すべての概念に動くコード例を付けましょう。

````markdown
### クライアントの作成

```python
from mylib import Client

# API キーを指定して初期化
client = Client(api_key="your-api-key")

# リクエストを送信
response = client.get("/users")
print(response.json())
```

> **注意**：本物の API キーは絶対にコミットしないでください。
> 本番環境では環境変数を使いましょう。
````

コード例は次のようにしましょう。

- **完全である**：インポート、初期化、後始末まで含める。
- **正しい**：すべての例をテストする。動かないコード例は信頼を失わせます。
- **コピー＆ペーストで使える**：読者がエディタにコピーして、最小限の変更で実行できるようにする。

### ドキュメントのバージョン管理

ソフトウェアに複数のバージョンが並行して存在する場合、ドキュメントにもバージョン管理が必要です。方法はいくつかあります。

**Git ブランチ**：メジャーバージョンごとにドキュメント用のブランチを用意します。

```
main          -> 最新バージョンのドキュメント
v2.x          -> バージョン 2 のドキュメント
v1.x          -> バージョン 1 のドキュメント
```

**フォルダによるバージョン管理**：バージョンごとのドキュメントを別のフォルダに置きます。

```
docs/
  latest/
  v2/
  v1/
```

**ツールによるバージョン管理**：多くのドキュメントプラットフォームにはバージョン管理機能が組み込まれています。次のセクションで紹介します。

## ドキュメントサイトジェネレーター

### MkDocs

MkDocs は、ドキュメント専用に設計された Python 製の静的サイトジェネレーターです。シンプルで高速、出力もすっきりしています。

```yaml
# mkdocs.yml
site_name: My Project
theme:
  name: material
nav:
  - Home: index.md
  - Getting Started:
    - Installation: getting-started/installation.md
    - Quick Start: getting-started/quick-start.md
  - API Reference: api/overview.md
```

```bash
# インストール
pip install mkdocs mkdocs-material

# ローカルで確認
mkdocs serve

# 静的サイトをビルド
mkdocs build
```

Material for MkDocs テーマは特に人気があります。検索、ダークモード、バージョン管理、レスポンシブレイアウトを最初から備えています。

### Docusaurus

Meta が開発した Docusaurus は、React ベースのドキュメントフレームワークです。MkDocs より多機能ですが、習得には時間がかかります。

```bash
npx create-docusaurus@latest my-docs classic
cd my-docs
npm start
```

Docusaurus は MDX（JSX を書ける Markdown）に対応しており、ドキュメントに対話的な React コンポーネントを直接埋め込めます。

```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm">
    ```bash
    npm install my-package
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn add my-package
    ```
  </TabItem>
</Tabs>
```

### そのほかの選択肢

- **GitBook**：無料枠が充実した商用プラットフォーム。ホスティング型のサービスを求めるチームに最適。
- **VitePress**：Vue ベースで高速かつ軽量。Vue エコシステムのプロジェクトにぴったり。
- **Sphinx**：Python プロジェクトのドキュメントの定番。reStructuredText と Markdown に対応。
- **Astro Starlight**：Astro をベースにした新しい選択肢。パフォーマンスと柔軟性で人気が高まっています。

## ベストプラクティス

### 読者に合わせて書く

誰がドキュメントを読むのかを把握しましょう。経験豊富な開発者が対象なら、一般的なツールや概念は知っている前提で書けます。初心者も含まれるなら、前提条件をはっきり説明しましょう。

### 変更履歴を残す

リリースごとの主な変更を記録する `CHANGELOG.md` を管理しましょう。

```markdown
# 変更履歴

## [2.1.0] - 2025-02-10

### 追加
- カスタムテーマに対応
- 目次付きの PDF 書き出し

### 修正
- ダークモードでの表の配置の問題
- 大きなファイルを処理するときのメモリリーク

### 変更
- 既定のフォントを Arial から Inter に変更
```

一貫性のために [Keep a Changelog](https://keepachangelog.com) の書式に従いましょう。

### 注意書きブロックを使う

ほとんどのドキュメントツールは、警告、ヒント、メモのための注意書きブロック（admonition）に対応しています。

```markdown
:::warning
この操作は元に戻せません。続行する前に
必ずデータをバックアップしてください。
:::

:::tip
設定ファイルでキャッシュを有効にすると
ビルドを高速化できます。
:::
```

### 検索機能を用意する

10 ページを超えるドキュメントサイトには、検索機能が欠かせません。MkDocs（Material テーマ）と Docusaurus には、どちらも検索機能があります。検索機能のない静的サイトなら、Algolia DocSearch を検討しましょう。

### ドキュメントの更新を自動化する

CI/CD パイプラインを使って、変更がマージされたら自動でドキュメントをビルドしてデプロイしましょう。

```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
```

## PDF のドキュメントを作る

オフラインで読むため、コンプライアンス要件を満たすため、あるいは印刷物を好むクライアントに配布するために、PDF 形式のドキュメントが必要になることがあります。

printmd のようなツールを使えば、Markdown のドキュメントを PDF に変換できます。レイアウト、改ページ、組版は自動で処理されます。特に次のような場面で役立ちます。

- 製品に同梱する**ユーザーマニュアル**
- 企業のクライアントに提供する **API ドキュメント**
- 日付とバージョンを明記した PDF が求められる**コンプライアンス文書**
- 印刷して配布する**研修資料**

大切なのは、2 つの出力を意識して Markdown を書くことです。標準的な Markdown の機能を使い、できるだけ特定のツール専用の拡張を避け、Web と PDF の両方の形式でドキュメントを確認しましょう。

## まとめ

Markdown が技術ドキュメントの標準になったのは、執筆、レビュー、バージョン管理、公開というすべての工程から手間を取り除いてくれるからです。わかりやすいフォルダ構成から始め、ニーズに合ったツールを選び、Diátaxis フレームワークに沿って、あらゆる読者の役に立つドキュメントにしましょう。

最高のドキュメントとは、実際に書かれたドキュメントです。Markdown は始めるハードルが低いので、より多くのチームメンバーが参加できます。それこそが最大のメリットです。
