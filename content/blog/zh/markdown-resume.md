---
title: "用 Markdown 制作专业简历"
description: "用 Markdown 打造一份简洁、对 ATS 友好的简历。学习模板结构、CSS 样式设计，以及如何用 printmd 把 Markdown 简历转换成 PDF。"
date: 2025-03-20
tags:
  - Markdown
  - 简历
  - 求职
  - PDF
---

## 为什么用 Markdown 写简历？

简历是你一生中最重要的文档之一，可大多数人却用最糟糕的方式来做：和 Microsoft Word 模板较劲，一个像素一个像素地调整页边距，再祈祷另存为 PDF 时格式别乱掉。

用 Markdown 写简历，是一种截然不同的做法。你只需专注于内容、结构和信息，格式则交给 CSS 或转换工具单独处理。这种内容与呈现的分离带来了不少实际好处：

**版本控制**：把简历存放在 Git 中，跟踪每一次修改。为针对不同行业或岗位的版本创建分支，清楚地看到自己在什么时候改了什么。

**一份源文件，多种格式**：一个 Markdown 文件可以生成 PDF、HTML 和 Word 版本。针对不同场合套用不同的 CSS 主题，无需重写内容。

**更新方便**：添加一段新的工作经历或一项新技能只需几秒钟。不用再和文本框、表格较劲，也不会插入一行就把格式弄乱。

**纯文本经久耐用**：几十年后，你的简历依然能用任何文本编辑器打开。不会被专有格式绑定，也没有兼容性问题。

**兼容 ATS**：只要正确转换成 PDF，Markdown 简历就能生成干净、可解析的文本，求职者跟踪系统（ATS）可以轻松读取。

## Markdown 简历模板

下面是一份完整的 Markdown 简历模板：

```markdown
---
title: "简历 - Jane Smith"
author: "Jane Smith"
---

# Jane Smith

**高级软件工程师**

San Francisco, CA | jane.smith@email.com | (555) 123-4567
[linkedin.com/in/janesmith](https://linkedin.com/in/janesmith) | [github.com/janesmith](https://github.com/janesmith)

---

## 个人简介

拥有 8 年可扩展 Web 应用开发经验的
高级软件工程师。专长于 React、Node.js
和云架构。曾带领 5-12 人的工程团队。
热衷于提升开发者体验和代码质量。

---

## 工作经历

### 高级软件工程师
**Acme Technology** | San Francisco, CA
*2022 年 1 月 - 至今*

- 主导将单体应用迁移至微服务架构，
  部署时间从 45 分钟
  缩短至 5 分钟
- 设计并实现实时通知系统，
  服务 200 万以上日活跃用户
- 通过规范的代码评审和结对编程，
  指导 4 名初级工程师
- 通过数据库查询优化和缓存策略，
  将 API 响应时间缩短 60%

### 软件工程师
**Beta Software Inc.** | San Jose, CA
*2019 年 6 月 - 2021 年 12 月*

- 使用 React 和 TypeScript 构建面向客户的仪表盘，
  服务 50 万月活跃用户
- 用 GitHub Actions 搭建 CI/CD 流水线，
  将发布周期从 2 周缩短为
  每日部署
- 用 Node.js 开发 RESTful API，
  每秒处理 1 万次以上请求
- 参与开源项目，包括公司的
  设计系统组件库（GitHub 星标 2000+）

### 初级软件工程师
**Startup Labs** | Palo Alto, CA
*2017 年 7 月 - 2019 年 5 月*

- 使用 Python 和 Django 为 SaaS 项目管理工具
  开发功能
- 编写全面的单元测试和集成测试，
  将代码覆盖率从 45% 提升至 85%
- 与设计团队合作，
  实现适配移动设备的响应式布局

---

## 教育背景

### 计算机科学 理学学士
**University of California, Berkeley**
*2017 年 5 月毕业*

- GPA：3.8/4.0
- 院长嘉许名单：2015 年秋季、2016 年春季、2016 年秋季
- 相关课程：算法、操作系统、
  数据库系统、机器学习

---

## 专业技能

**编程语言：** JavaScript、TypeScript、Python、Go、SQL
**前端：** React、Next.js、Vue.js、HTML/CSS、Tailwind
**后端：** Node.js、Express、Django、GraphQL、REST
**数据库：** PostgreSQL、MongoDB、Redis、Elasticsearch
**云服务：** AWS（EC2、S3、Lambda、RDS）、Docker、Kubernetes
**工具：** Git、GitHub Actions、Jenkins、Terraform、Datadog

---

## 证书

- AWS Certified Solutions Architect - Associate（2023）
- Google Cloud Professional Cloud Developer（2022）

---

## 项目经历

### 开源贡献：react-table-kit
*github.com/janesmith/react-table-kit*

一款高性能的 React 表格组件，支持
排序、筛选和分页。1200 星标，200 多个 Fork。
已被 50 多家公司用于生产环境。
```

## 写出有说服力的内容

### 个人简介

个人简介用三四行回答一个问题：“我们为什么要录用这个人？”先写经验水平和核心专长，再写你与众不同的地方。

```markdown
## 个人简介

拥有 8 年可扩展 Web 应用开发经验的
高级软件工程师。专长于 React、Node.js
和云架构。曾带领 5-12 人的工程团队。
热衷于提升开发者体验和代码质量。
```

避免“有团队精神”“工作努力”这类空泛的说法，写出具体的技能和可衡量的经验。

### 工作经历条目

每段工作经历下的每一条，都应遵循这个公式：**动作动词 + 做了什么 + 可衡量的结果**。

```markdown
- 主导将单体应用迁移至微服务架构，
  部署时间从 45 分钟
  缩短至 5 分钟
```

而不是：

```markdown
- 参与了微服务迁移项目
```

第一种写法准确告诉读者你做了什么、产生了什么影响；第二种写法几乎什么也没说。

### 有力的动作动词

使用具体、有分量的动词：

| 弱          | 强                       |
|:------------|:-------------------------|
| 参与了      | 设计、构建、实现         |
| 协助了      | 主导、指导、协调         |
| 负责        | 管理、主持、交付         |
| 做了        | 架构、优化、自动化       |

### 一切尽量量化

数字能让简历更具体、更可信：

- “将 API 响应时间缩短 **60%**”
- “服务 **200 万以上日活跃用户**”
- “将代码覆盖率从 **45% 提升至 85%**”
- “带领 **5-12 人**的工程团队”
- “每秒处理 **1 万次以上请求**”

如果没有确切的数字，可以用合理的估算。“显著改善了页面加载速度”远不如“将页面加载时间缩短了约 40%”有说服力。

## 用 CSS 设计样式

应用 CSS 之后，Markdown 简历的威力才真正显现出来。同样的内容，换一套样式表就能呈现完全不同的面貌。

### 简洁专业主题

```css
/* resume-theme.css */
body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 11pt;
  line-height: 1.5;
  color: #333;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in 0.75in;
}

h1 {
  font-size: 24pt;
  margin-bottom: 4pt;
  color: #1a1a1a;
  border-bottom: none;
}

h2 {
  font-size: 13pt;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 4pt;
  margin-top: 16pt;
}

h3 {
  font-size: 12pt;
  margin-bottom: 2pt;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 12pt 0;
}

ul {
  padding-left: 18pt;
}

li {
  margin-bottom: 4pt;
}

strong {
  color: #1a1a1a;
}

a {
  color: #2563eb;
  text-decoration: none;
}
```

### 极简主题

```css
body {
  font-family: 'Georgia', serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #222;
  padding: 0.75in 1in;
}

h1 {
  font-size: 20pt;
  font-weight: normal;
  letter-spacing: 2px;
  text-transform: uppercase;
}

h2 {
  font-size: 11pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 20pt;
}

h3 {
  font-size: 11pt;
  font-style: italic;
  font-weight: normal;
}
```

## 转换为 PDF

### 使用 printmd

printmd 注重整洁的字体排版和合理的页面版式，非常适合转换简历。载入 Markdown 简历，套用 CSS 主题，再导出为 PDF，就能得到一份专业文档，效果不输任何设计工具做出来的作品。

用于简历的主要优势：

- 在各平台上渲染效果一致
- 简历超过一页时能妥善处理分页
- 可以控制字号、行高和页边距等排版细节
- 本地处理，保护你的个人信息

### 使用 Pandoc

对于习惯命令行的用户，Pandoc 搭配 LaTeX 模板或 CSS 也能生成专业的效果：

```bash
# 使用默认的 LaTeX 样式
pandoc resume.md -o resume.pdf

# 通过 HTML 中间格式使用自定义 CSS
pandoc resume.md -o resume.pdf \
  --css=resume-theme.css \
  --pdf-engine=wkhtmltopdf

# 使用自定义 LaTeX 模板
pandoc resume.md -o resume.pdf \
  --template=resume-template.tex
```

### 使用 md-to-pdf

```bash
md-to-pdf resume.md --stylesheet resume-theme.css
```

## 对 ATS 友好的输出

求职者跟踪系统（ATS）会在招聘人员看到简历之前先进行扫描。许多设计精美的简历之所以没能通过 ATS 解析，是因为用了图片、复杂的版式或不规范的格式。

Markdown 简历在这方面有天然优势，因为源文件就是结构化的纯文本。只要正确转换成 PDF，文本层就会干净、可解析。

### 兼容 ATS 的技巧

**使用标准的章节标题。** ATS 会寻找它能识别的标题：

```markdown
## 工作经历       （不要写“我待过的地方”）
## 教育背景       （不要写“求学之路”）
## 专业技能       （不要写“我的工具箱”）
```

**不要用表格排版。** 表格只用于表格型数据，ATS 可能会误读基于表格的版式。

**加入职位描述中的关键词。** 如果招聘信息提到了“React”“TypeScript”和“微服务”，请确保简历中出现完全相同的词。

**使用标准的日期格式。** “2022 年 1 月 - 至今”或“2022.01 - 至今”都可以，避免“22/1 - 现在”这类写法。

**不要使用图片或图标。** ATS 无法读取图片。如果联系方式放在图片里，系统就完全看不到。

**使用单栏版式。** 多栏版式会让许多 ATS 产生混乱，保持简单。

## 管理多个简历版本

Markdown 简历的一大优势，是可以高效地维护多个版本：

```
resume/
  base-resume.md          # 包含全部经历的完整简历
  resume-frontend.md      # 针对前端岗位
  resume-fullstack.md     # 针对全栈岗位
  resume-leadership.md    # 突出管理经验
  themes/
    professional.css
    minimal.css
    modern.css
```

基础简历包含所有内容；定制版本则去掉无关的部分，突出与各类岗位最相关的经历。

借助 Git，你可以跟踪所有版本的修改，清楚地看到每个定制版本与基础版本的差异。

## 需要避免的常见错误

### 篇幅太长

对大多数职场人士来说，一页最理想。经验丰富的资深岗位可以写两页。三页几乎在任何情况下都不合适。

### 内容空泛

“负责开发 Web 应用”没有告诉读者任何具体信息。每一条都应该是你独有的经历。

### 格式不统一

如果有些条目末尾有句号、有些没有，或者时态、语气随意混用，就会显得不够细心。Markdown 的结构是明确的，有助于保持一致。

### 缺少联系方式

每份简历都需要：姓名、邮箱、电话和所在城市。应聘技术岗位时，强烈建议附上 LinkedIn 和 GitHub 主页。

### 撒谎或夸大

夸大的说法会在面试或背景调查中被识破。不如把你真实的成就有说服力地展现出来。

## 总结

Markdown 简历让你两全其美：内容简洁、结构清晰且完全由你掌控，需要时又能输出专业的 PDF。内容只需写一次，用 Git 维护，再针对不同的机会生成定制版本。

工作流程很简单：用 Markdown 写作，用 CSS 设计样式，用 printmd 或 Pandoc 转换成 PDF，然后自信地投递。让你获得面试机会的是简历的内容，而 Markdown 只是让这些内容更容易保持整洁、及时更新并美观地呈现。
