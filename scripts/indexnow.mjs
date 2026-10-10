#!/usr/bin/env node
/**
 * Tell IndexNow search engines (Naver, Bing, Yandex, …) about new or changed
 * pages. Google doesn't take part; use Search Console for it.
 *
 *   npm run indexnow -- https://printmd.app/ko/some-page …
 *   npm run indexnow -- --sitemap      # every URL in the live sitemap
 *
 * The key is verified against public/<key>.txt, so deploy before submitting.
 */

const HOST = 'printmd.app';
const KEY = 'cf8150b6682e85983ee2c44d5f66ef8f';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function sitemapUrls() {
  const xml = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urls = args.includes('--sitemap') ? await sitemapUrls() : args;
if (urls.length === 0) {
  console.error('Usage: npm run indexnow -- <url>… | --sitemap');
  process.exit(1);
}
const foreign = urls.filter((url) => new URL(url).host !== HOST);
if (foreign.length) {
  console.error(`Only ${HOST} URLs can be submitted:`, foreign);
  process.exit(1);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted while the key is being verified.
console.log(`IndexNow: HTTP ${response.status} for ${urls.length} URL(s)`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}
