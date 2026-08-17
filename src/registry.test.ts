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
  it('exposes all 45 approved public method/path tuples', () => {
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
        'POST /api/v1/transacciones/operativas/despachos-agrupados/busquedas',
        'POST /api/v1/transacciones/operativas/ordenes-produccion/busquedas',
        'POST /api/v1/transacciones/operativas/devoluciones-ajustes/busquedas',
        'POST /api/v1/transacciones/operativas/traslados-internos/busquedas',
        'POST /api/v1/transacciones/operativas/ordenes-compra/busquedas',
        'POST /api/v1/transacciones/operativas/recepciones-mercancia/busquedas',
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
      ]),
    );
    expect(tuples).toHaveLength(45);
    expect(tuples.every((tuple) => tuple.includes('/api/v1/'))).toBe(true);
    expect(JSON.stringify(registry)).not.toContain('/jServerj4ErpPro');
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.category)),
    ).toEqual(new Set(categories));
  });

  it('keeps the public query and mutation split', () => {
    expect(registry.endpoints).toHaveLength(45);
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.category)),
    ).toEqual(new Set(categories));
    expect(
      registry.endpoints.filter(
        (endpoint) => endpoint.cache.mode === 'cacheable',
      ),
    ).toHaveLength(38);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.kind === 'mutation'),
    ).toHaveLength(7);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.cache.mode === 'bypass'),
    ).toHaveLength(7);
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
    expect(banks?.columns).toContain('config');
    expect(banks?.summary).toContain(
      'config se devuelve como arreglo u objeto cuando contiene JSON valido',
    );
    expect(banks?.responseExample).toMatchObject({
      bancos: [{ config: { lstEmpleados: [1, 2, 3, 5, 6, 8, 11] } }],
    });

    const categories = findEndpoint('buscarCategorias');
    expect(categories?.columns).toContain('sucursales');
    expect(categories?.responseExample).toMatchObject({
      categorias: [
        {
          sucursales: [1, 2, 4],
          subcategorias: [{ sucursales: [1, 4] }],
        },
      ],
    });

    const employees = findEndpoint('buscarEmpleados');
    expect(employees?.columns).toEqual([
      'id_empleado',
      'id_usuario_portal',
      'nombre_completo',
      'es_activo',
      'fecha_registro',
      'id_lista_precios',
      'id_sucursal',
      'id_consecutivo',
      'sincroniazar_datos',
      'tipo_usuario',
      'comision',
      'id_bodega',
      'tipo_comision',
      'modePosDefecto',
      'comision_antes_iva',
      'identificacion',
      'mostrar_mesa',
      'es_contador',
      'solo_bodegas_sucursal',
      'obligar_apertura_caja',
      'cerrar_session_cierre',
      'es_tienda',
      'codigo_empleado',
      'sucursal_adicional',
      'cierra_caja',
      'ventas_solo_credito',
      'vendedor_multi_sucursal',
    ]);
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
          sucursal_adicional: {
            bodegas_vender: [],
            bodegas_trasladar: [],
            sucursales_permitidas: [],
          },
        },
      ],
    });
  });

  it('marks catalog projections as group-first compatibility routes', () => {
    const catalogIds = [
      'buscarProductosCatalogo',
      'buscarCategorias',
      'buscarTercero',
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

    expect(catalogEndpoints.every((endpoint) => endpoint.compatibility)).toBe(
      true,
    );
    expect(
      registry.endpoints.filter((endpoint) => endpoint.compatibility),
    ).toHaveLength(9);
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
        .filter((endpoint) => endpoint.category === 'Facturas e historiales')
        .some((endpoint) => endpoint.compatibility),
    ).toBe(false);
  });

  it('documents the complete consecutivos catalog without disabled columns', () => {
    const consecutivos = findEndpoint('buscarConsecutivos');
    const columns = [
      'id_consecutivo',
      'nombre_consecutivo',
      'prefijo',
      'numero',
      'alertar_numero',
      'facturaOnline',
      'es_activo',
      'fecha_registro',
      'resolucion',
      'id_sucursal',
      'nombre_sucursal',
      'inicia',
      'finaliza',
      'es_factura_electronica',
      'fecha_vencimiento',
      'nRelleno',
      'es_tirilla_pos',
      'es_contingencia',
      'predeterminado',
      'multi_moneda',
      'tipo_consecutivo',
    ];
    expect(consecutivos?.columns).toEqual(columns);
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
    const requestedBranchColumns = [
      'id_sucursal',
      'nombre_sucursal',
      'nota',
      'simbolo_moneda',
      'digitos_decimales',
      'reondeoTotales',
      'modificicar_precio_minimos_otras_sucursales',
      'modificicar_descuento_maximo_otras_sucursales',
      'actualizarPrecioVentaSucursales',
      'activar_venta_compra_licores',
      'actualizarPrecioCostoSucursales',
      'vender_ip_estampilla',
    ];
    expect(branches?.columns).toEqual(
      expect.arrayContaining(requestedBranchColumns),
    );
    expect(branches?.tryIt?.body).toEqual({
      grupos: ['sucursal', 'pos', 'politicas_precios', 'licores', 'moneda'],
    });
    expect(branches?.notes.join(' ')).toContain('reondeoTotales');
    expect(branches?.notes.join(' ')).toContain('modificicar_');

    const paymentMethods = findEndpoint('buscarMediosPago');
    expect(paymentMethods?.columns).toContain('config');
    expect(paymentMethods?.tryIt?.body).toEqual({
      grupos: ['medio_pago', 'sucursal', 'configuracion'],
    });
    expect(paymentMethods?.responseContract).toContain(
      'JsonValue | string | null',
    );
    expect(paymentMethods?.responseExample).toMatchObject({
      medios_pago: [{ config: { lstBancos: [] } }],
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
