import { describe, expect, it } from 'vitest';
import { hasFieldDescription, hasGroupDescription } from './fieldDescriptions';
import { categories, upcomingCapabilities } from './model';
import { registry } from './registry';

describe('canonical documentation registry', () => {
  it('exposes exactly 24 implemented endpoints in seven categories', () => {
    expect(registry.endpoints).toHaveLength(24);
    expect(
      new Set(registry.endpoints.map((endpoint) => endpoint.category)),
    ).toEqual(new Set(categories));
  });

  it('keeps the expected cache and mutation split', () => {
    expect(
      registry.endpoints.filter(
        (endpoint) => endpoint.cache.mode === 'cacheable',
      ),
    ).toHaveLength(20);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.kind === 'mutation'),
    ).toHaveLength(4);
    expect(
      registry.endpoints.filter((endpoint) => endpoint.cache.mode === 'bypass'),
    ).toHaveLength(4);
  });

  it('provides an example and response contract for every route', () => {
    for (const endpoint of registry.endpoints) {
      expect(endpoint.path).toMatch(/^\/jServerj4ErpPro\//);
      expect(endpoint.responseExample).toBeDefined();
      expect(endpoint.summary).not.toContain('como parte de una integración');
      if (endpoint.bodyRequired) expect(endpoint.requestExample).toBeDefined();
    }
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
          hasFieldDescription(endpoint.id, column),
          `${endpoint.id}.${column}`,
        ).toBe(true);
      }
    }
  });

  it('exposes typed fields for JSON bodies, including nested creation fields', () => {
    const movement = registry.endpoints.find(
      (endpoint) => endpoint.id === 'grabarMovimientoArr',
    );
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
      ]),
    );

    const document = registry.endpoints.find(
      (endpoint) => endpoint.id === 'grabarDocumentoSimple',
    );
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
    const thirdParty = registry.endpoints.find(
      (endpoint) => endpoint.id === 'guardarTercero',
    );
    const fields = new Map(
      thirdParty?.bodyFields.map((field) => [field.name, field]) ?? [],
    );

    expect(fields.get('id_tipo_persona')).toEqual(
      expect.objectContaining({
        type: 'string',
        typeLabel: 'texto',
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
    expect(fields.get('es_consumidor_final')).toEqual(
      expect.objectContaining({ type: 'string', typeLabel: 'texto | null' }),
    );
    expect(fields.get('fecha_nacimiento')).toEqual(
      expect.objectContaining({
        type: 'epoch-milliseconds',
        typeLabel: 'milisegundos desde epoch | null',
      }),
    );
    expect(fields.get('horario')).toEqual(
      expect.objectContaining({
        type: 'epoch-milliseconds',
        typeLabel: 'milisegundos desde epoch | null',
      }),
    );
    expect(fields.get('lstContactoCliente')).toEqual(
      expect.objectContaining({ type: 'array', typeLabel: 'arreglo | null' }),
    );
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
      expect(parameter.allowedValues).toEqual(['1', '7', '9']);
      expect(parameter.allowedValueLabels).toEqual({
        '1': 'Factura',
        '7': 'Compra',
        '9': 'Prefactura / remisión',
      });
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

    const deletedDishes = registry.endpoints.find(
      (endpoint) => endpoint.id === 'platosEliminados',
    );
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
    const products = registry.endpoints.find(
      (endpoint) => endpoint.id === 'consultaProductoPaginadaMCP',
    );
    expect(products?.queryParams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'id_producto', required: false }),
        expect.objectContaining({ name: 'sku', required: false }),
      ]),
    );
    expect(products?.tryIt?.query).toMatchObject({
      id_producto: '125',
      sku: 'SKU-125',
    });
    expect(products?.notes.join(' ')).toContain('AND');

    const banks = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarBancos',
    );
    expect(banks?.columns).toContain('config');
    expect(banks?.summary).toContain(
      'config se devuelve como arreglo u objeto cuando contiene JSON válido',
    );
    expect(banks?.responseExample).toMatchObject({
      bancos: [{ config: { lstEmpleados: [1, 2, 3, 5, 6, 8, 11] } }],
    });

    const categories = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarCategorias',
    );
    expect(categories?.columns).toContain('sucursales');
    expect(categories?.responseExample).toMatchObject({
      categorias: [
        {
          sucursales: [1, 2, 4],
          subcategorias: [{ sucursales: [1, 4] }],
        },
      ],
    });

    const employees = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarEmpleados',
    );
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
      columnas: [
        'id_empleado',
        'nombre_completo',
        'identificacion',
        'id_sucursal',
      ],
    });
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

  it('documents the complete consecutivos catalog without disabled columns', () => {
    const consecutivos = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarConsecutivos',
    );
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
      columnas: [
        'id_consecutivo',
        'nombre_consecutivo',
        'prefijo',
        'numero',
        'id_sucursal',
      ],
    });
    expect(consecutivos?.columns).not.toEqual(
      expect.arrayContaining(['segunda_clave', 'clave_caja']),
    );
  });

  it('documents the updated branch and payment-method contracts', () => {
    const branches = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarSucursales',
    );
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
      columnas: requestedBranchColumns,
    });
    expect(branches?.notes.join(' ')).toContain('reondeoTotales');
    expect(branches?.notes.join(' ')).toContain('modificicar_');

    const paymentMethods = registry.endpoints.find(
      (endpoint) => endpoint.id === 'buscarMediosPago',
    );
    expect(paymentMethods?.columns).toContain('config');
    expect(paymentMethods?.tryIt?.body).toEqual({
      columnas: ['id_medio_pago', 'nombre_medio_pago', 'config'],
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
