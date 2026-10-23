import { describe, expect, it } from 'vitest';
import { registry } from './registry';
import { projectResponseExample } from './responseProjection';

const endpointFor = (contractId: string) => {
  const endpoint = registry.endpoints.find(
    (candidate) => candidate.contractId === contractId,
  );
  if (!endpoint) throw new Error(`Missing endpoint ${contractId}`);
  return endpoint;
};

describe('projectResponseExample', () => {
  it('removes and restores selected header groups', () => {
    const endpoint = endpointFor('buscarProductosCatalogo');

    const withoutProduct = projectResponseExample(endpoint, {
      grupos: ['inventario'],
    }) as { productos: Array<Record<string, unknown>> };
    expect(withoutProduct.productos[0]).toEqual({
      inventario: {
        existencias: 10,
        stock_minimo: 2,
        vende_sin_existencia: 0,
        maneja_lote: 0,
        maneja_seriales: 0,
      },
    });

    const withProduct = projectResponseExample(endpoint, {
      grupos: ['producto', 'inventario'],
    }) as { productos: Array<Record<string, unknown>> };
    expect(withProduct.productos[0]).toHaveProperty('producto');
    expect(withProduct.productos[0]).toHaveProperty('inventario');
  });

  it('shows every authorized product group when all groups are requested', () => {
    const endpoint = endpointFor('buscarProductosCatalogo');
    const response = projectResponseExample(
      endpoint,
      endpoint.requestExample,
    ) as {
      productos: Array<Record<string, unknown>>;
    };

    expect(Object.keys(response.productos[0])).toEqual([
      'producto',
      'sucursal',
      'precios',
      'inventario',
      'categoria',
      'marca',
      'impuestos',
      'medida',
      'imagen',
      'configuracion',
      'composicion',
      'empaque',
      'presentaciones',
      'proveedor',
    ]);
  });

  it('keeps the completed canonical examples visible for their selected groups', () => {
    const expectations: Array<[string, string, string[]]> = [
      [
        'buscarCartera',
        'cartera',
        [
          'transaccion',
          'fechas',
          'sucursal',
          'tercero',
          'vendedor',
          'saldo',
          'estado',
        ],
      ],
      [
        'obtenerComandas',
        'comandas',
        [
          'codigos',
          'sucursal',
          'mesa',
          'producto',
          'empleado',
          'fecha',
          'estado',
          'preparacion',
          'pedido',
          'impresion',
        ],
      ],
      [
        'platosEliminados',
        'platos_eliminados',
        [
          'codigos',
          'fecha',
          'sucursal',
          'empleado',
          'producto',
          'mesa',
          'eliminacion',
        ],
      ],
      [
        'buscarProductosDocumentosComerciales',
        'productos',
        ['producto', 'cantidades', 'totales', 'costos', 'fechas'],
      ],
    ];

    for (const [endpointId, collection, groups] of expectations) {
      const endpoint = endpointFor(endpointId);
      const response = projectResponseExample(
        endpoint,
        endpoint.requestExample,
      ) as Record<string, Array<Record<string, unknown>>>;
      expect(Object.keys(response[collection][0]).sort(), endpointId).toEqual(
        [...groups].sort(),
      );
    }
  });

  it('includes every selected detail group in transaction examples', () => {
    for (const endpointId of [
      'buscarTransacciones',
      'buscarDocumentosComerciales',
      'buscarDescuentos',
      'buscarDescuentosDocumentosComerciales',
    ]) {
      const endpoint = endpointFor(endpointId);
      const response = projectResponseExample(
        endpoint,
        endpoint.requestExample,
      ) as Record<string, unknown>;
      const collection = Object.values(response).find(Array.isArray) as Array<{
        detalle?: Array<Record<string, unknown>>;
      }>;
      const item = collection[0];
      const detail = item.detalle?.[0] ?? item;
      expect(Object.keys(detail), endpointId).toEqual(
        expect.arrayContaining([
          'producto',
          'cantidades',
          'precios',
          'descuento',
          'totales',
        ]),
      );
    }
  });

  it('projects detail groups independently', () => {
    const endpoint = {
      ...endpointFor('buscarDocumentosComerciales'),
      responseExample: {
        pagina: 0,
        documentos: [
          {
            codigos: { id_documento: 1 },
            detalle: [
              {
                producto: {
                  id_producto: 25,
                  nombre: 'Producto',
                  sku: 'SKU-25',
                },
              },
            ],
          },
        ],
      },
    };
    const response = projectResponseExample(endpoint, {
      grupos: ['codigos'],
      detalle: ['producto'],
    }) as { documentos: Array<Record<string, unknown>> };

    expect(response.documentos[0]).toHaveProperty('detalle');
    expect(response.documentos[0]).toHaveProperty('codigos');
    expect(response.documentos[0]).toHaveProperty('detalle');
    expect(response.documentos[0].detalle).toEqual([
      { producto: { id_producto: 25, nombre: 'Producto', sku: 'SKU-25' } },
    ]);
  });

  it('projects embedded header lists using the requested archivos alias', () => {
    const endpoint = endpointFor('buscarTransacciones');
    const response = projectResponseExample(endpoint, {
      grupos: ['archivos'],
    }) as { transacciones: Array<Record<string, unknown>> };

    expect(response.transacciones[0]).toHaveProperty('archivos');
    expect(response.transacciones[0]).not.toHaveProperty('adjuntos');
    expect(response.transacciones[0]).not.toHaveProperty('comentarios');
    expect(response.transacciones[0].archivos).toEqual([
      {
        id_adjunto: 1,
        nombre_real: 'factura-ejemplo.pdf',
        tipo: 'application/pdf',
        etiqueta: 'Documento',
        ruta: 'https://example.invalid/archivos/factura-ejemplo.pdf',
        fecha_registro: 1735689600000,
      },
    ]);
  });

  it('prefers adjuntos when both attachment aliases are requested', () => {
    const endpoint = endpointFor('buscarTransacciones');
    const response = projectResponseExample(endpoint, {
      grupos: ['archivos', 'adjuntos'],
    }) as { transacciones: Array<Record<string, unknown>> };

    expect(response.transacciones[0]).toHaveProperty('adjuntos');
    expect(response.transacciones[0]).not.toHaveProperty('archivos');
  });

  it('projects fields inside selected embedded lists', () => {
    const endpoint = {
      ...endpointFor('buscarDocumentosComerciales'),
      groups: [
        {
          name: 'comentarios' as const,
          fields: [],
          itemFields: ['id_comentario'],
          type: 'array' as const,
        },
      ],
      responseExample: {
        documentos: [
          {
            comentarios: [
              { id_comentario: 1, comentario: 'Visible', fecha_registro: 2 },
            ],
          },
        ],
      },
    };

    const response = projectResponseExample(endpoint, {
      grupos: ['comentarios'],
    }) as { documentos: Array<Record<string, unknown>> };
    expect(response.documentos[0].comentarios).toEqual([{ id_comentario: 1 }]);
  });
});
