import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const registryPath = resolve(root, 'contracts/j4/endpoints.json');
const markdownPath = resolve(
  root,
  'public/skills/cuenti-mcp/references/endpoints.md',
);
const archivePath = resolve(root, 'public/skills/cuenti-mcp.zip');
const archiveRoot = 'cuenti-mcp/';
const publicFiles = [
  'SKILL.md',
  'references/endpoints.md',
  'references/mcp-guide.md',
  'references/catalogos.md',
];

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const endpointIds = registry.endpoints.map((endpoint) => endpoint.id);
const markdown = readFileSync(markdownPath, 'utf8');
const markdownIds = [...markdown.matchAll(/^### `([^`]+)`:/gm)].map(
  ([, id]) => id,
);

const sameItems = (left, right) =>
  left.length === right.length &&
  left.every((item, index) => item === right[index]);

const duplicateItems = (items) => [
  ...new Set(items.filter((item, index) => items.indexOf(item) !== index)),
];

const sameSet = (left, right) => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    left.length === leftSet.size &&
    right.length === rightSet.size &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((item) => rightSet.has(item))
  );
};

if (!sameSet(endpointIds, markdownIds)) {
  const missing = endpointIds.filter((id) => !markdownIds.includes(id));
  const extra = markdownIds.filter((id) => !endpointIds.includes(id));
  const duplicateRegistryIds = duplicateItems(endpointIds);
  const duplicateMarkdownIds = duplicateItems(markdownIds);
  throw new Error(
    [
      'El catálogo Markdown no coincide con el conjunto de endpoints del registry.',
      missing.length > 0 ? `Faltan: ${missing.join(', ')}.` : '',
      extra.length > 0 ? `Sobran: ${extra.join(', ')}.` : '',
      duplicateRegistryIds.length > 0
        ? `Duplicados en registry: ${duplicateRegistryIds.join(', ')}.`
        : '',
      duplicateMarkdownIds.length > 0
        ? `Duplicados en Markdown: ${duplicateMarkdownIds.join(', ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}

const archiveEntries = execFileSync('unzip', ['-Z1', archivePath], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
const expectedEntries = publicFiles.map((file) => `${archiveRoot}${file}`);

if (!sameItems(expectedEntries, archiveEntries)) {
  throw new Error(
    'El ZIP de la skill no contiene exactamente los artefactos esperados.',
  );
}

for (const file of publicFiles) {
  const source = readFileSync(resolve(root, 'public/skills/cuenti-mcp', file));
  const archived = execFileSync('unzip', [
    '-p',
    archivePath,
    `${archiveRoot}${file}`,
  ]);
  if (!source.equals(archived)) {
    throw new Error(`El ZIP no coincide con public/skills/cuenti-mcp/${file}.`);
  }
}

console.log(
  `Public artifacts verified: ${endpointIds.length} endpoints, ${publicFiles.length} ZIP files.`,
);
