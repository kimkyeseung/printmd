import { describe, it, expect } from 'vitest';
import { encodeDocumentToUrl, decodeDocumentFromUrl } from '../documentUrl';

describe('documentUrl', () => {
  describe('encodeDocumentToUrl / decodeDocumentFromUrl', () => {
    it('round-trips simple content', async () => {
      const content = '# Hello World\n\nThis is a test.';
      const encoded = await encodeDocumentToUrl(content);

      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');
      // base64url should not contain +, /, or =
      expect(encoded).not.toMatch(/[+/=]/);

      const decoded = await decodeDocumentFromUrl(encoded);
      expect(decoded).toBe(content);
    });

    it('round-trips unicode content (Korean)', async () => {
      const content = '# 마크다운 테스트\n\n한글 내용입니다.';
      const encoded = await encodeDocumentToUrl(content);
      const decoded = await decodeDocumentFromUrl(encoded);
      expect(decoded).toBe(content);
    });

    it('round-trips markdown with code blocks', async () => {
      const content = '```javascript\nconst x = 1;\nconsole.log(x);\n```';
      const encoded = await encodeDocumentToUrl(content);
      const decoded = await decodeDocumentFromUrl(encoded);
      expect(decoded).toBe(content);
    });

    it('round-trips large content', async () => {
      const content = '# Title\n\n' + 'Lorem ipsum dolor sit amet. '.repeat(100);
      const encoded = await encodeDocumentToUrl(content);
      const decoded = await decodeDocumentFromUrl(encoded);
      expect(decoded).toBe(content);
    });

    it('compressed output is smaller than raw base64', async () => {
      const content = 'repeat '.repeat(500);
      const encoded = await encodeDocumentToUrl(content);
      const rawBase64Length = btoa(content).length;
      // gzip should compress repetitive content significantly
      expect(encoded.length).toBeLessThan(rawBase64Length);
    });

    it('round-trips empty-ish content', async () => {
      const content = ' ';
      const encoded = await encodeDocumentToUrl(content);
      const decoded = await decodeDocumentFromUrl(encoded);
      expect(decoded).toBe(content);
    });
  });
});
