import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const erpRegistryPath = resolve(root, 'contracts/j4/endpoints.json');
const statsRegistryPath = resolve(root, 'contracts/stats/endpoints.json');
const externalToolsPath = resolve(root, 'contracts/mcp/external-tools.json');
const oldSkillPath = resolve(root, 'public/skills/cuenti-mcp');
const oldSkillArchive = resolve(root, 'public/skills/cuenti-mcp.zip');
const externalRegistry = JSON.parse(readFileSync(externalToolsPath, 'utf8'));
const erpRegistry = JSON.parse(readFileSync(erpRegistryPath, 'utf8'));
const statsRegistry = JSON.parse(readFileSync(statsRegistryPath, 'utf8'));

const skills = [
  {
    id: 'cuenti-mcp-erp',
    markdownPath: resolve(
      root,
      'public/skills/cuenti-mcp-erp/references/endpoints.md',
    ),
    archivePath: resolve(root, 'public/skills/cuenti-mcp-erp.zip'),
    publicFiles: [
      'SKILL.md',
      'references/endpoints.md',
      'references/mcp-guide.md',
      'references/catalogos.md',
    ],
    publishedIds: [
      ...(erpRegistry.routes?.length
        ? erpRegistry.routes.map((route) => route.routeId)
        : erpRegistry.endpoints.map((endpoint) => endpoint.id)),
      ...externalRegistry.tools.map((tool) => tool.id),
    ],
  },
  {
    id: 'cuenti-mcp-stats',
    markdownPath: resolve(
      root,
      'public/skills/cuenti-mcp-stats/references/tools.md',
    ),
    archivePath: resolve(root, 'public/skills/cuenti-mcp-stats.zip'),
    publicFiles: ['SKILL.md', 'references/tools.md', 'references/mcp-guide.md'],
    publishedIds: statsRegistry.endpoints
      .filter(
        (endpoint) =>
          endpoint.visibility === 'public' && endpoint.exposedAsTool,
      )
      .map((endpoint) => endpoint.id),
  },
];

const sameItems = (left, right) =>
  left.length === right.length &&
  left.every((item, index) => item === right[index]);

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

if (existsSync(oldSkillPath) || existsSync(oldSkillArchive)) {
  throw new Error('La skill obsoleta cuenti-mcp no debe publicarse.');
}

for (const skill of skills) {
  const markdown = readFileSync(skill.markdownPath, 'utf8');
  const markdownIds = [...markdown.matchAll(/^### `([^`]+)`:/gm)].map(
    ([, id]) => id,
  );
  const unknownMarkdownIds = markdownIds.filter(
    (id) => !skill.publishedIds.includes(id),
  );
  if (
    !sameSet(skill.publishedIds, markdownIds) ||
    unknownMarkdownIds.length > 0
  ) {
    const missing = skill.publishedIds.filter(
      (id) => !markdownIds.includes(id),
    );
    throw new Error(
      `${skill.id}: el catálogo Markdown no coincide; faltan ${missing.join(', ')} y sobran ${unknownMarkdownIds.join(', ')}.`,
    );
  }

  const archiveRoot = `${skill.id}/`;
  const archiveEntries = execFileSync('unzip', ['-Z1', skill.archivePath], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean);
  const expectedEntries = skill.publicFiles.map(
    (file) => `${archiveRoot}${file}`,
  );
  if (!sameItems(expectedEntries, archiveEntries)) {
    throw new Error(
      `${skill.id}: el ZIP no contiene exactamente sus artefactos.`,
    );
  }
  for (const file of skill.publicFiles) {
    const source = readFileSync(resolve(root, 'public/skills', skill.id, file));
    const archived = execFileSync('unzip', [
      '-p',
      skill.archivePath,
      `${archiveRoot}${file}`,
    ]);
    if (!source.equals(archived)) {
      throw new Error(`${skill.id}: el ZIP no coincide con ${file}.`);
    }
  }
}

console.log(
  `Public artifacts verified: ${skills.map((skill) => `${skill.id} (${skill.publishedIds.length} tools)`).join(', ')}.`,
);
