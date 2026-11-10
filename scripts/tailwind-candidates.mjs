import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { compile } from '@tailwindcss/node';

// Explicit candidates keep Tailwind output identical on native and WASM scanners.
const candidates = new Set();
function visitDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { visitDirectory(path); continue; }
    if (!/\.[jt]sx?$/.test(entry.name)) continue;
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
          ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
        for (const token of node.text.split(/\s+/)) {
          if (token && /^[!a-zA-Z0-9\[\]#().,%:/_\->=+*]+$/.test(token)) candidates.add(token);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
visitDirectory('src');
const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
  base: join(process.cwd(), 'src'),
  onDependency() {},
});
writeFileSync('src/generated.css', compiler.build([...candidates]));
console.log(`Registered ${candidates.size} source candidates.`);
