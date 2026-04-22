import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';
import {
  schemaByName,
  legalSchemaByName,
  type SchemaName,
  type LegalSchemaName,
  type ContentFor,
  type LegalContentFor,
} from '../data/config';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/data');
const DEFAULT_LOCALE = 'ko';

function resolveFile(dir: string, locale: string, file: string): string {
  const primary = path.join(dir, locale, file);
  if (fs.existsSync(primary)) return primary;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = path.join(dir, DEFAULT_LOCALE, file);
    if (fs.existsSync(fallback)) return fallback;
  }
  throw new Error(`Content file missing: ${primary}`);
}

export function loadContent<N extends SchemaName>(
  name: N,
  locale: string = DEFAULT_LOCALE,
): ContentFor<N> {
  const full = resolveFile(CONTENT_ROOT, locale, `${name}.yml`);
  const raw = fs.readFileSync(full, 'utf8');
  const data = yaml.load(raw);
  const schema = schemaByName[name];
  return schema.parse(data) as ContentFor<N>;
}

export interface LegalDoc<N extends LegalSchemaName> {
  frontmatter: LegalContentFor<N>;
  html: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

export function loadLegal<N extends LegalSchemaName>(
  name: N,
  locale: string = DEFAULT_LOCALE,
): LegalDoc<N> {
  const full = resolveFile(CONTENT_ROOT, locale, `${name}.md`);
  const raw = fs.readFileSync(full, 'utf8');
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`Legal doc missing frontmatter: ${full}`);
  }
  const fm = yaml.load(match[1]);
  const schema = legalSchemaByName[name];
  const frontmatter = schema.parse(fm) as LegalContentFor<N>;
  const html = marked.parse(match[2], { async: false, gfm: true }) as string;
  return { frontmatter, html };
}

// "\n" in content strings → <br> in rendered HTML.
// Used by templates for title/body fields where YAML encodes line breaks as \n.
export function renderInlineBreaks(text: string): string {
  return text
    .split('\n')
    .map(escapeHtml)
    .join('<br>');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
