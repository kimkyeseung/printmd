---
title: "Creating a Professional Resume with Markdown"
description: "Build a clean, ATS-friendly resume using Markdown. Learn template structure, CSS styling, and how to convert your Markdown resume to PDF with printmd."
date: 2025-03-20
tags:
  - markdown
  - resume
  - career
  - PDF
---

## Why Write Your Resume in Markdown?

Your resume is one of the most important documents you will ever create, and most people build theirs in the worst possible way: by fighting with Microsoft Word templates, adjusting margins pixel by pixel, and praying the formatting survives when saved as a PDF.

Writing your resume in Markdown offers a fundamentally different approach. You focus on the content, the structure, and the information. The formatting is handled separately, either by CSS or by a conversion tool. This separation of content and presentation has several practical benefits:

**Version control**: Store your resume in Git and track every change. Create branches for different versions targeted at different industries or roles. See exactly what you changed and when.

**Multiple formats from one source**: A single Markdown file can generate PDF, HTML, and Word versions. Apply different CSS themes for different contexts without rewriting content.

**Easy updates**: Adding a new job or skill takes seconds. No fighting with text boxes, tables, or formatting that breaks when you insert a line.

**Plain text durability**: Your resume will be readable in any text editor for decades. No proprietary format lock-in, no compatibility issues.

**ATS compatibility**: When converted to PDF properly, Markdown resumes produce clean, parseable text that Applicant Tracking Systems can read easily.

## The Markdown Resume Template

Here is a complete resume template in Markdown:

```markdown
---
title: "Resume - Jane Smith"
author: "Jane Smith"
---

# Jane Smith

**Senior Software Engineer**

San Francisco, CA | jane.smith@email.com | (555) 123-4567
[linkedin.com/in/janesmith](https://linkedin.com/in/janesmith) | [github.com/janesmith](https://github.com/janesmith)

---

## Summary

Senior software engineer with 8 years of experience
building scalable web applications. Specialized in
React, Node.js, and cloud architecture. Led teams of
5-12 engineers. Passionate about developer experience
and code quality.

---

## Experience

### Senior Software Engineer
**Acme Technology** | San Francisco, CA
*January 2022 - Present*

- Led the migration of a monolithic application to
  microservices, reducing deployment time from 45
  minutes to 5 minutes
- Designed and implemented a real-time notification
  system serving 2M+ daily active users
- Mentored 4 junior engineers through structured
  code reviews and pair programming sessions
- Reduced API response times by 60% through database
  query optimization and caching strategies

### Software Engineer
**Beta Software Inc.** | San Jose, CA
*June 2019 - December 2021*

- Built the customer-facing dashboard using React
  and TypeScript, serving 500K monthly active users
- Implemented CI/CD pipeline with GitHub Actions,
  reducing release cycle from 2 weeks to daily
  deployments
- Developed RESTful APIs in Node.js handling 10K+
  requests per second
- Contributed to open-source projects including
  the company's design system library (2K+ GitHub stars)

### Junior Software Engineer
**Startup Labs** | Palo Alto, CA
*July 2017 - May 2019*

- Developed features for a SaaS project management
  tool using Python and Django
- Wrote comprehensive unit and integration tests,
  improving code coverage from 45% to 85%
- Collaborated with the design team to implement
  responsive layouts for mobile devices

---

## Education

### Bachelor of Science in Computer Science
**University of California, Berkeley**
*Graduated May 2017*

- GPA: 3.8/4.0
- Dean's List: Fall 2015, Spring 2016, Fall 2016
- Relevant coursework: Algorithms, Operating Systems,
  Database Systems, Machine Learning

---

## Skills

**Languages:** JavaScript, TypeScript, Python, Go, SQL
**Frontend:** React, Next.js, Vue.js, HTML/CSS, Tailwind
**Backend:** Node.js, Express, Django, GraphQL, REST
**Database:** PostgreSQL, MongoDB, Redis, Elasticsearch
**Cloud:** AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes
**Tools:** Git, GitHub Actions, Jenkins, Terraform, Datadog

---

## Certifications

- AWS Certified Solutions Architect - Associate (2023)
- Google Cloud Professional Cloud Developer (2022)

---

## Projects

### Open Source Contribution: react-table-kit
*github.com/janesmith/react-table-kit*

A high-performance table component for React with
sorting, filtering, and pagination. 1.2K stars, 200+ forks.
Used in production by 50+ companies.
```

## Writing Effective Content

### The Summary Section

Your summary should be three to four lines that answer: "Why should we hire this person?" Lead with your experience level, core expertise, and what sets you apart.

```markdown
## Summary

Senior software engineer with 8 years of experience
building scalable web applications. Specialized in
React, Node.js, and cloud architecture. Led teams of
5-12 engineers. Passionate about developer experience
and code quality.
```

Avoid generic phrases like "team player" or "hard worker." State concrete skills and measurable experience.

### Experience Entries

Each bullet point under a job should follow the formula: **Action verb + What you did + Measurable result**.

```markdown
- Led the migration of a monolithic application to
  microservices, reducing deployment time from 45
  minutes to 5 minutes
```

Not:

```markdown
- Worked on microservices migration project
```

The first version tells the reader exactly what you did and what impact it had. The second version says almost nothing.

### Strong Action Verbs

Use specific, impactful verbs:

| Weak           | Strong                                     |
|:---------------|:-------------------------------------------|
| Worked on      | Designed, Built, Implemented               |
| Helped with    | Led, Mentored, Coordinated                 |
| Was responsible for | Managed, Owned, Delivered              |
| Did             | Architected, Optimized, Automated          |

### Quantify Everything

Numbers make your resume concrete and credible:

- "Reduced API response times by **60%**"
- "Serving **2M+ daily active users**"
- "Improved code coverage from **45% to 85%**"
- "Led a team of **5-12 engineers**"
- "Handling **10K+ requests per second**"

If you do not have exact numbers, use reasonable estimates. "Improved page load time significantly" is weaker than "Improved page load time by approximately 40%."

## Styling with CSS

The power of a Markdown resume comes alive when you apply CSS. The same content can look completely different with different stylesheets.

### Clean, Professional Theme

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

### Minimal Theme

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

## Converting to PDF

### Using printmd

printmd is well-suited for resume conversion because it focuses on clean typography and proper page layout. Load your Markdown resume, apply your CSS theme, and export to PDF. The result is a professional document that looks as good as anything created in a design tool.

Key advantages for resumes:

- Consistent rendering across platforms
- Proper page break handling if your resume extends to two pages
- Typography controls for font size, line height, and margins
- Local processing keeps your personal information private

### Using Pandoc

For command-line users, Pandoc with a LaTeX template or CSS produces professional results:

```bash
# With default LaTeX styling
pandoc resume.md -o resume.pdf

# With custom CSS via HTML intermediate
pandoc resume.md -o resume.pdf \
  --css=resume-theme.css \
  --pdf-engine=wkhtmltopdf

# With custom LaTeX template
pandoc resume.md -o resume.pdf \
  --template=resume-template.tex
```

### Using md-to-pdf

```bash
md-to-pdf resume.md --stylesheet resume-theme.css
```

## ATS-Friendly Output

Applicant Tracking Systems (ATS) scan resumes before a human ever sees them. Many beautifully designed resumes fail ATS parsing because they use images, complex layouts, or non-standard formatting.

Markdown resumes have a natural advantage here because the source is structured plain text. When converted to PDF properly, the text layer is clean and parseable.

### Tips for ATS Compatibility

**Use standard section headings.** ATS systems look for recognized headings:

```markdown
## Experience       (not "Where I've Worked")
## Education        (not "Academic Background")
## Skills           (not "My Toolkit")
```

**Avoid tables for layout.** Use tables only for tabular data. ATS systems may misread table-based layouts.

**Include keywords from the job description.** If the posting mentions "React," "TypeScript," and "microservices," make sure those exact terms appear in your resume.

**Use standard date formats.** "January 2022 - Present" or "Jan 2022 - Present" are both fine. Avoid "1/22 - now."

**Do not use images or icons.** ATS cannot read images. If your contact information is in an image, it will be invisible to the system.

**Use a single-column layout.** Multi-column layouts confuse many ATS systems. Keep it simple.

## Managing Multiple Resume Versions

One of the biggest advantages of Markdown resumes is the ability to maintain multiple versions efficiently:

```
resume/
  base-resume.md          # Complete resume with all experience
  resume-frontend.md      # Tailored for frontend roles
  resume-fullstack.md     # Tailored for full-stack roles
  resume-leadership.md    # Emphasizes management experience
  themes/
    professional.css
    minimal.css
    modern.css
```

Your base resume contains everything. Tailored versions remove irrelevant sections and emphasize the most relevant experience for each type of role.

With Git, you can track changes across all versions and see exactly how each tailored version differs from the base.

## Common Mistakes to Avoid

### Too Long

For most professionals, one page is ideal. Two pages are acceptable for senior roles with extensive experience. Three pages are almost never appropriate.

### Generic Content

"Responsible for building web applications" does not tell the reader anything specific. Every bullet point should be unique to your experience.

### Inconsistent Formatting

If you use periods at the end of some bullet points but not others, or mix past and present tense randomly, it signals a lack of attention to detail. Markdown helps with consistency because the structure is explicit.

### Missing Contact Information

Every resume needs: name, email, phone number, and location (city and state). LinkedIn and GitHub profiles are strongly recommended for technical roles.

### Lying or Exaggerating

Inflated claims will be discovered during interviews or reference checks. Present your real accomplishments compellingly instead.

## Conclusion

A Markdown resume gives you the best of both worlds: clean, structured content that you control completely, with professional PDF output when you need it. Write your content once, maintain it in Git, and generate tailored versions for different opportunities.

The workflow is simple: write in Markdown, style with CSS, convert to PDF with printmd or Pandoc, and submit with confidence. Your resume's content is what gets you the interview. Markdown just makes it easier to keep that content clean, current, and beautifully presented.
