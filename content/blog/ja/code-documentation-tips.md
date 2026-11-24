---
title: "コードドキュメントのベストプラクティス"
description: "インラインコメント、API ドキュメント、README、変更履歴（CHANGELOG）まで、効果的なコードドキュメントの書き方を解説。よりよいドキュメントを書きたい開発者のための実践的なヒント集です。"
date: 2025-03-10
tags:
  - コード
  - ドキュメント
  - 開発
  - ベストプラクティス
---

## ドキュメントが重要な理由

「コードは“どうやって”を語り、コメントは“なぜ”を語る」。プログラミングの古い格言ですが、ドキュメントが大切な理由をよく表しています。よいコードは何をしているかを自ら説明してくれますが、なぜその方法を選んだのか、どんなトレードオフを検討したのか、どんな境界条件に注意すべきかまでは語ってくれません。

ドキュメントは他人のためだけのものではありません。未来の自分のためでもあります。3 か月前に書いたときは明快に思えた関数も、あとで見返すと暗号のように感じられるものです。設計会議では当たり前だったアーキテクチャ上の判断も、理由を書き残しておかなければ、あとから見て首をかしげることになります。

開発者はコードを書く時間よりも読む時間のほうが長いことが、調査で繰り返し示されています。よいドキュメントはコードを理解する時間を減らし、改善に使える時間を増やしてくれます。

## ドキュメントの階層

コードのドキュメントには複数の階層があり、それぞれ役割が異なります。

1. **インラインコメント**：特定の行やブロックがなぜ存在するのかを説明します。
2. **関数／メソッドのドキュメント**：関数が何をするか、引数、戻り値、例外を説明します。
3. **モジュール／ファイルのドキュメント**：ファイルやモジュールの目的と責務を説明します。
4. **アーキテクチャのドキュメント**：大局的な設計判断とシステムの構造を説明します。
5. **ユーザー向けドキュメント**：エンドユーザー向けのガイド、チュートリアル、API リファレンスです。

階層ごとに適した書き方があります。順に詳しく見ていきましょう。

## インラインコメント

### コメントを書くべきとき

「なぜ」が自明でないときにコメントを書きます。見ればわかるコードにはコメントは不要です。

```javascript
// 悪い例：当たり前のことを書いている
// カウンターを 1 増やす
counter++;

// よい例：理由を説明している
// 決済 API がまれに一時的な 503 エラーを返すため、
// 最大 3 回までリトライする
for (let attempt = 0; attempt < 3; attempt++) {
  const result = await processPayment(order);
  if (result.success) break;
}
```

### コメントを書くべきでないとき

コードが何をしているかを説明するコメントを書いていると気づいたら、代わりにコードをわかりやすく書き直すことを検討しましょう。

```javascript
// 悪い例：わかりにくいコードをコメントで説明している
// ユーザーが割引の対象かどうかを確認する
if (u.a > 18 && u.t === 'p' && u.o > 5) {
  applyDiscount(u);
}

// よい例：コード自体が説明になっていてコメント不要
const isEligibleForDiscount =
  user.age > 18 &&
  user.type === 'premium' &&
  user.orderCount > 5;

if (isEligibleForDiscount) {
  applyDiscount(user);
}
```

### 効果的なコメントのパターン

**ビジネスロジックを説明する：**

```python
# 2024 年の税制改正により、税額はクーポン適用「前」の
# 小計に対して計算する。
# 参照：https://tax-authority.gov/regulation/2024-update
tax = calculate_tax(order.subtotal)
discount = apply_coupon(order.coupon_code)
total = order.subtotal + tax - discount
```

**既知の制約を記す：**

```python
# TODO：この方法はテーブル全体をスキャンする。
# 10 万行を超えたらインデックスで最適化すること。
users = db.query("SELECT * FROM users WHERE active = true")
```

**回避策を説明する：**

```javascript
// 2025 年時点で Safari は `scrollend` イベントに対応していない。
// 代替としてデバウンスした scroll リスナーを使う。
// Safari が対応したらこのコードは削除すること。
// 追跡：https://bugs.webkit.org/show_bug.cgi?id=12345
element.addEventListener('scroll', debounce(onScrollEnd, 150));
```

## 関数とメソッドのドキュメント

### JSDoc（JavaScript/TypeScript）

JSDoc は JavaScript と TypeScript の関数をドキュメント化する標準的な方法です。

```typescript
/**
 * 税と割引を含めた注文の合計金額を計算する。
 *
 * 現行の規定に従い、税は割引前の小計に対して課される。
 * 割引は税の計算後に適用される。
 *
 * @param items - 注文明細の配列
 * @param couponCode - 割引用のクーポンコード（省略可）
 * @param taxRate - 小数で表した税率（例：8% なら 0.08）
 * @returns 税と割引を適用した合計金額
 * @throws {InvalidCouponError} クーポンコードが期限切れまたは無効な場合
 *
 * @example
 * ```typescript
 * const total = calculateTotal(
 *   [{ price: 29.99, quantity: 2 }],
 *   'SAVE10',
 *   0.08
 * );
 * console.log(total); // 54.71
 * ```
 */
function calculateTotal(
  items: OrderItem[],
  couponCode?: string,
  taxRate: number = 0.08
): number {
  // 実装
}
```

### Python の docstring

Python では docstring を使います。代表的な書式がいくつかあります（Google スタイル、NumPy スタイル、Sphinx スタイル）。

```python
def calculate_total(
    items: list[OrderItem],
    coupon_code: str | None = None,
    tax_rate: float = 0.08
) -> float:
    """税と割引を含めた注文の合計金額を計算する。

    現行の規定に従い、税は割引前の小計に対して課される。
    割引は税の計算後に適用される。

    Args:
        items: 注文明細のリスト。
        coupon_code: 割引用のクーポンコード（省略可）。
        tax_rate: 小数で表した税率（例：8% なら 0.08）。

    Returns:
        税と割引を適用した合計金額。

    Raises:
        InvalidCouponError: クーポンコードが期限切れまたは無効な場合。

    Example:
        >>> total = calculate_total(
        ...     [OrderItem(price=29.99, quantity=2)],
        ...     coupon_code='SAVE10',
        ...     tax_rate=0.08
        ... )
        >>> print(total)
        54.71
    """
```

### 書くべき内容

関数のドキュメントでは、次の問いに答えましょう。

1. **この関数は何をするのか？** 1〜2 文で。
2. **引数は何か？** 型、説明、制約。
3. **何を返すのか？** 型と説明。
4. **何が起こりうるのか？** 例外やエラー条件。
5. **どう使うのか？** 単純でない関数なら短い使用例を。

## プロジェクトの README 構成

README は、プロジェクトに触れるすべての人の入り口です。詳しくは記事「[伝わる GitHub README の書き方](/ja/blog/github-readme-tips)」をご覧ください。ここでは必須のセクションを簡単にまとめます。

````markdown
# プロジェクト名

プロジェクトが何をするのかを 1 段落で説明します。

## インストール

```bash
npm install project-name
```

## クイックスタート

```javascript
import { Project } from 'project-name';
const result = Project.doSomething();
```

## API リファレンス

### `doSomething(options?)`

簡単な説明と引数。

## コントリビューション

CONTRIBUTING.md へのリンク。

## ライセンス

MIT
````

どんなに小さなプロジェクトにも README は必要です。3 行の README でも、ないよりはずっとましです。

## API ドキュメント

### REST API のドキュメント化

REST API では、各エンドポイントについて次の内容を記載します。

````markdown
## ユーザーの作成

`POST /api/v1/users`

新しいユーザーアカウントを作成します。

### リクエストヘッダー

| ヘッダー      | 型     | 必須 | 説明              |
|:--------------|:-------|:-----|:------------------|
| Authorization | string | はい | Bearer トークン   |
| Content-Type  | string | はい | application/json  |

### リクエストボディ

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
```

### レスポンス

**201 Created**

```json
{
  "id": "usr_abc123",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin",
  "created_at": "2025-03-10T14:30:00Z"
}
```

**400 Bad Request**

```json
{
  "error": "validation_error",
  "message": "Email is already in use"
}
```
````

### API ドキュメントの自動生成

Swagger/OpenAPI などのツールを使うと、コード内のアノテーションから対話的な API ドキュメントを生成できます。

```yaml
# openapi.yaml
paths:
  /api/v1/users:
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully
```

自動生成されたドキュメントは時間の節約になりますが、本当に役立つドキュメントに欠かせない背景説明や使用例が不足しがちです。自動生成と手書きのガイドを組み合わせるのが最善です。

## 変更履歴（CHANGELOG）の管理

変更履歴は、リリースごとに何が変わったかを記録するものです。アップグレード時に何が新しくなり、何が修正され、何が動かなくなるかをユーザーが把握するのに役立ちます。

```markdown
# 変更履歴

このプロジェクトの主な変更はすべて
このファイルに記録します。

書式は [Keep a Changelog](https://keepachangelog.com) に準拠しています。

## [未リリース]

### 追加
- ダッシュボードのダークモードに対応

## [2.1.0] - 2025-03-10

### 追加
- ヘッダー・フッターをカスタマイズできる PDF 書き出し
- Markdown 内の Mermaid 図に対応

### 修正
- PDF 出力で表の配置が保持されない問題
- 50MB を超えるファイルの処理時に発生するメモリリーク

### 変更
- 既定のフォントを Helvetica から Inter に変更
- Node.js の最低バージョンを 18.0 に引き上げ

### 非推奨
- `--legacy-mode` フラグは v3.0 で削除予定

## [2.0.0] - 2025-01-15

### 破壊的変更
- 設定ファイルの形式を JSON から YAML に変更
- Node.js 16 のサポートを終了
```

### 変更履歴のベストプラクティス

- **プルリクエストごとに更新する**。リリース時にまとめて書かない。
- **種類ごとにまとめる**：追加、変更、非推奨、削除、修正、セキュリティ。
- **開発者ではなくユーザー向けに書く**。「PDFRenderer.ts の余白計算を修正」より「書き出した PDF の余白が正しくない不具合を修正」のほうが役に立ちます。
- **Issue やプルリクエストへのリンクを付けて**、経緯がわかるようにする。

## アーキテクチャ決定記録（ADR）

重要な設計判断については、アーキテクチャ決定記録（ADR）を書きましょう。

```markdown
# ADR-003：MongoDB ではなく PostgreSQL を採用する

## ステータス

承認済み

## 背景

ユーザー管理サービスにデータベースが必要である。
チームには PostgreSQL と MongoDB の両方の経験がある。

## 決定

以下の理由から PostgreSQL を採用する。
1. データの関係性が強い（ユーザー、ロール、権限）
2. 課金処理に ACID トランザクションが必要
3. チームは PostgreSQL の経験のほうが豊富

## 影響

- 強い一貫性とリレーショナルなクエリ機能が得られる
- MongoDB のスキーマの柔軟性は失われる
- データベースのマイグレーション管理が必要になる
```

ADR はドキュメントの宝です。半年後に誰かが「なぜ PostgreSQL を選んだの？」と聞いてきても、答えはすでに書き残されています。

## ドキュメントのためのツール

### ドキュメント生成ツール

- **JSDoc / TSDoc**：JavaScript/TypeScript のコメントから HTML ドキュメントを生成
- **Sphinx**：Python のドキュメント生成ツール
- **Javadoc**：Java プロジェクトの標準
- **Doxygen**：多言語対応のドキュメント生成ツール
- **Typedoc**：TypeScript 専用のドキュメント生成ツール

### ドキュメントサイト

ドキュメントを Markdown で書き、MkDocs、Docusaurus、VitePress などのツールで公開しましょう。PDF 版のドキュメントが必要なときは、printmd のようなツールで Markdown ファイルをプロ品質のレイアウトの PDF に変換し、クライアントへの配布やコンプライアンス対応に使えます。

### リントと検証

- **markdownlint**：Markdown の書き方を統一する
- **vale**：ドキュメントの文体をチェックする文章リンター
- **alex**：配慮に欠ける表現を見つける

## よくある落とし穴

### 書きすぎる

誰にも読まれないドキュメントは労力の無駄です。コードを見ればわかることを繰り返す 10 ページよりも、「なぜ」を説明する簡潔な 1 段落のほうが価値があります。

### 書かなさすぎる

「あれを処理する」とだけ書かれた 1 行のコメントは誰の役にも立ちません。冗長さとわかりにくさの間でバランスを取りましょう。

### ドキュメントを更新しない

古いドキュメントは、ドキュメントがないよりも悪いものです。読み手を積極的に誤らせてしまいます。ドキュメントの更新をコードレビューのチェックリストや CI パイプラインに組み込みましょう。

### 実装の詳細を書く

変わる可能性のある実装の詳細ではなく、インターフェース、契約、振る舞いを記述しましょう。「この関数はユーザーのフルネームを返す」は安定したドキュメントです。「この関数は first_name と last_name をスペースでつなげる」は実装の詳細で、次のリファクタリングで通用しなくなるかもしれません。

## まとめ

よいドキュメントを書く力は、練習すればするほど伸びるスキルです。まずは基本から始めましょう。意味のある関数のドキュメントを書き、README を最新に保ち、変更履歴を管理します。プロジェクトが成長したら、アーキテクチャ決定記録や包括的なガイドを加えていきましょう。

投資対効果は明らかです。ドキュメントに費やした 1 時間は、チームと未来の自分が混乱やオンボーディング、デバッグに費やす何時間もの時間を節約してくれます。学んでいたころの自分が見つけたかったドキュメントを書きましょう。
