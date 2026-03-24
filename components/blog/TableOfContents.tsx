'use client';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  title?: string;
}

export function TableOfContents({ headings, title = 'Table of Contents' }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="border border-gray-200 rounded-lg p-4 mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
