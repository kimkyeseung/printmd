import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogPostCardProps {
  post: BlogPostMeta;
  locale: string;
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  return (
    <article className="group border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
      <Link href={`/${locale}/blog/${post.slug}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </Link>
    </article>
  );
}
