import { describe, expect, it } from 'vitest';
import { pageStateFromLocation } from './page-state';

const endpointIds = new Set([
  'catalogo-categorias-busquedas',
  'finanzas-cartera-cobrar-busquedas',
]);

describe('page state', () => {
  it('prioritizes catalog and MCP sections over endpoint parameters', () => {
    expect(
      pageStateFromLocation(
        {
          search:
            '?endpoint=finanzas-cartera-cobrar-busquedas&section=catalogos',
        },
        endpointIds,
        'catalogo-categorias-busquedas',
      ),
    ).toEqual({ kind: 'catalog' });
    expect(
      pageStateFromLocation(
        { search: '?endpoint=finanzas-cartera-cobrar-busquedas&section=mcp' },
        endpointIds,
        'catalogo-categorias-busquedas',
      ),
    ).toEqual({ kind: 'mcp' });
  });

  it('accepts known endpoints and falls back for unknown values', () => {
    expect(
      pageStateFromLocation(
        { search: '?endpoint=finanzas-cartera-cobrar-busquedas' },
        endpointIds,
        'buscarCategorias',
      ),
    ).toEqual({ kind: 'endpoint', id: 'finanzas-cartera-cobrar-busquedas' });
    expect(
      pageStateFromLocation(
        { search: '?endpoint=missing' },
        endpointIds,
        'catalogo-categorias-busquedas',
      ),
    ).toEqual({ kind: 'endpoint', id: 'catalogo-categorias-busquedas' });
  });
});
