---
title: "用 Markdown 制作演示文稿：实用指南"
description: "学习如何借助 Marp、Slidev 和 reveal.js 等工具，用 Markdown 制作精美的演示文稿。从基础的幻灯片语法到进阶功能、代码高亮和 PDF 导出，一文讲清。"
date: 2025-03-25
tags:
  - Markdown
  - 演示文稿
  - 幻灯片
  - 技术分享
---

## 为什么用 Markdown 做演示文稿？

用 PowerPoint 或 Google 幻灯片做演示文稿是大家熟悉的流程，但也伴随着熟悉的烦恼：调整版式的时间比写内容的时间还多，各页幻灯片格式不统一，二进制文件也无法在版本控制中追踪。

Markdown 演示文稿颠覆了这种模式。你用纯文本写内容，用简单的标记分隔幻灯片，视觉呈现交给工具处理。这样的工作流程更快、更统一，也更适合版本控制。

这种方式尤其适合：

- 带代码示例的**技术分享**
- 需要语法高亮的**会议演讲**
- 内容比视觉效果更重要的**团队内部汇报**
- 需要频繁更新的**教学内容**
- 想一直待在代码编辑器里的**开发者**

本指南介绍三款最流行的 Markdown 演示工具，演示如何从零开始制作幻灯片，并讲解如何把演示文稿导出为 PDF。

## 工具概览

### Marp（Markdown Presentation Ecosystem）

Marp 是制作 Markdown 演示文稿最简单直接的工具。它有 VS Code 扩展、命令行工具和独立应用三种形式。

**安装：**

```bash
# 命令行工具
npm install -g @marp-team/marp-cli

# 或者使用 VS Code 扩展：“Marp for VS Code”
```

**基本的幻灯片语法：**

````markdown
---
marp: true
theme: default
paginate: true
---

# GraphQL 入门

**Jane Smith** - Acme Corp 高级工程师
2025 年 3 月

---

## 什么是 GraphQL？

- 一种用于 API 的查询语言
- 由 Facebook 于 2012 年开发
- 2015 年开源
- REST 的替代方案

---

## REST 与 GraphQL 对比

| 特性       | REST       | GraphQL    |
|:-----------|:-----------|:-----------|
| 端点       | 多个       | 单个       |
| 数据获取   | 固定       | 灵活       |
| 过度获取   | 常见       | 消除       |
| 版本管理   | 基于 URL   | 基于 Schema |

---

## 查询示例

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

在 Marp 中，幻灯片用 `---`（分隔线）分隔。第一个 `---` 块中是用于配置的 YAML front matter。

**转换为 PDF：**

```bash
# 生成 PDF
marp presentation.md --pdf

# 生成 HTML
marp presentation.md --html

# 生成 PowerPoint
marp presentation.md --pptx

# 使用自定义主题
marp presentation.md --pdf --theme custom-theme.css
```

### Slidev

Slidev 是一款由 Vue 驱动、面向开发者的演示工具。它比 Marp 有更强的交互性和定制性，但学习曲线也更陡。

**安装：**

```bash
npm init slidev@latest
```

**基本的幻灯片语法：**

````markdown
---
theme: seriph
background: https://source.unsplash.com/1920x1080/?nature
class: text-center
---

# 欢迎使用 Slidev

为开发者打造的演示幻灯片

---

## 什么是 Slidev？

Slidev 是一款为开发者设计的
幻灯片制作与演示工具。

<v-click>

- 基于 Vue 3 构建
- 以 Markdown 为基础
- 语法高亮
- 支持录制

</v-click>

---

## 带高亮的代码

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

Slidev 支持用 `<v-click>` 实现逐步出现的动画，用 `{2-3|5-6}` 语法高亮代码块中的指定行，还可以直接在幻灯片中使用 Vue 组件。

**运行与导出：**

```bash
# 启动带实时预览的开发服务器
npx slidev

# 导出为 PDF
npx slidev export

# 导出为 PNG 图片
npx slidev export --format png
```

### reveal.js

reveal.js 是最成熟、功能最全面的 Markdown 演示框架。它从 2011 年就已存在，许多会议演讲都在用它。

**搭建：**

```bash
git clone https://github.com/hakimel/reveal.js.git
cd reveal.js
npm install
npm start
```

**Markdown 幻灯片语法：**

```html
<section data-markdown>
  <textarea data-template>
    ## 第 1 页
    一段包含**粗体**和*斜体*的文字。

    ---

    ## 第 2 页
    - 项目 1
    - 项目 2
    - 项目 3

    ---

    ## 第 3 页

    ```javascript
    console.log('Hello, reveal.js!');
    ```
  </textarea>
</section>
```

reveal.js 也支持从外部文件加载 Markdown：

```html
<section
  data-markdown="slides.md"
  data-separator="---"
  data-separator-vertical="--"
></section>
```

## 制作有效的幻灯片

### 一页只讲一个观点

演示文稿最常见的错误，就是在一页幻灯片里塞进太多内容。每页幻灯片只应传达一个观点：

```markdown
---

## 问题

用户在结账流程中流失。

**68%** 的用户在支付环节离开。

---

## 根本原因

支付表单需要填写 12 个字段。

行业标准是 5-7 个字段。

---

## 我们的方案

把支付表单精简为 6 个必填字段。

尽可能利用已保存的数据自动填写。

---
```

三页重点突出的幻灯片，比一页塞得满满的幻灯片更能有效传达信息。

### 幻灯片中的代码示例

Markdown 演示文稿最大的优势之一是原生支持代码。三款工具都提供语法高亮：

````markdown
---

## 处理 API 响应

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

如果要在演讲中现场写代码，Slidev 支持直接在幻灯片中运行代码。对于静态的演示文稿，排版良好且带语法高亮的代码块就绰绰有余了。

### 演讲者备注

三款工具都支持演讲者备注，只有你能看到，观众看不到：

**Marp：**
```markdown
---

## 关键指标

- 营收同比增长 23%
- 获客成本下降 15%
- 净推荐值（NPS）：72

<!--
演讲者备注：
- 强调营收增长在第四季度加速
- 提一下新推荐计划的贡献
- 与行业平均 NPS 45 做对比
-->

---
```

**Slidev：**
```markdown
---

## 关键指标

- 营收同比增长 23%

<!--
在 Slidev 中，演讲者备注也写在这里。
它们会显示在演讲者模式中。
-->

---
```

### 图片与多媒体

```markdown
---

## 架构概览

![系统架构图](./images/architecture.png)

---

## 改进前后对比

| 改进前 | 改进后 |
|:------:|:------:|
| ![旧版](./images/before.png) | ![新版](./images/after.png) |

---
```

图片保持合理的分辨率即可。演示文稿通常以 1920x1080 或更低的分辨率显示，不需要拖慢加载速度的超高清素材。

## 设计演示文稿的样式

### Marp 主题

Marp 内置三种主题：`default`、`gaia` 和 `uncover`。你也可以用 CSS 创建自定义主题：

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

在 front matter 中应用主题：

```markdown
---
marp: true
theme: custom-theme
---
```

### Slidev 主题

Slidev 的社区主题越来越多：

```markdown
---
theme: seriph
---
```

热门主题包括 `seriph`、`apple-basic`、`dracula` 和 `penguin`。你可以在 Slidev 主题库中浏览和预览各种主题。

### 单页样式

有时某些幻灯片需要不同的样式：

**Marp：**
```markdown
---

<!-- _class: lead -->
<!-- _backgroundColor: #1a1a2e -->
<!-- _color: white -->

# 谢谢

有问题吗？

---
```

**Slidev：**
```markdown
---
layout: center
class: text-center
---

# 谢谢

有问题吗？

---
```

## 实用幻灯片模板

### 封面页

```markdown
---
marp: true
theme: default
paginate: true
header: "公司名称"
footer: "内部资料"
---

<!-- _class: lead -->

# 季度业务回顾

## 2024 年第四季度业绩

**汇报人：** Jane Smith，工程副总裁
**日期：** 2025 年 1 月 15 日

---
```

### 议程页

```markdown
---

## 议程

1. **第四季度业绩总结**（10 分钟）
2. **主要成果与挑战**（15 分钟）
3. **2025 年路线图预览**（10 分钟）
4. **问答**（10 分钟）

---
```

### 对比页

```markdown
---

## 框架对比

| 评估项     | React  | Vue    | Svelte |
|:-----------|:------:|:------:|:------:|
| 学习曲线   | 适中   | 简单   | 简单   |
| 性能       | 良好   | 良好   | 极佳   |
| 生态       | 庞大   | 大     | 成长中 |
| 包体积     | 42 KB  | 33 KB  | 1.6 KB |
| 就业市场   | 最大   | 增长中 | 新兴   |

---
```

### 引言页

```markdown
---

<!-- _class: lead -->

> “任何傻瓜都能写出计算机能理解的代码。
> 优秀的程序员写出的是
> 人能理解的代码。”
>
> ——Martin Fowler

---
```

## 导出为 PDF

三款工具都支持导出 PDF，这对于演讲后分享演示文稿或归档至关重要。

### Marp 导出 PDF

```bash
# 标准导出
marp presentation.md --pdf

# 附带 PDF 大纲
marp presentation.md --pdf --pdf-outlines

# 自定义输出路径
marp presentation.md --pdf -o ./output/talk.pdf
```

### Slidev 导出 PDF

```bash
npx slidev export --output presentation.pdf
```

### 用 printmd 制作讲义

如果你想要演示文稿的文档版本（不是幻灯片，而是便于阅读的文档），可以调整 Markdown 的结构，再用 printmd 转换成 PDF 讲义。这适用于：

- 想在会后回顾内容的参会者
- 错过演讲的相关人员
- 归档和存档文档

关键在于，同一份 Markdown 内容既可以做成幻灯片（借助幻灯片工具），也可以做成文档（借助 printmd），只需调整 front matter 并去掉幻灯片分隔符即可。

## 让演示更出色的技巧

### 用真实的幻灯片排练

用演讲者模式完整地走一遍。三款工具都有演讲者视图，可以显示当前幻灯片、下一页、演讲者备注和计时器。

### 文字越少越好

如果观众在读你的幻灯片，他们就没在听你讲。把幻灯片当作视觉锚点，而不是提词器：

```markdown
---

## 错误的做法

我们团队在六个月的时间里开展了广泛的研究，
考察了组织内多个规模和复杂程度各不相同的项目中
代码评审实践与软件缺陷率之间的
相关性……

---

## 正确的做法

**历时 6 个月，覆盖 12 个项目的研究**

代码评审让缺陷减少 **40%**

---
```

### 保持格式统一

从头到尾使用同样的标题级别、项目符号样式和代码格式。Markdown 天然就会让你保持一致，这也是它相比可视化编辑器的另一个优势。

### 对演示文稿做版本控制

把演示文稿和项目一起存放在 Git 中：

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

这样你就拥有完整的历史记录，可以通过拉取请求轻松协作，还能为同一场演讲的不同版本创建分支。

## 对比：该选哪款工具？

| 特性           | Marp       | Slidev     | reveal.js  |
|:---------------|:-----------|:-----------|:-----------|
| 学习曲线       | 低         | 中         | 中         |
| 搭建难度       | 低         | 中         | 中         |
| VS Code 集成   | 极佳       | 良好       | 有限       |
| 交互性         | 基础       | 高级       | 高级       |
| 自定义组件     | 仅 CSS     | Vue        | HTML/JS    |
| PDF 导出       | 内置       | 内置       | 插件       |
| PPTX 导出      | 支持       | 不支持     | 不支持     |
| 现场写代码     | 不支持     | 支持       | 插件       |
| 演讲者模式     | 支持       | 支持       | 支持       |
| 最适合         | 快速分享   | 开发者分享 | 大型会议   |

**选择 Marp**：如果你想要最简单的搭建方式，主要制作信息型幻灯片。

**选择 Slidev**：如果你需要交互、动画和 Vue 组件集成。

**选择 reveal.js**：如果你需要最大程度的定制，并且熟悉 HTML 和 JavaScript。

## 总结

Markdown 演示文稿不只是开发者的新鲜玩意儿。它确实是一种更快、更易维护的幻灯片制作方式，尤其适合技术内容。用纯文本写内容，设计交给工具，把时间花在打磨你要传达的信息上，而不是调整像素位置。

先从简单的 Marp 入手，需要交互时再探索 Slidev，制作高度定制的会议演讲时可以考虑 reveal.js。无论选择哪款工具，核心工作流程都一样：写 Markdown、预览、开讲。
