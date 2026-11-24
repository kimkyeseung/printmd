---
title: "如何把 Markdown 转换成 PDF：完整指南"
description: "盘点把 Markdown 文件转换为 PDF 的最佳方法，包括命令行工具、在线转换器和 printmd，附分步说明和让输出更专业的技巧。"
date: 2025-01-20
tags:
  - Markdown
  - PDF
  - Markdown 转 PDF
  - printmd
---

## 为什么要把 Markdown 转换成 PDF？

Markdown 是很好的写作格式，但在很多场合，用 PDF 分享或归档更合适。求职需要一份精致的简历，客户希望收到通用、只读格式的方案，学校则需要可以打印的作业。PDF 在任何设备和操作系统上看起来都一样，因此成为正式文档的标准格式。

难点在于，Markdown 本质上是一种源格式。它定义了结构和内容，却几乎不涉及视觉呈现。要把 Markdown 转换成 PDF，需要一个能弥合这道鸿沟的工具：把结构化的文本渲染出来，并处理好字体排版、分页、页眉页脚和页边距。

本指南介绍最常用的几种转换方法，比较它们的优缺点，并分享获得最佳效果的实用技巧。

## 方法一：命令行工具

### Pandoc

Pandoc 是文档转换界的瑞士军刀，支持数十种输入和输出格式，其中就包括 Markdown 转 PDF。

用 Pandoc 把 Markdown 转换成 PDF，需要先安装 LaTeX 发行版（例如 TeX Live 或 MiKTeX），因为 Pandoc 生成 PDF 时会以 LaTeX 作为中间步骤。

```bash
# 基本转换
pandoc document.md -o document.pdf

# 自定义页边距
pandoc document.md -o document.pdf -V geometry:margin=1in

# 生成目录
pandoc document.md -o document.pdf --toc

# 指定语法高亮样式
pandoc document.md -o document.pdf --highlight-style=tango
```

**优点：** 功能极其强大，可高度定制，支持 LaTeX 数学公式，免费开源。

**缺点：** 需要安装 LaTeX（占用好几个 GB），高级定制的学习曲线陡峭，只能在命令行中使用。

### wkhtmltopdf

这个工具使用 WebKit 渲染引擎把 HTML 转换成 PDF。你可以先把 Markdown 转成 HTML，再交给它处理：

```bash
# 先把 Markdown 转成 HTML，再转成 PDF
pandoc document.md -o document.html
wkhtmltopdf document.html document.pdf
```

**优点：** 用 CSS 控制样式，沿用熟悉的网页渲染方式。

**缺点：** 需要两步操作，处理复杂版式时容易出问题，项目已不再积极维护。

### md-to-pdf

一个基于 Node.js 的工具，借助 Puppeteer（无头 Chrome）把 Markdown 转换成 PDF：

```bash
npm install -g md-to-pdf
md-to-pdf document.md
```

你可以在 Markdown 文件开头加一段配置，或者使用单独的配置文件来定制输出。

**优点：** 用 CSS 控制样式，代码高亮效果好，仍在积极开发。

**缺点：** 需要 Node.js，Puppeteer 下载体积大，对页面版式的控制有限。

## 方法二：在线转换器

有不少网站可以直接在浏览器里把 Markdown 转换成 PDF：

- **Dillinger**（dillinger.io）：带 PDF 导出功能的网页版 Markdown 编辑器。
- **MarkdownToPDF.com**：简单的拖放式转换器。
- **CloudConvert**：支持批量转换多个文件。

偶尔用一用的话，在线转换器很方便，但也有代价。你需要把内容上传到第三方服务器，处理敏感文档时可能会有顾虑。而且格式选项通常有限，几乎无法控制最终的样子。

## 方法三：使用 printmd

[printmd](https://printmd.app) 是专门为把 Markdown 转换成精美 PDF 而打造的工具。它以浏览器扩展和桌面应用的形式运行，在本地处理文件，不会上传到任何服务器。

### 分步指南

**第 1 步：安装 printmd**

从 Chrome 网上应用店安装 printmd 浏览器扩展，或者从官网下载桌面应用。

**第 2 步：编写 Markdown**

用任意文本编辑器编写 Markdown 文档。例如：

```markdown
# 项目方案

## 执行摘要

本文档介绍客户门户改版的整体思路，
包括时间安排、预算
以及预期成果。

## 时间安排

| 阶段 | 周期 | 交付物     |
|------|------|------------|
| 调研 | 2 周 | 需求文档   |
| 设计 | 3 周 | 界面原型   |
| 开发 | 6 周 | 可用原型   |
| 测试 | 2 周 | 测试报告   |

## 预算

预计总费用为 **$45,000**，明细
如下：

- 设计：$12,000
- 开发：$25,000
- 测试：$5,000
- 项目管理：$3,000
```

**第 3 步：在 printmd 中打开**

用 printmd 打开 Markdown 文件，工具会渲染出实时预览，让你准确看到 PDF 的最终效果。

**第 4 步：调整版式**

调整纸张大小（A4、Letter 等）、页边距、字体、字号和配色等设置。printmd 提供了合理的默认值，你也可以对每个细节进行微调。

**第 5 步：导出 PDF**

点击“导出 PDF”按钮生成 PDF。文件在你的电脑上本地生成，内容不会离开你的设备。

### printmd 为什么好用

printmd 专为 Markdown 转 PDF 的工作流程而设计，能处理通用转换器常常搞不定的痛点：

- **分页**：自动避免标题孤零零地出现在页面底部、后面却没有内容。
- **代码块**：带语法高亮的代码块不会被分页截断。
- **表格**：表格渲染整洁，边框和对齐都恰到好处。
- **图片**：图片尺寸合适，在页面中的位置自然。

## 方法四：编辑器扩展

许多流行的编辑器都内置或通过扩展提供 PDF 导出功能：

### VS Code

yzane 开发的“Markdown PDF”扩展可以直接在编辑器里把 Markdown 文件转换成 PDF：

1. 从 VS Code 扩展市场安装该扩展。
2. 打开你的 Markdown 文件。
3. 打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）。
4. 搜索“Markdown PDF: Export (pdf)”。

### Typora

Typora 内置 PDF 导出功能，位于“文件 > 导出 > PDF”。它使用自己的渲染引擎，并支持自定义 CSS 主题。

### Obsidian

Obsidian 的核心功能就包含 PDF 导出。打开一篇笔记，点击右上角的三点菜单，选择“导出为 PDF”即可。

## 让输出更专业的技巧

### 用 Front Matter 设置元数据

很多转换工具会读取 YAML front matter 来设置文档属性：

```markdown
---
title: "2024 年第四季度报告"
author: "Jane Smith"
date: 2025-01-15
---
```

### 注意标题层级

按顺序使用标题，不要从 `##` 直接跳到 `####`。清晰的标题层级能生成结构良好、目录合乎逻辑的 PDF。

### 在需要的地方添加分页

有些工具支持显式分页。在 printmd 和其他一些转换器中，可以这样写：

```markdown
<div style="page-break-after: always;"></div>
```

或者在某些工具中：

```markdown
---

<!-- pagebreak -->
```

### 优化图片

大图片会拖慢转换速度，还会让 PDF 文件变得臃肿。把图片缩放到它在文档中显示的最大宽度即可。对大多数 A4/Letter 文档来说，800 到 1200 像素宽就足够了。

### 先用短文档测试

在转换 50 页的文档之前，先用一页的样本测试设置。这样在调整页边距、字体和其他版式选项时能节省不少时间。

### 保持格式一致

整篇文档坚持使用同一种写法。如果无序列表用的是短横线，就不要写到一半换成星号。源文件一致，输出才会一致。

## 对比表

| 特性         | Pandoc  | md-to-pdf | printmd | VS Code 扩展 |
|--------------|---------|-----------|---------|--------------|
| 安装难度     | 高      | 中        | 低      | 低           |
| 可定制性     | 非常丰富 | 良好     | 良好    | 有限         |
| 代码高亮     | 支持    | 支持      | 支持    | 支持         |
| 表格支持     | 极佳    | 良好      | 极佳    | 良好         |
| 数学公式     | LaTeX   | KaTeX     | 支持    | 有限         |
| 隐私         | 本地    | 本地      | 本地    | 本地         |
| 学习曲线     | 陡峭    | 适中      | 简单    | 简单         |

## 总结

把 Markdown 转换成 PDF 并不复杂。偶尔做些简单转换，编辑器扩展或在线工具就够用了；对版式要求精确的正式文档，printmd 或 Pandoc 这样的专用工具能给你所需的控制力。

关键是选择适合自己工作流程的工具。如果你整天待在终端里，Pandoc 无可匹敌；如果你想要可视化预览、不装任何依赖就能快速导出，printmd 是绝佳选择。无论选哪个工具，基本原则都一样：写出干净、结构清晰的 Markdown，转换自然水到渠成。
