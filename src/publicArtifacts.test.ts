import { execFileSync, spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const scratch: string[] = [];
afterEach(() => {
  for (const path of scratch.splice(0)) rmSync(path, { recursive: true });
});

const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'portal-artifacts-'));
  scratch.push(root);
  const write = (path: string, value: string) => {
    const target = join(root, path);
    mkdirSync(resolve(target, '..'), { recursive: true });
    writeFileSync(target, value);
  };
  const registry = {
    headerDefinitions: {},
    endpoints: [
      {
        id: 'public-contract',
        title: 'Public',
        category: 'Organización',
        method: 'GET',
        operation: 'query',
        requiredHeaders: [],
        params: { path: [], query: [] },
        body: { type: 'none' },
        response: { shape: 'object', example: { value: 1 } },
      },
      { id: 'private-contract' },
    ],
    routes: [
      {
        routeId: 'public-route',
        contract: 'public-contract',
        title: 'Public',
        category: 'Organización',
        method: 'GET',
        path: '/api/v1/public',
        translation: {},
      },
    ],
  };
  write('contracts/j4/endpoints.json', JSON.stringify(registry));
  write(
    'contracts/mcp/external-tools.json',
    JSON.stringify({
      tools: [
        {
          id: 'external-tool',
          title: 'External',
          category: 'Restaurante',
          method: 'POST',
          path: '/api/v1/external',
          operation: 'mutation',
          requiredHeaders: [],
          body: { type: 'object', example: {} },
          response: { shape: 'object', example: {} },
        },
      ],
    }),
  );
  write(
    'contracts/stats/endpoints.json',
    '{"endpoints":[{"id":"stats-tool","visibility":"public","exposedAsTool":true}]}',
  );
  write('tools/verify-public-artifacts.mjs', '');
  write('src/registry/publicContract.mjs', '');
  copyFileSync(
    resolve('src/registry/publicContract.mjs'),
    join(root, 'src/registry/publicContract.mjs'),
  );
  copyFileSync(
    resolve('tools/verify-public-artifacts.mjs'),
    join(root, 'tools/verify-public-artifacts.mjs'),
  );
  copyFileSync(
    resolve('tools/generate-erp-reference.mjs'),
    join(root, 'tools/generate-erp-reference.mjs'),
  );
  for (const [id, reference, tools] of [
    ['cuenti-mcp-erp', 'endpoints.md', ['public-route', 'external-tool']],
    ['cuenti-mcp-stats', 'tools.md', ['stats-tool']],
  ] as const) {
    const files = [
      'SKILL.md',
      `references/${reference}`,
      'references/mcp-guide.md',
    ];
    if (id === 'cuenti-mcp-erp') files.push('references/catalogos.md');
    for (const file of files) {
      write(
        `public/skills/${id}/${file}`,
        file.endsWith(reference)
          ? tools.map((name) => `### \`${name}\`: Tool\n`).join('\n')
          : '# Public reference\n',
      );
    }
    execFileSync(
      'zip',
      ['-q', `${id}.zip`, ...files.map((file) => `${id}/${file}`)],
      {
        cwd: join(root, 'public/skills'),
      },
    );
  }
  execFileSync(process.execPath, ['tools/generate-erp-reference.mjs'], {
    cwd: root,
  });
  const run = (...args: string[]) =>
    spawnSync(
      process.execPath,
      ['tools/verify-public-artifacts.mjs', ...args],
      {
        cwd: root,
        encoding: 'utf8',
      },
    );
  return { root, registry, write, run };
};

describe('public artifact verification CLI', () => {
  it('keeps local Markdown, public-only IDs and ordered ZIP checks without a source option', () => {
    const { run } = fixture();
    const result = run();
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('cuenti-mcp-erp (2 tools)');
    expect(result.stdout).toContain('cuenti-mcp-stats (1 tools)');
  });

  it('accepts a content-equivalent explicitly supplied canonical registry', () => {
    const { root, registry, write, run } = fixture();
    write('canonical.json', JSON.stringify(registry, null, 2));
    const result = run('--source-registry', join(root, 'canonical.json'));
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('Canonical registry verified');
  });

  it('rejects content drift even when the route count has not changed', () => {
    const { root, registry, write, run } = fixture();
    write('canonical.json', JSON.stringify({ ...registry, schemaVersion: 99 }));
    const result = run('--source-registry', join(root, 'canonical.json'));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('no coincide con la fuente canónica');
  });

  it('rejects outdated request/response documentation even when IDs are unchanged', () => {
    const { write, run } = fixture();
    write(
      'public/skills/cuenti-mcp-erp/references/endpoints.md',
      '### `public-route`: Outdated\n\n### `external-tool`: Outdated\n',
    );
    expect(run().stderr).toContain('La referencia ERP difiere del registro');
  });

  it('rejects missing values and unknown explicit options', () => {
    const { run } = fixture();
    expect(run('--source-registry').status).not.toBe(0);
    expect(run('--source-typo', 'canonical.json').status).not.toBe(0);
  });
});
