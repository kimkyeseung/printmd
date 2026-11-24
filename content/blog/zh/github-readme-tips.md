---
title: "如何写出一份出色的 GitHub README"
description: "学习如何用合理的结构、徽章、截图和示例写出高效的 GitHub README 文件，用一份专业的 README 让你的开源项目脱颖而出。"
date: 2025-02-01
tags:
  - GitHub
  - README
  - Markdown
  - 开源
---

## 为什么 README 很重要

README 是项目的大门。有人打开你的 GitHub 仓库时，第一眼看到的就是 README。很多时候，这也是他们在决定使用、参与贡献还是转身离开之前唯一会读的东西。

一份写得好的 README 能把随意路过的访客变成活跃的用户或贡献者。写得差的 README——更糟的是根本没有 README——则意味着项目已被放弃、缺乏维护，或者不值得花力气去弄明白。

对开源项目采用情况的研究一再表明，文档质量是开发者在多个库之间做选择时最重要的因素之一。你的代码也许非常出色，但如果别人在前三十秒内看不懂它是做什么的、该怎么用，他们就会去找替代品。

## 基本结构

出色的 README 不需要很长，但需要有结构。下面这个模板适用于大多数项目，从小工具到大型框架都可以。

### 项目名称与简介

先写一个清晰简洁的名称，再用一段话说明项目是做什么的：

```markdown
# printmd

一款把 Markdown 转换为 PDF 的工具，生成排版精美的文档。
用 Markdown 写作，导出带有专业字体排版和版式的
PDF。
```

简介中避免使用行话，假设读者从没听说过你的项目。回答这个问题：“它是做什么的？我为什么要关心？”

### 徽章

徽章能让人一眼看出项目状态。把它们放在简介正下方：

```markdown
![Build Status](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)
![npm version](https://img.shields.io/npm/v/package-name)
![License](https://img.shields.io/github/license/user/repo)
![Downloads](https://img.shields.io/npm/dm/package-name)
```

常见的徽章包括：

- **构建状态**：显示 CI/CD 是否通过。
- **版本**：当前发布的版本号。
- **许可证**：MIT、Apache、GPL 等。
- **下载量**：每月或累计下载次数。
- **覆盖率**：测试覆盖率百分比。

徽章不要放太多，五到七个是比较合理的上限。徽章太多只会显得杂乱，并不能增加价值。

### 截图或演示

一图胜千言。如果项目有可视化的部分，就展示出来：

```markdown
## 演示

![printmd 把 Markdown 文件转换成 PDF](./screenshots/demo.gif)

试试[在线演示](https://printmd.app/demo)，亲眼看看效果。
```

如果是命令行工具，可以考虑用 asciinema 之类的终端录制工具，或者制作一个展示工具运行过程的 GIF。

### 安装

为每一种支持的安装方式提供清晰、可直接复制粘贴的说明：

````markdown
## 安装

### npm

```bash
npm install printmd
```

### yarn

```bash
yarn add printmd
```

### Homebrew

```bash
brew install printmd
```
````

如果有系统要求，也要写清楚，不要让用户去猜。如果项目需要 Node.js 18+、Python 3.9+ 或特定的操作系统，请明确说明。

### 快速上手 / 用法

给出最简单的使用示例，让用户用尽可能少的步骤从安装走到可用的结果：

````markdown
## 快速上手

```bash
# 把 Markdown 文件转换成 PDF
printmd convert document.md

# 使用自定义选项
printmd convert document.md --output report.pdf --theme professional
```
````

快速上手之后，可以再提供更详细的用法示例：

````markdown
## 用法

### 基本转换

```javascript
import { convert } from 'printmd';

const pdf = await convert('# Hello World\n\nThis is my document.');
fs.writeFileSync('output.pdf', pdf);
```

### 配置选项

| 选项      | 类型   | 默认值  | 说明                     |
|-----------|--------|---------|--------------------------|
| theme     | string | default | PDF 主题名称             |
| fontSize  | number | 12      | 基础字号（单位：磅）     |
| margin    | string | 1in     | 页边距                   |
| pageSize  | string | A4      | 纸张大小（A4、Letter）   |
````

### API 参考

如果是库，请提供完整的 API 参考，或者给出链接。README 至少应该覆盖主要函数：

```markdown
## API

### `convert(markdown, options?)`

把 Markdown 字符串转换为 PDF 缓冲区。

**参数：**
- `markdown`（string）：要转换的 Markdown 内容。
- `options`（object，可选）：配置选项。

**返回值：** `Promise<Buffer>`——生成的 PDF 缓冲区。
```

API 较多时，与其把所有内容都塞进 README，不如链接到单独的文档网站。

### 参与贡献

让别人能轻松参与进来：

```markdown
## 参与贡献

欢迎贡献！提交拉取请求之前，
请先阅读我们的[贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交修改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request
```

### 许可证

一定要清楚注明许可证：

```markdown
## 许可证

本项目采用 MIT 许可证，详情请参阅
[LICENSE](LICENSE) 文件。
```

## 写好 README 的技巧

### 使用主动语态和直接的表达

写“安装这个包”，而不是“这个包应当被安装”。直接的指令更容易照着做。

### 段落要短

大段文字很难快速浏览。每段控制在三四句话以内，功能或要求的清单用项目符号列出。

### 为“扫读”的人而写

大多数人是扫读 README，而不是从头读到尾。用清晰的标题，关键术语加粗，命令放进代码块。要让人花 30 秒扫一眼就能明白项目是做什么的、怎么安装。

### 写上常见错误的处理

预先想到常见问题并给出解决办法：

```markdown
### 故障排除

**错误：`ENOENT: no such file or directory`**

请确认输入文件的路径正确，且文件确实存在。

**错误：`Cannot find module 'puppeteer'`**

运行 `npm install` 安装所有依赖。
```

### 保持更新

安装说明过时、API 示例已被废弃的 README 弊大于利。修改 API 时，请在同一个拉取请求里一并更新 README。

## README 进阶技巧

### 目录

README 较长时，可以加上目录：

```markdown
## 目录

- [安装](#安装)
- [快速上手](#快速上手)
- [API 参考](#api-参考)
- [配置](#配置)
- [参与贡献](#参与贡献)
- [许可证](#许可证)
```

GitHub 会自动为标题生成锚点链接，所以这些链接无需额外配置就能使用。

### 可折叠区块

对于重要但并非每位读者都需要的内容，可以使用 HTML 的 details 标签：

````markdown
<details>
<summary>高级配置</summary>

在项目根目录创建 `.printmdrc` 文件，
即可自定义行为：

```json
{
  "theme": "professional",
  "fontSize": 11,
  "pageSize": "Letter"
}
```

</details>
````

### 多语言支持

如果项目面向国际用户，可以考虑提供 README 的翻译版本：

```markdown
README: [English](README.md) | [한국어](README.ko.md) | [中文](README.zh.md)
```

### 突出核心功能

在靠前的位置放一份功能列表，帮助用户快速了解项目能做什么：

```markdown
## 功能

- **转换迅速**——毫秒级把 Markdown 转换成 PDF
- **排版精美**——开箱即用的专业字体与版式
- **代码高亮**——支持 100 多种语言的语法高亮
- **本地处理**——文件永远不会离开你的电脑
- **跨平台**——支持 macOS、Windows 和 Linux
```

## 优秀 README 示例

可以参考下面这些项目找灵感：

- **freeCodeCamp/freeCodeCamp**：内容全面，贡献指南清晰。
- **vuejs/vue**：简洁有条理，快速上手部分写得很好。
- **sindresorhus/awesome**：展示了 README 可以多么简单，同时依然有效。
- **nvm-sh/nvm**：命令行工具的安装和用法文档十分详尽。

这些 README 有一些共同点：结构清晰、便于扫读、坦诚说明局限，并且定期更新。

## 把 README 生成 PDF

如果需要把 README 作为独立文档分享，比如作为项目提案或作品集的一部分，可以把它转换成 PDF。printmd 这样的工具能很好地处理 GitHub 风格的 Markdown，包括表格、代码块、任务列表和徽章。

在提交课程项目文档、向客户演示或申请资助等需要 PDF 格式的场合，这一点尤其有用。

## 总结

出色的 README 不在于长度，而在于清晰、有结构，并且尊重读者的时间。把基本要素（做什么、为什么、怎么用）讲清楚，提供能跑通的示例，并保持更新。README 是项目的门面，一定要用心。

从本指南的模板开始，根据你的项目进行调整，再根据用户提出的问题不断完善。最好的 README 是随着项目一起成长的“活文档”。
