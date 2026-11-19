/**
 * Languages offered in the code block toolbar. Every value is registered with
 * highlight.js in ./hljs.ts. `''` is a fence without a language (plain text).
 */
export const CODE_LANGUAGES: { value: string; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'xml', label: 'XML' },
  { value: 'diff', label: 'Diff' },
];

/** Short or alternate fence names mapped to the value used in the list. */
const ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', shell: 'bash',
  yml: 'yaml', md: 'markdown', rb: 'ruby', kt: 'kotlin', cs: 'csharp',
  'c++': 'cpp', text: '', plaintext: '',
};

/** The list value matching a fence's language, e.g. `ts` → `typescript`. */
export function normalizeCodeLanguage(lang: string): string {
  const lower = lang.toLowerCase();
  return lower in ALIASES ? ALIASES[lower] : lower;
}

const FENCE_RE = /^(\s*)(`{3,}|~{3,})([^\s`~]*)(.*)$/;

/** The language written on a fence opening line, or null if it isn't one. */
export function readFenceLanguage(line: string): string | null {
  const m = line.match(FENCE_RE);
  return m ? m[3] : null;
}

/** Rewrite a fence opening line with a new language, keeping everything else. */
export function setFenceLanguage(line: string, lang: string): string {
  const m = line.match(FENCE_RE);
  if (!m) return line;
  const [, indent, fence, , rest] = m;
  return `${indent}${fence}${lang}${rest}`;
}
