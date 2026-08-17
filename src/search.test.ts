import { describe, expect, it } from 'vitest';
import { registry } from './registry';
import { filterEndpoints } from './search';

describe('endpoint search', () => {
  it.each([
    ['platos-eliminados', 'restaurante-platos-eliminados-busquedas'],
    ['POST', 'catalogo-categorias-busquedas'],
    ['id_auditoria', 'restaurante-platos-eliminados-busquedas'],
    ['cantidad_registros', 'catalogo-categorias-busquedas'],
    ['producto_ampliado', 'ventas-facturas-busquedas'],
    ['Categorías e impuestos', 'catalogo-categorias-busquedas'],
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
