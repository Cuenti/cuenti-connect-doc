import { describe, expect, it } from 'vitest';
import { registry } from './registry';
import { filterEndpoints } from './search';

describe('endpoint search', () => {
  it.each([
    ['platosEliminados', 'platosEliminados'],
    ['POST', 'buscarCategorias'],
    ['id_auditoria', 'platosEliminados'],
    ['cantidad_registros', 'buscarCategorias'],
    ['producto_ampliado', 'buscarTransacciones'],
    ['Categorías e impuestos', 'buscarCategorias'],
  ])('finds %s across route metadata', (query, expectedId) => {
    expect(
      filterEndpoints(registry.endpoints, query).map((endpoint) => endpoint.id),
    ).toContain(expectedId);
  });

  it('requires every search term to match the same endpoint', () => {
    expect(
      filterEndpoints(registry.endpoints, 'POST id_auditoria'),
    ).toHaveLength(1);
    expect(
      filterEndpoints(registry.endpoints, 'GET id_auditoria'),
    ).toHaveLength(0);
  });
});
