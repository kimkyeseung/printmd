---
title: "代码文档编写最佳实践"
description: "学习如何编写高效的代码文档，涵盖行内注释、API 文档、README 文件和变更日志。为想写好文档的开发者提供实用技巧。"
date: 2025-03-10
tags:
  - 代码
  - 技术文档
  - 软件开发
  - 最佳实践
---

## 为什么文档很重要

“代码告诉你怎么做，注释告诉你为什么。”这句编程老话道出了文档的意义。好的代码能自己说明它在做什么，却很少能说明为什么选择这种做法、权衡过哪些取舍，或者有哪些边界情况需要注意。

文档不只是写给别人看的，也是写给未来的自己。三个月前写的函数，当时看来清清楚楚，回头再看却可能像天书。设计会议上显而易见的架构决策，如果没有把理由写下来，日后也会让人一头雾水。

研究一再表明，开发者读代码的时间比写代码的时间还多。好的文档能减少理解代码所花的时间，把更多时间留给改进代码。

## 文档的层次

代码文档分为多个层次，各有不同的用途：

1. **行内注释**：解释某一行或某一段代码为什么存在。
2. **函数/方法文档**：描述函数做什么、参数、返回值和异常。
3. **模块/文件文档**：说明文件或模块的用途和职责。
4. **架构文档**：描述高层的设计决策和系统结构。
5. **面向用户的文档**：为最终用户准备的指南、教程和 API 参考。

每个层次都需要不同的写法。下面逐一详细介绍。

## 行内注释

### 什么时候写注释

当“为什么”不那么显而易见时，就写注释。不言自明的代码不需要注释：

```javascript
// 不好：说的都是显而易见的事
// 计数器加一
counter++;

// 好：解释了原因
// 最多重试 3 次，因为支付 API
// 偶尔会返回临时性的 503 错误
for (let attempt = 0; attempt < 3; attempt++) {
  const result = await processPayment(order);
  if (result.success) break;
}
```

### 什么时候不该写注释

如果你发现自己在用注释解释代码做了什么，不妨考虑把代码改写得更清楚：

```javascript
// 不好：用注释解释含糊的代码
// 检查用户是否有资格享受折扣
if (u.a > 18 && u.t === 'p' && u.o > 5) {
  applyDiscount(u);
}

// 好：代码本身就能说明问题，无需注释
const isEligibleForDiscount =
  user.age > 18 &&
  user.type === 'premium' &&
  user.orderCount > 5;

if (isEligibleForDiscount) {
  applyDiscount(user);
}
```

### 行之有效的注释模式

**解释业务逻辑：**

```python
# 根据 2024 年税务法规更新，税费按使用优惠券
# 之前的小计金额计算。
# 参见：https://tax-authority.gov/regulation/2024-update
tax = calculate_tax(order.subtotal)
discount = apply_coupon(order.coupon_code)
total = order.subtotal + tax - discount
```

**标注已知的局限：**

```python
# TODO：这种做法会扫描整张表。行数超过 10 万后
# 需要加索引优化。
users = db.query("SELECT * FROM users WHERE active = true")
```

**解释变通做法：**

```javascript
// 截至 2025 年，Safari 仍不支持 `scrollend` 事件。
// 作为替代，我们使用带防抖的 scroll 监听器。
// Safari 支持后请删除这段代码。
// 跟踪：https://bugs.webkit.org/show_bug.cgi?id=12345
element.addEventListener('scroll', debounce(onScrollEnd, 150));
```

## 函数与方法文档

### JSDoc（JavaScript/TypeScript）

JSDoc 是为 JavaScript 和 TypeScript 函数编写文档的标准方式：

```typescript
/**
 * 计算订单的总价，包含税费和折扣。
 *
 * 根据现行法规，税费按折扣前的小计金额计算。
 * 折扣在计算税费之后应用。
 *
 * @param items - 订单明细数组
 * @param couponCode - 可选的折扣优惠码
 * @param taxRate - 小数形式的税率（例如 0.08 表示 8%）
 * @returns 应用税费和折扣后的总价
 * @throws {InvalidCouponError} 优惠码过期或无效时抛出
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
  // 具体实现
}
```

### Python Docstring

Python 使用 docstring，有几种常见的约定（Google 风格、NumPy 风格、Sphinx 风格）：

```python
def calculate_total(
    items: list[OrderItem],
    coupon_code: str | None = None,
    tax_rate: float = 0.08
) -> float:
    """计算订单的总价，包含税费和折扣。

    根据现行法规，税费按折扣前的小计金额计算。
    折扣在计算税费之后应用。

    Args:
        items: 订单明细列表。
        coupon_code: 可选的折扣优惠码。
        tax_rate: 小数形式的税率（例如 0.08 表示 8%）。

    Returns:
        应用税费和折扣后的总价。

    Raises:
        InvalidCouponError: 优惠码过期或无效时抛出。

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

### 应该写些什么

每个函数的文档块都应回答以下问题：

1. **这个函数做什么？** 一两句话即可。
2. **有哪些参数？** 类型、说明以及任何约束。
3. **返回什么？** 类型和说明。
4. **可能出什么错？** 异常或错误情况。
5. **怎么使用？** 对于不简单的函数，给出一个简短的示例。

## 项目的 README 结构

README 是任何人接触项目的入口。详细的写法请参阅我们的文章[如何写出一份出色的 GitHub README](/zh/blog/github-readme-tips)，这里先概括一下必备的部分：

````markdown
# 项目名称

用一段话说明项目是做什么的。

## 安装

```bash
npm install project-name
```

## 快速上手

```javascript
import { Project } from 'project-name';
const result = Project.doSomething();
```

## API 参考

### `doSomething(options?)`

简要说明和参数。

## 参与贡献

链接到 CONTRIBUTING.md。

## 许可证

MIT
````

无论项目多小，都应该有 README。哪怕只有三行的 README，也比没有强。

## API 文档

### 为 REST API 编写文档

对于 REST API，每个端点都应写明以下内容：

````markdown
## 创建用户

`POST /api/v1/users`

创建一个新的用户账号。

### 请求头

| 请求头        | 类型   | 必填 | 说明              |
|:--------------|:-------|:-----|:------------------|
| Authorization | string | 是   | Bearer 令牌       |
| Content-Type  | string | 是   | application/json  |

### 请求体

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
```

### 响应

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

### 自动生成 API 文档

Swagger/OpenAPI 等工具可以根据代码中的注解生成可交互的 API 文档：

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

自动生成的文档虽然省时间，却往往缺少让文档真正有用的背景说明和示例。把自动生成和手写指南结合起来，效果最好。

## 维护变更日志

变更日志（Changelog）记录了每个版本的变化，帮助用户了解升级后有哪些新功能、修复了什么、哪些地方可能不兼容：

```markdown
# 变更日志

本项目所有值得注意的变更都会记录在
此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com)。

## [未发布]

### 新增
- 仪表盘支持深色模式

## [2.1.0] - 2025-03-10

### 新增
- 支持自定义页眉页脚的 PDF 导出
- Markdown 中支持 Mermaid 图表

### 修复
- PDF 输出中表格对齐方式丢失的问题
- 处理超过 50MB 的文件时出现内存泄漏的问题

### 变更
- 默认字体由 Helvetica 改为 Inter
- Node.js 最低版本要求提高到 18.0

### 弃用
- `--legacy-mode` 参数将在 v3.0 中移除

## [2.0.0] - 2025-01-15

### 不兼容变更
- 配置文件格式由 JSON 改为 YAML
- 不再支持 Node.js 16
```

### 变更日志最佳实践

- **每个拉取请求都更新**，而不是等到发布时才写。
- **按类型分组**：新增、变更、弃用、移除、修复、安全。
- **为用户而写**，而不是为开发者。“修复了导出的 PDF 页边距不正确的问题”比“修复了 PDFRenderer.ts 中的边距计算”有用得多。
- **附上相关 issue 和拉取请求的链接**，方便了解背景。

## 架构决策记录（ADR）

对于重大的设计决策，请编写架构决策记录：

```markdown
# ADR-003：使用 PostgreSQL 而非 MongoDB

## 状态

已采纳

## 背景

用户管理服务需要一个数据库。
团队对 PostgreSQL 和 MongoDB 都有经验。

## 决策

我们将使用 PostgreSQL，原因如下：
1. 我们的数据关系性很强（用户、角色、权限）
2. 计费操作需要 ACID 事务
3. 团队对 PostgreSQL 的经验更丰富

## 影响

- 获得强一致性和关系型查询能力
- 失去 MongoDB 的模式灵活性
- 需要管理数据库迁移
```

ADR 是文档中的瑰宝。半年后有人问“我们当初为什么选 PostgreSQL？”时，答案早已白纸黑字地写在那里。

## 文档工具

### 文档生成器

- **JSDoc / TSDoc**：根据 JavaScript/TypeScript 注释生成 HTML 文档
- **Sphinx**：Python 文档生成器
- **Javadoc**：Java 项目的标准工具
- **Doxygen**：支持多种语言的文档生成器
- **Typedoc**：专为 TypeScript 打造的文档生成器

### 文档网站

用 Markdown 编写文档，再用 MkDocs、Docusaurus 或 VitePress 等工具发布。需要 PDF 版本的文档时，printmd 这样的工具可以把 Markdown 文件转换成排版专业的 PDF，方便分发给客户或满足合规要求。

### 检查与校验

- **markdownlint**：统一 Markdown 写法
- **vale**：检查文档写作风格的文本检查工具
- **alex**：找出不够得体或欠考虑的措辞

## 常见误区

### 写得太多

没人读的文档就是白费力气。一段解释“为什么”的简洁文字，比十页重复代码内容的说明更有价值。

### 写得太少

一句“处理那个东西”的单行注释帮不了任何人。要在啰嗦和晦涩之间找到平衡。

### 不更新文档

过时的文档比没有文档更糟糕，它会主动误导读者。把文档更新纳入代码评审清单和 CI 流水线。

### 记录实现细节

应该记录接口、约定和行为，而不是可能会变的实现细节。“这个函数返回用户的全名”是稳定的文档；“这个函数用空格把 first_name 和 last_name 拼接起来”则是实现细节，下次重构时可能就不成立了。

## 总结

写好文档是一项越练越熟的技能。先从基础做起：写有意义的函数文档，保持 README 最新，维护变更日志。随着项目发展，再补充架构决策记录和完整的使用指南。

投入产出比显而易见。在文档上花的每一个小时，都能为团队和未来的自己省下许多在困惑、新人上手和调试上耗费的时间。把你在学习时希望能找到的文档写出来吧。
