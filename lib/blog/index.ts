import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { hljs } from '@/lib/markdown/hljs';

const blogMd = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch {
        // fallback
      }
    }
    return `<pre class="hljs"><code>${blogMd.utils.escapeHtml(str)}</code></pre>`;
  },
});

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  readingTime: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: number;
}

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

function formatDate(date: unknown): string {
  if (!date) return '';
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return String(date);
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: formatDate(data.date),
    tags: data.tags || [],
    content: blogMd.render(content),
    readingTime: calculateReadingTime(content),
  };
}

export function getAllPosts(locale: string): BlogPostMeta[] {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => {
      const filePath = path.join(CONTENT_DIR, locale, `${slug}.md`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: formatDate(data.date),
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const idCount = new Map<string, number>();
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '');
    let id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const count = idCount.get(id) || 0;
    idCount.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    headings.push({ id, text, level: parseInt(match[1]) });
  }
  return headings;
}
