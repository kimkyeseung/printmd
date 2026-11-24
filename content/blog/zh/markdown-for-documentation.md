---
title: "用 Markdown 编写技术文档"
description: "用 Markdown 构建技术文档的实用指南，介绍目录结构、交叉引用、版本管理，以及搭建文档网站的最佳工具。"
date: 2025-02-10
tags:
  - Markdown
  - 技术文档
  - 技术写作
  - 软件开发
---

## 为什么用 Markdown 写文档？

技术文档有一套独特的要求：要好写、好维护、能做版本控制，还要能发布成多种格式。Markdown 满足了所有这些要求，同时又足够简单，团队里的每个人都能参与贡献，而不只是专职的技术写作者。

在 Markdown 成为标准之前，团队会用 Wiki、Word 文档或定制的内容管理系统来写文档。每种方式都有麻烦之处：Wiki 需要一直运行的服务器；Word 文档在版本控制中会产生合并冲突；定制的 CMS 平台则把内容锁死在专有格式里。

Markdown 改变了这一切。文档和代码放在同一个仓库里，修改走同样的拉取请求流程，任何人只要有文本编辑器就能参与。输出既可以是静态网站，也可以是 PDF 手册，或者两者兼有。

## 搭建文档结构

### 目录组织

组织良好的目录结构是文档易于维护的基础。下面这种模式从小项目到大项目都适用：

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

每个文件夹代表一个章节，每个文件就是一个页面。根目录下的 `index.md` 是首页。这种结构可以自然地对应到文档网站的导航。

### 命名规范

文件名使用小写字母并用连字符分隔，例如 `getting-started.md`，而不是 `Getting Started.md` 或 `getting_started.md`。这样可以避免 URL 编码问题，在各种操作系统上表现也一致。

### 首页

`index.md` 应该一上来就回答三个问题：

1. 这个项目是什么？
2. 它是给谁用的？
3. 我该如何开始？

```markdown
# 项目名称

项目名称是一款[简短介绍]，帮助[目标用户]
[实现核心价值]。

## 快速链接

- [安装指南](getting-started/installation.md)
- [快速上手教程](getting-started/quick-start.md)
- [API 参考](api/overview.md)
- [常见问题](guides/troubleshooting.md)
```

## 写出有效的文档

### 文档的四种类型

Diátaxis 框架把文档分为四种类型，各有不同的用途：

1. **教程（Tutorials）**：以学习为导向，为初学者提供循序渐进的课程。“按照这些步骤搭建你的第一个项目。”
2. **操作指南（How-to Guides）**：以任务为导向，针对具体目标给出操作说明。“如何配置 SSL 证书。”
3. **参考（Reference）**：以信息为导向，精确描述 API 或配置。“`--verbose` 参数会开启详细日志。”
4. **解释（Explanation）**：以理解为导向，讨论概念和设计决策。“我们为什么选择事件驱动架构。”

大多数文档之所以失败，就是因为把这几种类型混在了一起。教程不应该停下来讲解架构，参考页面也不应该夹杂分步操作。把它们分开。

### 交叉引用

文档之间要多加链接。读者很少从头开始按顺序阅读，他们往往是从搜索引擎进入某个页面，需要链接来找到相关内容：

```markdown
关于认证的更多细节，请参阅
[认证指南](../api/authentication.md)。

此功能需要 `advanced` 套餐，
详情请参阅[价格](../reference/pricing.md)。
```

内部链接使用相对路径。这样无论是在文档网站上，还是直接在 GitHub 上浏览文件，链接都能正常工作。

### 代码示例

技术文档的成败取决于代码示例。每个概念都应该配有可运行的示例：

````markdown
### 创建客户端

```python
from mylib import Client

# 使用你的 API 密钥初始化
client = Client(api_key="your-api-key")

# 发起请求
response = client.get("/users")
print(response.json())
```

> **注意**：切勿提交真实的 API 密钥。
> 生产环境请使用环境变量。
````

代码示例应当做到：

- **完整**：包含导入、初始化和清理。
- **正确**：每个示例都要测试过。出错的代码示例会摧毁读者的信任。
- **可直接复制粘贴**：读者把示例复制到编辑器里，只需极少改动就能运行。

### 文档的版本管理

当软件同时有多个在维护的版本时，文档也需要版本管理。有以下几种做法：

**Git 分支**：为每个主要版本维护一个文档分支。

```
main          -> 最新版本的文档
v2.x          -> 版本 2 的文档
v1.x          -> 版本 1 的文档
```

**按文件夹区分版本**：把各版本的文档放在不同的文件夹中。

```
docs/
  latest/
  v2/
  v1/
```

**借助工具管理版本**：很多文档平台内置了版本管理功能，下一节会介绍。

## 文档网站生成器

### MkDocs

MkDocs 是基于 Python、专为文档设计的静态网站生成器。它简单、快速，生成的页面干净整洁。

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
# 安装
pip install mkdocs mkdocs-material

# 在本地预览
mkdocs serve

# 构建静态网站
mkdocs build
```

Material for MkDocs 主题尤其受欢迎，开箱即用地提供搜索、深色模式、版本管理和响应式布局。

### Docusaurus

Docusaurus 由 Meta 开发，是一个基于 React 的文档框架。它的功能比 MkDocs 更丰富，但学习曲线也更陡：

```bash
npx create-docusaurus@latest my-docs classic
cd my-docs
npm start
```

Docusaurus 支持 MDX（可以写 JSX 的 Markdown），能直接在文档中嵌入可交互的 React 组件：

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

### 其他选择

- **GitBook**：商业平台，免费额度很慷慨，非常适合想要托管方案的团队。
- **VitePress**：由 Vue 驱动，快速轻巧，很适合 Vue 生态的项目。
- **Sphinx**：Python 项目文档的标准工具，支持 reStructuredText 和 Markdown。
- **Astro Starlight**：基于 Astro 的新选择，凭借性能和灵活性越来越受欢迎。

## 最佳实践

### 为你的读者而写

了解谁在读你的文档。如果读者是经验丰富的开发者，可以默认他们熟悉常用的工具和概念；如果读者中有初学者，就要明确写出前置条件。

### 维护变更日志

维护一个 `CHANGELOG.md`，记录每个版本中值得注意的变更：

```markdown
# 变更日志

## [2.1.0] - 2025-02-10

### 新增
- 支持自定义主题
- 带目录的 PDF 导出

### 修复
- 深色模式下表格对齐的问题
- 处理大文件时的内存泄漏

### 变更
- 默认字体由 Arial 改为 Inter
```

为了保持一致，请遵循 [Keep a Changelog](https://keepachangelog.com) 的约定。

### 使用提示块

大多数文档工具都支持用于警告、技巧和注意事项的提示块（admonition）：

```markdown
:::warning
此操作无法撤销。继续之前，
请务必备份你的数据。
:::

:::tip
在配置文件中开启缓存，
可以加快构建速度。
:::
```

### 提供搜索功能

只要文档网站超过十个页面，搜索就必不可少。MkDocs（配合 Material 主题）和 Docusaurus 都自带搜索功能。对于没有内置搜索的静态网站，可以考虑 Algolia DocSearch。

### 自动更新文档

使用 CI/CD 流水线，在修改合并后自动构建并部署文档：

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

## 生成 PDF 文档

有时你需要 PDF 格式的文档，用于离线查阅、满足合规要求，或者分发给喜欢纸质材料的客户。

你可以用 printmd 这样的工具把 Markdown 文档转换成 PDF，它会自动处理版式、分页和字体排版。这在以下场景中尤其有用：

- 随产品附带的**用户手册**
- 提供给企业客户的 **API 文档**
- 需要标注日期和版本的 PDF **合规文档**
- 以纸质讲义形式分发的**培训材料**

关键在于写 Markdown 时就考虑到两种输出。使用标准的 Markdown 功能，尽量避免某个工具特有的扩展，并同时在网页和 PDF 两种格式下检查文档。

## 总结

Markdown 之所以成为技术文档的标准，是因为它消除了写作、评审、版本管理和发布各个环节的阻力。从清晰的目录结构开始，选择适合需求的工具，并遵循 Diátaxis 框架，确保文档能满足各类读者的需要。

最好的文档，是真正被写出来的文档。Markdown 的门槛很低，能让更多团队成员参与进来，这才是最大的收获。
