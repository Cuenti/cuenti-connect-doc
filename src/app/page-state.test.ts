import { describe, expect, it } from 'vitest';
import { pageStateFromLocation } from './page-state';

const endpointIds = new Set(['buscarCategorias', 'buscarCartera']);

describe('page state', () => {
  it('prioritizes catalog and MCP sections over endpoint parameters', () => {
    expect(
      pageStateFromLocation(
        { search: '?endpoint=buscarCartera&section=catalogos' },
        endpointIds,
        'buscarCategorias',
      ),
    ).toEqual({ kind: 'catalog' });
    expect(
      pageStateFromLocation(
        { search: '?endpoint=buscarCartera&section=mcp' },
        endpointIds,
        'buscarCategorias',
      ),
    ).toEqual({ kind: 'mcp' });
  });

  it('accepts known endpoints and falls back for unknown values', () => {
    expect(
      pageStateFromLocation(
        { search: '?endpoint=buscarCartera' },
        endpointIds,
        'buscarCategorias',
      ),
    ).toEqual({ kind: 'endpoint', id: 'buscarCartera' });
    expect(
      pageStateFromLocation(
        { search: '?endpoint=missing' },
        endpointIds,
        'buscarCategorias',
      ),
    ).toEqual({ kind: 'endpoint', id: 'buscarCategorias' });
  });
});
