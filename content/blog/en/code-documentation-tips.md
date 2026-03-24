---
title: "Code Documentation Best Practices"
description: "Learn how to write effective code documentation including inline comments, API docs, README files, and changelogs. Practical tips for developers who want to write better documentation."
date: 2025-03-10
tags:
  - code
  - documentation
  - development
  - best-practices
---

## Why Documentation Matters

"Code tells you how. Comments tell you why." This old programming adage captures the essence of why documentation matters. Good code is self-explanatory in terms of what it does, but it rarely explains why a particular approach was chosen, what trade-offs were considered, or what edge cases need attention.

Documentation is not just for other people. It is for your future self. The function you wrote three months ago that seemed perfectly clear at the time will be cryptic when you revisit it. The architectural decision that was obvious during a design meeting will be baffling without a written record of the reasoning.

Studies consistently show that developers spend more time reading code than writing it. Good documentation reduces the time spent understanding code and increases the time spent improving it.

## Levels of Documentation

Code documentation operates at multiple levels, each serving a different purpose:

1. **Inline comments**: Explain why a specific line or block of code exists.
2. **Function/method documentation**: Describe what a function does, its parameters, return values, and exceptions.
3. **Module/file documentation**: Explain the purpose and responsibility of a file or module.
4. **Architecture documentation**: Describe high-level design decisions and system structure.
5. **User-facing documentation**: Guides, tutorials, and API references for end users.

Each level requires a different approach. Let us examine them in detail.

## Inline Comments

### When to Comment

Comment code when the "why" is not obvious. Do not comment code that is self-explanatory:

```javascript
// Bad: states the obvious
// Increment counter by one
counter++;

// Good: explains why
// We retry up to 3 times because the payment API
// occasionally returns transient 503 errors
for (let attempt = 0; attempt < 3; attempt++) {
  const result = await processPayment(order);
  if (result.success) break;
}
```

### When Not to Comment

If you find yourself writing a comment to explain what code does, consider rewriting the code to be clearer instead:

```javascript
// Bad: comment explains unclear code
// Check if user is eligible for discount
if (u.a > 18 && u.t === 'p' && u.o > 5) {
  applyDiscount(u);
}

// Good: self-documenting code needs no comment
const isEligibleForDiscount =
  user.age > 18 &&
  user.type === 'premium' &&
  user.orderCount > 5;

if (isEligibleForDiscount) {
  applyDiscount(user);
}
```

### Comment Patterns That Work

**Explain business logic:**

```python
# Taxes are calculated on the subtotal BEFORE applying
# coupons, per the 2024 tax regulation update.
# See: https://tax-authority.gov/regulation/2024-update
tax = calculate_tax(order.subtotal)
discount = apply_coupon(order.coupon_code)
total = order.subtotal + tax - discount
```

**Mark known limitations:**

```python
# TODO: This approach scans the entire table. Optimize
# with an index once we exceed 100k rows.
users = db.query("SELECT * FROM users WHERE active = true")
```

**Explain workarounds:**

```javascript
// Safari does not support the `scrollend` event as of 2025.
// We use a debounced scroll listener as a fallback.
// Remove this when Safari adds support.
// Tracking: https://bugs.webkit.org/show_bug.cgi?id=12345
element.addEventListener('scroll', debounce(onScrollEnd, 150));
```

## Function and Method Documentation

### JSDoc (JavaScript/TypeScript)

JSDoc is the standard for documenting JavaScript and TypeScript functions:

```typescript
/**
 * Calculates the total price for an order including tax and discounts.
 *
 * Tax is applied to the pre-discount subtotal per current regulations.
 * Discounts are applied after tax calculation.
 *
 * @param items - Array of order line items
 * @param couponCode - Optional coupon code for discount
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns The calculated total with tax and discounts applied
 * @throws {InvalidCouponError} When the coupon code is expired or invalid
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
  // implementation
}
```

### Python Docstrings

Python uses docstrings with several popular conventions (Google style, NumPy style, Sphinx style):

```python
def calculate_total(
    items: list[OrderItem],
    coupon_code: str | None = None,
    tax_rate: float = 0.08
) -> float:
    """Calculate the total price for an order including tax and discounts.

    Tax is applied to the pre-discount subtotal per current regulations.
    Discounts are applied after tax calculation.

    Args:
        items: List of order line items.
        coupon_code: Optional coupon code for discount.
        tax_rate: Tax rate as a decimal (e.g., 0.08 for 8%).

    Returns:
        The calculated total with tax and discounts applied.

    Raises:
        InvalidCouponError: When the coupon code is expired or invalid.

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

### What to Include

Every function documentation block should answer:

1. **What does this function do?** One or two sentences.
2. **What are the parameters?** Type, description, and any constraints.
3. **What does it return?** Type and description.
4. **What can go wrong?** Exceptions or error conditions.
5. **How do I use it?** A short example for non-trivial functions.

## README Structure for Projects

The README is the entry point for anyone encountering your project. For detailed guidance, see our article on [writing a great GitHub README](/blog/en/github-readme-tips), but here is a summary of the essential sections:

```markdown
# Project Name

One-paragraph description of what the project does.

## Installation

```bash
npm install project-name
```

## Quick Start

```javascript
import { Project } from 'project-name';
const result = Project.doSomething();
```

## API Reference

### `doSomething(options?)`

Brief description and parameters.

## Contributing

Link to CONTRIBUTING.md.

## License

MIT
```

Every project, no matter how small, should have a README. A three-line README is better than no README.

## API Documentation

### Documenting REST APIs

For REST APIs, document each endpoint with:

```markdown
## Create User

`POST /api/v1/users`

Creates a new user account.

### Request Headers

| Header        | Type   | Required | Description       |
|:--------------|:-------|:---------|:------------------|
| Authorization | string | Yes      | Bearer token      |
| Content-Type  | string | Yes      | application/json  |

### Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
```

### Response

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
```

### Auto-Generated API Docs

Tools like Swagger/OpenAPI can generate interactive API documentation from annotations in your code:

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

While auto-generated docs save time, they often lack the context and examples that make documentation truly useful. Combine auto-generation with hand-written guides for the best result.

## Changelog Maintenance

A changelog tracks what changed in each release. It helps users understand what is new, what is fixed, and what might break when they upgrade:

```markdown
# Changelog

All notable changes to this project will be documented
in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added
- Dark mode support for the dashboard

## [2.1.0] - 2025-03-10

### Added
- PDF export with custom headers and footers
- Support for Mermaid diagrams in Markdown

### Fixed
- Table alignment not preserved in PDF output
- Memory leak when processing files larger than 50MB

### Changed
- Default font changed from Helvetica to Inter
- Minimum Node.js version is now 18.0

### Deprecated
- The `--legacy-mode` flag will be removed in v3.0

## [2.0.0] - 2025-01-15

### Breaking Changes
- Configuration file format changed from JSON to YAML
- Removed support for Node.js 16
```

### Changelog Best Practices

- **Update with every pull request**, not just at release time.
- **Group changes** by type: Added, Changed, Deprecated, Removed, Fixed, Security.
- **Write for users**, not developers. "Fixed a bug where exported PDFs had incorrect margins" is more useful than "Fixed margin calculation in PDFRenderer.ts."
- **Link to issues and pull requests** for context.

## Architecture Decision Records (ADRs)

For significant design decisions, write Architecture Decision Records:

```markdown
# ADR-003: Use PostgreSQL Instead of MongoDB

## Status

Accepted

## Context

We need a database for the user management service.
The team has experience with both PostgreSQL and MongoDB.

## Decision

We will use PostgreSQL because:
1. Our data is highly relational (users, roles, permissions)
2. We need ACID transactions for billing operations
3. The team has stronger PostgreSQL experience

## Consequences

- We gain strong consistency and relational query capabilities
- We lose the schema flexibility of MongoDB
- We need to manage database migrations
```

ADRs are documentation gold. Six months later, when someone asks "why did we choose PostgreSQL?", the answer is already written down.

## Tools for Documentation

### Documentation Generators

- **JSDoc / TSDoc**: Generate HTML documentation from JavaScript/TypeScript comments
- **Sphinx**: Python documentation generator
- **Javadoc**: Standard for Java projects
- **Doxygen**: Multi-language documentation generator
- **Typedoc**: TypeScript-specific documentation generator

### Documentation Websites

Write your documentation in Markdown and publish it using tools like MkDocs, Docusaurus, or VitePress. When you need PDF versions of your documentation, tools like printmd can convert your Markdown files to professionally formatted PDFs for distribution to clients or for compliance requirements.

### Linting and Validation

- **markdownlint**: Enforce consistent Markdown style
- **vale**: Prose linter for documentation style
- **alex**: Catch insensitive or inconsiderate writing

## Common Pitfalls

### Writing Too Much

Documentation that nobody reads is wasted effort. A concise paragraph that explains the "why" is more valuable than ten pages that repeat what the code already says.

### Writing Too Little

A single-line comment that says "handles the thing" helps nobody. Find the balance between verbose and cryptic.

### Not Updating Documentation

Outdated documentation is worse than no documentation. It actively misleads readers. Include documentation updates in your code review checklist and CI pipeline.

### Documenting Implementation Details

Document interfaces, contracts, and behavior, not implementation details that may change. "This function returns the user's full name" is stable documentation. "This function concatenates first_name and last_name with a space" is an implementation detail that may not survive the next refactor.

## Conclusion

Good documentation is a skill that improves with practice. Start with the basics: write meaningful function docstrings, keep your README updated, and maintain a changelog. As your project grows, add architecture decision records and comprehensive guides.

The return on investment is clear. Every hour spent on documentation saves many hours of confusion, onboarding, and debugging for your team and your future self. Write the docs you wish you had found when you were learning.
