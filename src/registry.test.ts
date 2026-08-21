import { describe, expect, it } from 'vitest';
import { hasFieldDescription, hasGroupDescription } from './fieldDescriptions';
import { categories, upcomingCapabilities } from './model';
import { registry } from './registry';

const findEndpoint = (id: string) =>
  registry.endpoints.find(
    (endpoint) =>
      endpoint.id === id ||
      (endpoint as { contractId?: string }).contractId === id,
  );

describe('canonical documentation registry', () => {
  it('exposes all 40 approved public method/path tuples', () => {
    const tuples = registry.endpoints.map(
      (endpoint) => `${endpoint.method} ${endpoint.path}`,
    );
    expect(new Set(tuples)).toEqual(
      new Set([
        'POST /api/v1/transacciones/ventas/facturas/busquedas',
        'POST /api/v1/transacciones/ventas/planes-separe/busquedas',
        'POST /api/v1/transacciones/ventas/otros-ingresos/busquedas',
        'POST /api/v1/transacciones/ventas/compras-gastos/busquedas',
        'POST /api/v1/transacciones/ventas/remisiones/busquedas',
        'POST /api/v1/transacciones/ventas/facturas',
        'POST /api/v1/transacciones/ventas/compras-gastos',
        'POST /api/v1/transacciones/ventas/remisiones',
        'POST /api/v1/transacciones/ventas/productos-comprados/busquedas',
        'POST /api/v1/transacciones/ventas/descuentos/busquedas',
        'POST /api/v1/transacciones/ventas/consolidados/busquedas',
        'POST /api/v1/transacciones/operativas/pedidos/busquedas',
        'POST /api/v1/transacciones/operativas/cotizaciones/busquedas',
        'POST /api/v1/transacciones/operativas/despachos/busquedas',
        'POST /api/v1/transacciones/operativas/productos/busquedas',
        'POST /api/v1/transacciones/operativas/descuentos/busquedas',
        'POST /api/v1/transacciones/operativas/consolidados/busquedas',
        'POST /api/v1/catalogo/productos/busquedas',
        'POST /api/v1/catalogo/categorias/busquedas',
        'PATCH /api/v1/catalogo/productos/impuestos-licores',
        'GET /api/v1/catalogo/marcas',
        'GET /api/v1/catalogo/marcas/{id_marca}',
        'POST /api/v1/inventario/conteos',
        'POST /api/v1/terceros/busquedas',
        'POST /api/v1/terceros',
        'PUT /api/v1/terceros/{id_tercero}',
        'POST /api/v1/tributario/impuestos/busquedas',
        'GET /api/v1/tributario/impuestos/{id_impuesto}',
        'POST /api/v1/finanzas/bancos/busquedas',
        'POST /api/v1/finanzas/medios-pago/busquedas',
        'POST /api/v1/finanzas/cartera/cuentas-por-cobrar/busquedas',
        'POST /api/v1/finanzas/cartera/cuentas-por-pagar/busquedas',
        'POST /api/v1/finanzas/cartera/cuentas-por-cobrar/resumenes-por-tercero/busquedas',
        'POST /api/v1/finanzas/cartera/cuentas-por-pagar/resumenes-por-tercero/busquedas',
        'POST /api/v1/organizacion/sucursales/busquedas',
        'POST /api/v1/organizacion/empleados/busquedas',
        'POST /api/v1/facturacion/consecutivos/busquedas',
        'POST /api/v1/restaurante/comandas/busquedas',
        'POST /api/v1/restaurante/comandas/platos-eliminados/busquedas',
        'POST /api/v1/restaurante/comandas',
      ]),
    );
    expect(tuples).toHaveLength(40);
    expect(tuples.every((tuple) => tuple.includes('/api/v1/'))).toBe(true);
    expect(JSON.stringify(registry)).not.toContain('/jServerj4ErpPro');
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.category)),
    ).toEqual(new Set(categories));
  });

  it('keeps the public query and mutation split', () => {
    expect(registry.endpoints).toHaveLength(40);
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.category)),
    ).toEqual(new Set(categories));
    expect(
      registry.endpoints.filter(
        (endpoint) => endpoint.cache.mode === 'cacheable',
      ),
    ).toHaveLength(32);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.kind === 'mutation'),
    ).toHaveLength(8);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.cache.mode === 'bypass'),
    ).toHaveLength(8);
  });

  it('keeps the flat public service distribution', () => {
    const counts = Object.fromEntries(
      categories.map((category) => [
        category,
        registry.endpoints.filter((endpoint) => endpoint.category === category)
          .length,
      ]),
    );
    expect(counts).toEqual({
      Catálogo: 5,
      Inventario: 1,
      Terceros: 3,
      Transacciones: 11,
      'Otros documentos': 6,
      Impuestos: 2,
      'Finanzas y cartera': 6,
      Organización: 2,
      Facturación: 1,
      Restaurante: 3,
    });
  });

  it('provides public examples and response contracts for every route', () => {
    for (const endpoint of registry.endpoints) {
      expect(endpoint.path).toMatch(/^\/api\/v1\//);
      expect(endpoint.responseExample).toBeDefined();
      expect(endpoint.summary).not.toContain('como parte de una integración');
      if (endpoint.bodyRequired) expect(endpoint.requestExample).toBeDefined();
    }
  });

  it('projects public request surfaces without upstream paths or fixed selectors', () => {
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.method)),
    ).toEqual(new Set(['GET', 'POST', 'PATCH', 'PUT']));
    expect(
      registry.endpoints
        .map(({ pathParams, queryParams, bodyFields, presets, tryIt }) =>
          JSON.stringify({
            pathParams,
            queryParams,
            bodyFields,
            presets,
            tryIt,
          }),
        )
        .join('\n'),
    ).not.toMatch(/jServerj4ErpPro/);
    expect(
      registry.endpoints
        .find((endpoint) => endpoint.id === 'ventas-facturas-busquedas')
        ?.queryParams.map(({ name }) => name),
    ).not.toContain('tipo_documento');
    expect(
      registry.endpoints
        .find((endpoint) => endpoint.id === 'catalogo-marcas')
        ?.queryParams.map(({ name }) => name),
    ).not.toContain('es_activo');
    expect(
      registry.endpoints
        .find((endpoint) => endpoint.id === 'terceros-crear')
        ?.bodyFields.map(({ name }) => name),
    ).not.toContain('id_cliente');
    expect(
      registry.endpoints.find((endpoint) => endpoint.id === 'terceros-crear')
        ?.queryParams,
    ).toEqual([]);
  });

  it('uses route-specific names for shared contracts', () => {
    const expectedTitles = {
      'ventas-facturas-busquedas': 'Buscar facturas',
      'ventas-planes-separe-busquedas': 'Buscar plan separe',
      'ventas-compras-gastos-busquedas': 'Buscar compra/gasto',
      'ventas-facturas': 'Crear factura',
      'ventas-compras-gastos': 'Crear compra/gasto',
      'operativas-pedidos-busquedas': 'Buscar pedidos',
      'operativas-cotizaciones-busquedas': 'Buscar cotizaciones',
      'finanzas-cartera-cobrar-busquedas': 'Buscar cuentas por cobrar',
      'finanzas-cartera-pagar-busquedas': 'Buscar cuentas por pagar',
    };

    for (const [id, title] of Object.entries(expectedTitles)) {
      expect(findEndpoint(id)?.name).toBe(title);
    }

    const sharedContractTitles = registry.endpoints
      .filter((endpoint) =>
        [
          'buscarTransacciones',
          'buscarDocumentosComerciales',
          'grabarDocumentoSimple',
          'guardarTercero',
          'buscarCartera',
          'buscarResumenTerceros',
        ].includes(endpoint.contractId ?? ''),
      )
      .map((endpoint) => endpoint.name);
    expect(new Set(sharedContractTitles).size).toBe(
      sharedContractTitles.length,
    );
    expect(
      sharedContractTitles.every((title) => !title.endsWith('(busquedas)')),
    ).toBe(true);
  });

  it('describes every projected group and field', () => {
    for (const endpoint of registry.endpoints) {
      expect(new Set(endpoint.groups.map(({ name }) => name)).size).toBe(
        endpoint.groups.length,
      );
      for (const group of endpoint.groups) {
        expect(group.name).not.toBe('grupos');
        expect(hasGroupDescription(group.name), group.name).toBe(true);
        expect(group.description).toBeTruthy();
      }
      for (const column of endpoint.columns) {
        expect(
          hasFieldDescription(endpoint.contractId ?? endpoint.id, column),
          `${endpoint.id}.${column}`,
        ).toBe(true);
      }
    }
  });

  it('exposes typed fields for JSON bodies, including nested creation fields', () => {
    const movement = findEndpoint('grabarMovimientoArr');
    expect(movement?.bodyType).toBe('array');
    expect(movement?.bodyFields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'id_concepto',
          type: 'integer',
          typeLabel: 'entero',
          defaultValue: '-1',
        }),
        expect.objectContaining({
          name: 'fecha_registro',
          type: 'epoch-milliseconds',
          typeLabel: 'milisegundos desde epoch',
        }),
        expect.objectContaining({
          name: 'id_empleado',
          type: 'integer',
          required: true,
          minimum: 1,
        }),
      ]),
    );

    const document = findEndpoint('grabarDocumentoSimple');
    const details = document?.bodyFields.find(
      (field) => field.name === 'objDetalle',
    );
    const detailTotal = details?.itemFields?.find(
      (field) => field.name === 'total',
    );
    const client = document?.bodyFields.find(
      (field) => field.name === 'objClienteMini',
    );

    expect(document?.bodyType).toBe('object');
    expect(details?.typeLabel).toBe('arreglo');
    expect(details?.minimumItems).toBe(1);
    expect(detailTotal).toEqual(
      expect.objectContaining({ name: 'total', type: 'number' }),
    );
    expect(client?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'id_cliente', type: 'integer' }),
        expect.objectContaining({ name: 'email1', type: 'string' }),
      ]),
    );
  });

  it('documents the restaurant command business payload and API defaults', () => {
    const command = findEndpoint('restaurante-comandas-crear');
    const items = command?.bodyFields.find((field) => field.name === 'items');
    const itemFields = new Map(
      items?.itemFields?.map((field) => [field.name, field]) ?? [],
    );

    expect(command?.bodyDescription).toContain('datos de negocio');
    expect(items?.required).toBe(true);
    expect(itemFields.get('sync_uuid')).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(itemFields.get('gui_pedido')).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(itemFields.get('numero_mesa')).toEqual(
      expect.objectContaining({ required: true, nullable: true }),
    );
    expect(itemFields.get('estado')).toBeUndefined();
    expect(itemFields.get('fecha_registro')).toBeUndefined();
    expect(command?.tryIt?.body).toEqual({
      items: [
        {
          sync_uuid: '6a5e5f6a-1d5c-4f43-bf55-0c8f94c00b01',
          gui_pedido: 'e4c6a3e8-7d8b-4c2e-8c3b-3e0b5a7c6d11',
          numero_mesa: 10,
          id_producto: 'burger-1',
          nombre: 'Hamburguesa',
          precio: 25000,
          cantidad: 1,
          nota: 'Sin cebolla',
        },
      ],
    });
    expect(command?.notes.join(' ')).toContain('autocompleta');
  });

  it('documents guardarTercero required creation fields and transport types', () => {
    const thirdParty = findEndpoint('guardarTercero');
    const fields = new Map(
      thirdParty?.bodyFields.map((field) => [field.name, field]) ?? [],
    );

    expect(fields.get('id_tipo_persona')).toEqual(
      expect.objectContaining({
        name: 'id_tipo_persona',
        required: true,
      }),
    );
    for (const fieldName of [
      'nombre_cliente',
      'identificacion',
      'telefonos',
      'correos',
    ]) {
      expect(fields.get(fieldName)).toEqual(
        expect.objectContaining({ required: true }),
      );
    }
    expect(fields.get('es_consumidor_final')).toBeDefined();
    expect(fields.get('fecha_nacimiento')).toBeDefined();
    expect(fields.get('horario')).toBeDefined();
    expect(fields.get('lstContactoCliente')).toBeUndefined();
  });

  it('keeps customer-facing metadata free of internal implementation terms', () => {
    const texts = registry.endpoints.flatMap((endpoint) => [
      endpoint.summary,
      endpoint.bodyDescription ?? '',
      ...endpoint.notes,
      ...endpoint.errors.map((error) => error.description),
      ...endpoint.groups.map((group) => group.description ?? ''),
      ...endpoint.bodyFields.flatMap((field) => fieldDescriptions(field)),
    ]);

    expect(texts.join(' ')).not.toMatch(/legacy|servidor|backend/i);
  });

  it('shows the canonical labels for transaction document types', () => {
    for (const endpoint of registry.endpoints) {
      const parameter = endpoint.queryParams.find(
        ({ name }) => name === 'tipo_documento',
      );
      if (!parameter) continue;
      expect(parameter.type).toBe('integer-list');
      expect(parameter.allowedValues).toBeUndefined();
    }
  });

  it('adds the five required global headers to every endpoint', () => {
    for (const endpoint of registry.endpoints) {
      const requiredHeaders = endpoint.headers
        .filter((header) => header.required)
        .map((header) => header.name);
      expect(requiredHeaders).toEqual(
        expect.arrayContaining([
          'X-Auth-Token-empresa',
          'X-Auth-Token-sucursal',
          'X-Id-Empleado',
          'X-gtm',
          'Authorization',
        ]),
      );
      expect(
        endpoint.headers.find((header) => header.name === 'X-gtm')
          ?.defaultValue,
      ).toBe('GMT-0500');
    }
  });

  it('does not expose retired contracts or invalid deleted-dish fields', () => {
    const renderedRegistry = JSON.stringify(registry.endpoints);
    const retiredKitchenWrite = ['grabar', 'Mesas'].join('');
    const retiredTaxFlag = ['es_impuesto', 'saludable'].join('_');
    expect(renderedRegistry).not.toContain(retiredKitchenWrite);
    expect(renderedRegistry).not.toContain(retiredTaxFlag);

    const deletedDishes = findEndpoint('platosEliminados');
    expect(JSON.stringify(deletedDishes)).not.toContain(
      ['id', 'transacion'].join('_'),
    );
  });

  it('keeps future capabilities contract-free', () => {
    expect(upcomingCapabilities).toHaveLength(5);
    for (const capability of upcomingCapabilities) {
      expect(capability).not.toHaveProperty('method');
      expect(capability).not.toHaveProperty('path');
      expect(capability).not.toHaveProperty('curl');
    }
  });

  it('documents projection by groups without exposing the legacy level filter', () => {
    const transactions = findEndpoint('buscarTransacciones');
    const discounts = findEndpoint('buscarDescuentos');
    const documents = findEndpoint('buscarDocumentosComerciales');

    expect(
      transactions?.queryParams.map((parameter) => parameter.name),
    ).not.toContain('nivel');
    expect(transactions?.tryIt?.body).toHaveProperty('detalle');
    expect(transactions?.groups.map((group) => group.name)).toContain(
      'producto',
    );

    expect(documents?.tryIt?.body).toHaveProperty('detalle');
    expect(documents?.groups.map((group) => group.name)).toContain('producto');

    expect(
      discounts?.queryParams.map((parameter) => parameter.name),
    ).not.toContain('nivel');
    expect(discounts?.tryIt?.body).toEqual({
      grupos: ['transaccion', 'cliente', 'totales'],
    });

    const commercialDiscounts = findEndpoint(
      'buscarDescuentosDocumentosComerciales',
    );
    expect(commercialDiscounts?.tryIt?.body).toEqual({
      grupos: ['documento', 'cliente', 'empleado', 'vendedor', 'totales'],
    });
    expect(commercialDiscounts?.groups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'empleado', level: 'header' }),
        expect.objectContaining({ name: 'producto', level: 'detail' }),
        expect.objectContaining({ name: 'documento', level: 'both' }),
      ]),
    );
  });

  it('documents embedded header lists and the archivos alias', () => {
    for (const endpointId of [
      'buscarTransacciones',
      'buscarDocumentosComerciales',
    ]) {
      const endpoint = findEndpoint(endpointId);
      const comments = endpoint?.groups.find(
        (group) => group.name === 'comentarios',
      );
      const attachments = endpoint?.groups.find(
        (group) => group.name === 'adjuntos',
      );
      expect(comments).toEqual(
        expect.objectContaining({
          name: 'comentarios',
          level: 'header',
          type: 'array',
        }),
      );
      expect(attachments).toEqual(
        expect.objectContaining({
          name: 'adjuntos',
          level: 'header',
          type: 'array',
          aliases: ['archivos'],
        }),
      );
      expect(endpoint?.groups.map((group) => group.name)).not.toContain(
        'archivos',
      );
      expect(endpoint?.tryIt?.body).not.toHaveProperty(
        'grupos',
        expect.arrayContaining(['comentarios', 'adjuntos', 'archivos']),
      );

      const completeById = endpoint?.presets.find(
        (preset) => preset.id === 'full-by-id',
      );
      expect(completeById?.body).toEqual(
        expect.objectContaining({
          grupos: expect.arrayContaining(['comentarios', 'adjuntos']),
        }),
      );
      const commentsAndFiles = endpoint?.presets.find(
        (preset) => preset.id === 'with-comments-and-files',
      );
      expect(commentsAndFiles?.body).toEqual({
        grupos: ['codigos', 'comentarios', 'archivos'],
      });
      const collection = endpoint?.responseExample as
        | {
            transacciones?: Array<Record<string, unknown>>;
            documentos?: Array<Record<string, unknown>>;
          }
        | undefined;
      const first =
        collection?.transacciones?.[0] ?? collection?.documentos?.[0];
      expect(first?.comentarios).toEqual(expect.any(Array));
      expect(first?.adjuntos).toEqual(expect.any(Array));
      expect(first).not.toHaveProperty('archivos');
    }

    const publicInvoiceRoute = findEndpoint('ventas-facturas-busquedas');
    expect(publicInvoiceRoute?.responseExample).toMatchObject({
      transacciones: [
        { comentarios: expect.any(Array), adjuntos: expect.any(Array) },
      ],
    });
  });

  it('hides route-owned selectors and keeps public request examples valid', () => {
    const routeSelectors = new Map([
      ['catalogo-marcas', ['es_activo']],
      ['terceros-busquedas', []],
      ['finanzas-cartera-cobrar-busquedas', ['es_ingreso']],
      ['finanzas-cartera-pagar-busquedas', ['es_ingreso']],
      ['finanzas-resumen-cobrar-busquedas', ['es_ingreso']],
      ['finanzas-resumen-pagar-busquedas', ['es_ingreso']],
      ['operativas-pedidos-busquedas', ['tipo_documento']],
      ['operativas-cotizaciones-busquedas', ['tipo_documento']],
      ['operativas-despachos-busquedas', ['tipo_documento']],
    ]);

    for (const [routeId, fixedSelectors] of routeSelectors) {
      const endpoint = findEndpoint(routeId);
      if (!endpoint) throw new Error(`Missing endpoint ${routeId}`);
      const forbiddenPattern = fixedSelectors.length
        ? new RegExp(fixedSelectors.join('|'))
        : null;
      for (const selector of fixedSelectors) {
        expect(
          endpoint.queryParams.map((parameter) => parameter.name),
          `${routeId} query`,
        ).not.toContain(selector);
        expect(
          endpoint.pathParams.map((parameter) => parameter.name),
          `${routeId} path`,
        ).not.toContain(selector);
      }
      if (forbiddenPattern) {
        expect(JSON.stringify(endpoint.tryIt)).not.toMatch(forbiddenPattern);
        expect(
          endpoint.presets.some((preset) =>
            forbiddenPattern.test(JSON.stringify(preset)),
          ),
        ).toBe(false);
      }
    }

    const thirdParties = findEndpoint('terceros-busquedas');
    expect(thirdParties?.tryIt?.body).toEqual({
      grupos: [
        'tercero',
        'contacto',
        'sucursal',
        'cartera_cliente',
        'tributaria',
        'configuracion',
      ],
    });
  });

  it('documents the four recently updated query contracts', () => {
    const products = findEndpoint('buscarProductosCatalogo');
    expect(products?.queryParams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'id_producto', required: false }),
        expect.objectContaining({ name: 'sku', required: false }),
      ]),
    );
    expect(products?.tryIt?.query).toMatchObject({
      cantidad_registros: '30',
      es_activo: '1',
    });
    expect(products?.tryIt?.body).toEqual({
      grupos: [
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
      ],
    });

    for (const endpointId of [
      'buscarDocumentosComerciales',
      'buscarProductosDocumentosComerciales',
      'buscarDescuentosDocumentosComerciales',
      'buscarConsolidadoDocumentosComerciales',
    ]) {
      expect(findEndpoint(endpointId)).toEqual(
        expect.objectContaining({
          contractId: endpointId,
          kind: 'query',
          cache: expect.objectContaining({ mode: 'cacheable', ttl: '60 s' }),
        }),
      );
    }

    const banks = findEndpoint('buscarBancos');
    expect(banks?.columns).toEqual([]);
    expect(banks?.summary).toContain('Consulta las cuentas bancarias');
    expect(banks?.responseExample).toMatchObject({
      bancos: [
        {
          banco: { id_banco: 1 },
          sucursal: { id_sucursal: 1 },
          contabilidad: { id_plan_cuenta: 1 },
          configuracion: { config: '{}' },
        },
      ],
    });

    const categories = findEndpoint('buscarCategorias');
    expect(categories?.columns).toEqual([]);
    expect(categories?.responseExample).toMatchObject({
      categorias: [
        {
          categoria: { id_categoria: 1 },
          tienda: { visible_tienda: 1 },
          imagen: { id_imagen: 1 },
          sucursales: { sucursales: [1] },
        },
      ],
    });

    const employees = findEndpoint('buscarEmpleados');
    expect(employees?.columns).toEqual([]);
    expect(employees?.tryIt?.body).toEqual({
      grupos: [
        'empleado',
        'sucursal',
        'consecutivo',
        'precios',
        'comision',
        'permisos_caja',
        'restaurante',
        'roles',
        'horario',
        'app_movil',
        'ventas_ext',
      ],
    });
    expect(employees?.groups.map((group) => group.name)).toEqual([
      'empleado',
      'sucursal',
      'consecutivo',
      'precios',
      'comision',
      'permisos_caja',
      'restaurante',
      'roles',
      'horario',
      'app_movil',
      'ventas_ext',
    ]);
    expect(employees?.columns).not.toEqual(
      expect.arrayContaining(['segunda_clave', 'clave_caja']),
    );
    expect(employees?.responseExample).toMatchObject({
      empleados: [
        {
          empleado: { id_empleado: 1 },
          sucursal: { id_sucursal: 1 },
          consecutivo: { id_consecutivo: 1 },
          permisos_caja: { cierra_caja: 1 },
          roles: { es_tienda: 1 },
        },
      ],
    });
  });

  it('marks catalog projections as group-first compatibility routes', () => {
    const catalogIds = [
      'buscarProductosCatalogo',
      'buscarCategorias',
      'buscarImpuestos',
      'buscarBancos',
      'buscarMediosPago',
      'buscarConsecutivos',
      'buscarSucursales',
      'buscarEmpleados',
    ];
    const catalogEndpoints = catalogIds.map((id) => {
      const endpoint = findEndpoint(id);
      if (!endpoint) throw new Error(`Missing endpoint ${id}`);
      return endpoint;
    });

    expect(
      catalogEndpoints.every(
        (endpoint) => endpoint.compatibility === undefined,
      ),
    ).toBe(true);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.compatibility),
    ).toHaveLength(0);
    for (const endpoint of catalogEndpoints) {
      expect(endpoint.requestExample).toEqual(
        expect.objectContaining({ grupos: expect.any(Array) }),
      );
      expect(endpoint.tryIt?.body).toEqual(
        expect.objectContaining({ grupos: expect.any(Array) }),
      );
      for (const preset of endpoint.presets) {
        expect(preset.body).toEqual(
          expect.objectContaining({ grupos: expect.any(Array) }),
        );
      }
    }
    expect(
      registry.endpoints
        .filter((endpoint) => endpoint.category === 'Transacciones')
        .some((endpoint) => endpoint.compatibility),
    ).toBe(false);

    const thirdParty = findEndpoint('buscarTercero');
    expect(thirdParty?.compatibility).toBeUndefined();
    expect(thirdParty?.tryIt?.body).toEqual({
      grupos: [
        'tercero',
        'contacto',
        'sucursal',
        'cartera_cliente',
        'tributaria',
        'configuracion',
      ],
    });
  });

  it('documents the complete consecutivos catalog without disabled columns', () => {
    const consecutivos = findEndpoint('buscarConsecutivos');
    expect(consecutivos?.columns).toEqual([]);
    expect(consecutivos?.tryIt?.body).toEqual({
      grupos: [
        'consecutivo',
        'factura_electronica',
        'rangos',
        'sucursal',
        'configuracion',
      ],
    });
    expect(consecutivos?.columns).not.toEqual(
      expect.arrayContaining(['segunda_clave', 'clave_caja']),
    );
  });

  it('documents the updated branch and payment-method contracts', () => {
    const branches = findEndpoint('buscarSucursales');
    expect(branches?.columns).toEqual([]);
    expect(branches?.tryIt?.body).toEqual({
      grupos: ['sucursal', 'pos', 'politicas_precios', 'licores', 'moneda'],
    });
    expect(branches?.notes.join(' ')).toContain('reondeoTotales');
    expect(branches?.notes.join(' ')).toContain('modificicar_');

    const paymentMethods = findEndpoint('buscarMediosPago');
    expect(paymentMethods?.columns).toEqual([]);
    expect(paymentMethods?.tryIt?.body).toEqual({
      grupos: ['medio_pago', 'sucursal', 'configuracion'],
    });
    expect(paymentMethods?.responseContract).toContain(
      'JsonValue | string | null',
    );
    expect(paymentMethods?.responseExample).toMatchObject({
      medios_pago: [
        {
          medio_pago: { id_medio_pago: 1 },
          sucursal: { id_sucursal: 1 },
          configuracion: { config: '{}' },
        },
      ],
    });
  });
});

type NestedField = {
  description: string;
  fields?: NestedField[];
  itemFields?: NestedField[];
};

const fieldDescriptions = (field: NestedField): string[] => [
  field.description,
  ...(field.fields ?? []).flatMap((child) => fieldDescriptions(child)),
  ...(field.itemFields ?? []).flatMap((child) => fieldDescriptions(child)),
];
