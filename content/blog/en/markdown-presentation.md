---
title: "Creating Presentations with Markdown: A Practical Guide"
description: "Learn how to build beautiful presentations using Markdown with tools like Marp, Slidev, and reveal.js. From basic slide syntax to advanced features, code highlighting, and PDF export."
date: 2025-03-25
tags:
  - markdown
  - presentations
  - slides
  - talks
---

## Why Markdown for Presentations?

Creating presentations in PowerPoint or Google Slides is a familiar workflow, but it comes with familiar frustrations: spending more time adjusting layout than writing content, inconsistent formatting across slides, and binary files that are impossible to track in version control.

Markdown presentations flip this model. You write your content in plain text, separate slides with simple markers, and let tools handle the visual rendering. The result is a workflow that is faster, more consistent, and version-control friendly.

This approach is especially popular for:

- **Technical talks** with code examples
- **Conference presentations** that need syntax highlighting
- **Internal team presentations** where content matters more than visual polish
- **Educational content** that is updated frequently
- **Developers** who want to stay in their code editor

This guide covers the three most popular Markdown presentation tools, shows you how to create slides from scratch, and explains how to export your presentations to PDF.

## Tool Overview

### Marp (Markdown Presentation Ecosystem)

Marp is the most straightforward tool for creating Markdown presentations. It works as a VS Code extension, a CLI tool, and a standalone application.

**Installation:**

```bash
# CLI tool
npm install -g @marp-team/marp-cli

# Or use the VS Code extension: "Marp for VS Code"
```

**Basic slide syntax:**

````markdown
---
marp: true
theme: default
paginate: true
---

# Introduction to GraphQL

**Jane Smith** - Senior Engineer at Acme Corp
March 2025

---

## What is GraphQL?

- A query language for APIs
- Developed by Facebook in 2012
- Open-sourced in 2015
- Alternative to REST

---

## REST vs GraphQL

| Feature       | REST          | GraphQL        |
|:--------------|:--------------|:---------------|
| Endpoints     | Multiple      | Single         |
| Data fetching | Fixed         | Flexible       |
| Over-fetching | Common        | Eliminated     |
| Versioning    | URL-based     | Schema-based   |

---

## Query Example

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

In Marp, slides are separated by `---` (horizontal rules). The first `---` block contains YAML frontmatter for configuration.

**Converting to PDF:**

```bash
# Generate PDF
marp presentation.md --pdf

# Generate HTML
marp presentation.md --html

# Generate PowerPoint
marp presentation.md --pptx

# With custom theme
marp presentation.md --pdf --theme custom-theme.css
```

### Slidev

Slidev is a Vue-powered presentation tool for developers. It offers more interactivity and customization than Marp but has a steeper learning curve.

**Installation:**

```bash
npm init slidev@latest
```

**Basic slide syntax:**

````markdown
---
theme: seriph
background: https://source.unsplash.com/1920x1080/?nature
class: text-center
---

# Welcome to Slidev

Presentation slides for developers

---

## What is Slidev?

Slidev is a slides maker and presenter designed
for developers.

<v-click>

- Built with Vue 3
- Markdown-based
- Syntax highlighting
- Recording support

</v-click>

---

## Code with Highlighting

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

Slidev supports step-by-step animations with `<v-click>`, line highlighting in code blocks with `{2-3|5-6}` syntax, and Vue components directly in slides.

**Running and exporting:**

```bash
# Start dev server with live preview
npx slidev

# Export to PDF
npx slidev export

# Export to PNG images
npx slidev export --format png
```

### reveal.js

reveal.js is the most mature and full-featured Markdown presentation framework. It powers many conference talks and has been around since 2011.

**Setup:**

```bash
git clone https://github.com/hakimel/reveal.js.git
cd reveal.js
npm install
npm start
```

**Markdown slide syntax:**

```html
<section data-markdown>
  <textarea data-template>
    ## Slide 1
    A paragraph with **bold** and *italic* text.

    ---

    ## Slide 2
    - Item 1
    - Item 2
    - Item 3

    ---

    ## Slide 3

    ```javascript
    console.log('Hello, reveal.js!');
    ```
  </textarea>
</section>
```

reveal.js also supports loading Markdown from external files:

```html
<section
  data-markdown="slides.md"
  data-separator="---"
  data-separator-vertical="--"
></section>
```

## Creating Effective Slides

### One Idea Per Slide

The most common mistake in presentations is cramming too much content onto a single slide. Each slide should convey one idea:

```markdown
---

## The Problem

Users are abandoning the checkout process.

**68%** drop off at the payment step.

---

## Root Cause

Payment form requires 12 fields.

Industry standard is 5-7 fields.

---

## Our Solution

Reduce payment form to 6 essential fields.

Auto-fill where possible using saved data.

---
```

Three focused slides communicate more effectively than one crowded slide.

### Code Examples in Slides

One of the biggest advantages of Markdown presentations is native code support. All three tools provide syntax highlighting:

````markdown
---

## API Response Handling

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

For live coding during presentations, Slidev supports running code directly in slides. For static presentations, well-formatted code blocks with syntax highlighting are more than sufficient.

### Speaker Notes

All three tools support speaker notes, which are visible to you but not the audience:

**Marp:**
```markdown
---

## Key Metrics

- Revenue up 23% year-over-year
- Customer acquisition cost down 15%
- Net promoter score: 72

<!--
Speaker notes:
- Emphasize that revenue growth accelerated in Q4
- Mention the new referral program contribution
- Compare NPS to industry average of 45
-->

---
```

**Slidev:**
```markdown
---

## Key Metrics

- Revenue up 23% year-over-year

<!--
Speaker notes go here in Slidev too.
They appear in presenter mode.
-->

---
```

### Images and Media

```markdown
---

## Architecture Overview

![System architecture diagram](./images/architecture.png)

---

## Before and After

| Before | After |
|:------:|:-----:|
| ![old](./images/before.png) | ![new](./images/after.png) |

---
```

Keep images at a reasonable resolution. Presentations are typically displayed at 1920x1080 or lower, so there is no need for ultra-high-resolution assets that slow down loading.

## Styling Your Presentation

### Marp Themes

Marp comes with three built-in themes: `default`, `gaia`, and `uncover`. You can also create custom themes with CSS:

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

Apply the theme in your frontmatter:

```markdown
---
marp: true
theme: custom-theme
---
```

### Slidev Themes

Slidev has a growing collection of community themes:

```markdown
---
theme: seriph
---
```

Popular themes include `seriph`, `apple-basic`, `dracula`, and `penguin`. You can browse and preview themes on the Slidev theme gallery.

### Per-Slide Styling

Sometimes you need different styling for specific slides:

**Marp:**
```markdown
---

<!-- _class: lead -->
<!-- _backgroundColor: #1a1a2e -->
<!-- _color: white -->

# Thank You

Questions?

---
```

**Slidev:**
```markdown
---
layout: center
class: text-center
---

# Thank You

Questions?

---
```

## Practical Slide Templates

### Title Slide

```markdown
---
marp: true
theme: default
paginate: true
header: "Company Name"
footer: "Confidential"
---

<!-- _class: lead -->

# Quarterly Business Review

## Q4 2024 Results

**Presented by:** Jane Smith, VP Engineering
**Date:** January 15, 2025

---
```

### Agenda Slide

```markdown
---

## Agenda

1. **Q4 Performance Summary** (10 min)
2. **Key Wins and Challenges** (15 min)
3. **2025 Roadmap Preview** (10 min)
4. **Q&A** (10 min)

---
```

### Comparison Slide

```markdown
---

## Framework Comparison

| Criteria        | React    | Vue      | Svelte   |
|:----------------|:--------:|:--------:|:--------:|
| Learning curve  | Moderate | Easy     | Easy     |
| Performance     | Good     | Good     | Excellent|
| Ecosystem       | Massive  | Large    | Growing  |
| Bundle size     | 42 KB    | 33 KB    | 1.6 KB   |
| Job market      | Largest  | Growing  | Emerging |

---
```

### Quote Slide

```markdown
---

<!-- _class: lead -->

> "Any fool can write code that a computer can
> understand. Good programmers write code that
> humans can understand."
>
> -- Martin Fowler

---
```

## Exporting to PDF

All three tools support PDF export, which is essential for sharing presentations after talks or for archiving.

### Marp PDF Export

```bash
# Standard export
marp presentation.md --pdf

# With specific size
marp presentation.md --pdf --pdf-outlines

# Custom output path
marp presentation.md --pdf -o ./output/talk.pdf
```

### Slidev PDF Export

```bash
npx slidev export --output presentation.pdf
```

### Using printmd for Slide Handouts

If you want to create a document version of your presentation (not slides, but a readable document), you can restructure your Markdown and convert it to a PDF handout using printmd. This is useful for:

- Conference attendees who want to review the content later
- Stakeholders who missed the presentation
- Archives and documentation

The key is that the same Markdown content can serve as slides (with a slide tool) and as a document (with printmd), just by adjusting the frontmatter and removing slide separators.

## Tips for Better Presentations

### Rehearse with Your Actual Slides

Run through the presentation using presenter mode. All three tools have presenter view showing your current slide, next slide, speaker notes, and a timer.

### Keep Text Minimal

If your audience is reading your slides, they are not listening to you. Use slides as visual anchors, not teleprompters:

```markdown
---

## The Wrong Way

Our team conducted extensive research over a period
of six months examining the correlation between code
review practices and software defect rates across
multiple projects of varying sizes and complexity
levels within the organization...

---

## The Right Way

**6-month study across 12 projects**

Code reviews reduce defects by **40%**

---
```

### Use Consistent Formatting

Stick to the same heading levels, bullet styles, and code formatting throughout. Markdown enforces this naturally, which is another advantage over visual editors.

### Version Control Your Presentations

Store your presentation in Git alongside your project:

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

You get full history, easy collaboration through pull requests, and the ability to branch for different versions of the same talk.

## Comparison: Which Tool Should You Choose?

| Feature               | Marp       | Slidev     | reveal.js  |
|:----------------------|:-----------|:-----------|:-----------|
| Learning curve        | Low        | Medium     | Medium     |
| Setup complexity      | Low        | Medium     | Medium     |
| VS Code integration   | Excellent  | Good       | Limited    |
| Interactivity         | Basic      | Advanced   | Advanced   |
| Custom components     | CSS only   | Vue        | HTML/JS    |
| PDF export            | Built-in   | Built-in   | Plugin     |
| PPTX export           | Yes        | No         | No         |
| Live coding           | No         | Yes        | Plugin     |
| Presenter mode        | Yes        | Yes        | Yes        |
| Best for              | Quick talks| Dev talks  | Conferences|

**Choose Marp** if you want the simplest possible setup and mostly create informational slides.

**Choose Slidev** if you want interactivity, animations, and Vue component integration.

**Choose reveal.js** if you need maximum customization and are comfortable with HTML and JavaScript.

## Conclusion

Markdown presentations are not just a developer novelty. They are a genuinely faster, more maintainable way to create slides, especially for technical content. Write your content in plain text, let the tools handle the design, and spend your time refining your message instead of adjusting pixel positions.

Start with Marp for its simplicity, explore Slidev when you need interactivity, and consider reveal.js for highly customized conference talks. Whichever tool you choose, the core workflow remains the same: write Markdown, preview, and present.
