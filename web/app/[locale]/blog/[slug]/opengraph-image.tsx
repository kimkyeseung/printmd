import { ImageResponse } from 'next/og';
import { getPostBySlug, getPostSlugs } from '@/lib/blog/index';
import { locales } from '@/lib/i18n/config';

export const runtime = 'edge';
export const alt = 'printmd Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getPostSlugs(locale)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  const title = post?.title ?? slug;
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            📄
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            printmd Blog
          </span>
        </div>
        <h1
          style={{
            fontSize: title.length > 40 ? '48px' : '56px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            lineHeight: 1.2,
            maxWidth: '1000px',
          }}
        >
          {title}
        </h1>
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.15)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
