---
title: "How to Convert Markdown to PDF: A Complete Guide"
description: "Explore the best methods to convert Markdown files to PDF, including CLI tools, online converters, and printmd. Step-by-step instructions and tips for professional output."
date: 2025-01-20
tags:
  - markdown
  - PDF
  - conversion
  - printmd
---

## Why Convert Markdown to PDF?

Markdown is an excellent format for writing, but there are many situations where a PDF is the better choice for sharing or archiving. Job applications require a polished resume. Clients expect proposals in a universal, read-only format. Academic institutions want submissions they can print. PDFs look consistent across every device and operating system, which makes them the standard for professional documents.

The challenge is that Markdown, by nature, is a source format. It defines structure and content, but it says little about visual presentation. Converting Markdown to PDF requires a tool that bridges this gap, one that takes your structured text and renders it with proper typography, page breaks, headers, footers, and margins.

This guide covers the most popular conversion methods, compares their strengths and weaknesses, and provides practical tips for getting the best results.

## Method 1: Command-Line Tools

### Pandoc

Pandoc is the Swiss Army knife of document conversion. It supports dozens of input and output formats, including Markdown to PDF.

To convert a Markdown file to PDF with Pandoc, you need a LaTeX distribution installed (such as TeX Live or MiKTeX), because Pandoc uses LaTeX as an intermediate step for PDF generation.

```bash
# Basic conversion
pandoc document.md -o document.pdf

# With custom margins
pandoc document.md -o document.pdf -V geometry:margin=1in

# With a table of contents
pandoc document.md -o document.pdf --toc

# With syntax highlighting style
pandoc document.md -o document.pdf --highlight-style=tango
```

**Pros:** Extremely powerful, highly customizable, supports LaTeX math, free and open source.

**Cons:** Requires LaTeX installation (several gigabytes), steep learning curve for advanced customization, command-line only.

### wkhtmltopdf

This tool converts HTML to PDF using a WebKit rendering engine. You can pipe Markdown through an HTML converter first:

```bash
# Convert markdown to HTML, then to PDF
pandoc document.md -o document.html
wkhtmltopdf document.html document.pdf
```

**Pros:** CSS-based styling, familiar web rendering model.

**Cons:** Two-step process, can struggle with complex layouts, project is no longer actively maintained.

### md-to-pdf

A Node.js-based tool that converts Markdown to PDF using Puppeteer (headless Chrome):

```bash
npm install -g md-to-pdf
md-to-pdf document.md
```

You can customize the output by adding a configuration block at the top of your Markdown file or using a separate config file.

**Pros:** CSS-based styling, good code highlighting, active development.

**Cons:** Requires Node.js, Puppeteer download is large, limited page layout control.

## Method 2: Online Converters

Several websites offer Markdown-to-PDF conversion directly in the browser:

- **Dillinger** (dillinger.io): A web-based Markdown editor with PDF export.
- **MarkdownToPDF.com**: A simple drag-and-drop converter.
- **CloudConvert**: Supports batch conversion of multiple files.

Online converters are convenient for occasional use, but they come with trade-offs. You are uploading your content to a third-party server, which may be a concern for sensitive documents. The formatting options are usually limited, and you have little control over the final appearance.

## Method 3: Using printmd

[printmd](https://printmd.app) is a purpose-built tool for converting Markdown to beautifully formatted PDFs. It runs as a browser extension and desktop application, processing your files locally without uploading them to any server.

### Step-by-Step Guide

**Step 1: Install printmd**

Install the printmd browser extension from the Chrome Web Store or download the desktop application from the official website.

**Step 2: Write Your Markdown**

Create your Markdown document in any text editor. Here is an example:

```markdown
# Project Proposal

## Executive Summary

This document outlines our approach to redesigning
the customer portal, including timeline, budget,
and expected outcomes.

## Timeline

| Phase       | Duration | Deliverable          |
|-------------|----------|----------------------|
| Discovery   | 2 weeks  | Requirements document|
| Design      | 3 weeks  | UI mockups           |
| Development | 6 weeks  | Working prototype    |
| Testing     | 2 weeks  | QA report            |

## Budget

The estimated total cost is **$45,000**, broken down
as follows:

- Design: $12,000
- Development: $25,000
- Testing: $5,000
- Project management: $3,000
```

**Step 3: Open in printmd**

Open your Markdown file with printmd. The tool will render a live preview showing exactly how your PDF will look.

**Step 4: Customize the Layout**

Adjust settings like page size (A4, Letter, etc.), margins, font family, font size, and color scheme. printmd provides sensible defaults, but you can fine-tune every aspect.

**Step 5: Export to PDF**

Click the export button to generate your PDF. The file is created locally on your machine, so your content never leaves your computer.

### Why printmd Works Well for This

printmd was designed specifically for the Markdown-to-PDF workflow. It handles common pain points that general-purpose converters struggle with:

- **Page breaks**: Automatically prevents headings from appearing at the bottom of a page with no content following them.
- **Code blocks**: Syntax-highlighted code blocks that do not get cut off across pages.
- **Tables**: Tables that render cleanly with proper borders and alignment.
- **Images**: Proper image sizing and placement within the page flow.

## Method 4: Editor Extensions

Many popular editors have built-in or extension-based PDF export:

### VS Code

The "Markdown PDF" extension by yzane converts Markdown files to PDF directly from the editor:

1. Install the extension from the VS Code marketplace.
2. Open your Markdown file.
3. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
4. Search for "Markdown PDF: Export (pdf)".

### Typora

Typora has built-in PDF export under File > Export > PDF. It uses its own rendering engine and supports custom CSS themes.

### Obsidian

Obsidian offers PDF export through its core functionality. Open a note, click the three-dot menu, and select "Export to PDF".

## Tips for Professional-Looking Output

### Use Frontmatter for Metadata

Many conversion tools read YAML frontmatter to set document properties:

```markdown
---
title: "Quarterly Report Q4 2024"
author: "Jane Smith"
date: 2025-01-15
---
```

### Mind Your Heading Hierarchy

Use headings in order. Do not skip from `##` to `####`. A clean heading hierarchy produces a well-structured PDF with a logical table of contents.

### Add Page Breaks Where Needed

Some tools support explicit page breaks. In printmd and several other converters, you can use:

```markdown
<div style="page-break-after: always;"></div>
```

Or with some tools:

```markdown
---

<!-- pagebreak -->
```

### Optimize Images

Large images slow down conversion and bloat your PDF file size. Resize images to the maximum width they will appear in the document. For most A4/Letter documents, 800 to 1200 pixels wide is sufficient.

### Test with a Short Document First

Before converting a 50-page document, test your settings with a single-page sample. This saves time when tweaking margins, fonts, and other layout options.

### Use Consistent Formatting

Stick to a single style throughout your document. If you use dashes for unordered lists, do not switch to asterisks halfway through. Consistency in the source translates to consistency in the output.

## Comparison Table

| Feature              | Pandoc      | md-to-pdf  | printmd     | VS Code Ext |
|----------------------|-------------|------------|-------------|-------------|
| Installation effort  | High        | Medium     | Low         | Low         |
| Customization        | Extensive   | Good       | Good        | Limited     |
| Code highlighting    | Yes         | Yes        | Yes         | Yes         |
| Table support        | Excellent   | Good       | Excellent   | Good        |
| Math support         | LaTeX       | KaTeX      | Yes         | Limited     |
| Privacy              | Local       | Local      | Local       | Local       |
| Learning curve       | Steep       | Moderate   | Easy        | Easy        |

## Conclusion

Converting Markdown to PDF does not have to be complicated. For occasional, simple conversions, editor extensions or online tools work fine. For professional documents with precise layout requirements, dedicated tools like printmd or Pandoc give you the control you need.

The key is to choose a tool that matches your workflow. If you live in the terminal, Pandoc is unbeatable. If you want a visual preview and quick export without installing dependencies, printmd is an excellent choice. Whatever tool you pick, the underlying principle remains the same: write clean, well-structured Markdown, and the conversion will take care of itself.
