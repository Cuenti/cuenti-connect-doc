import { describe, expect, it } from 'vitest';
import rawRegistry from '../contracts/j4/endpoints.json';
import externalTools from '../contracts/mcp/external-tools.json';
import { adaptRegistry, registry } from './registry';
import {
  buildCurl,
  buildRequest,
  defaultDraft,
  hasRequiredCredentials,
} from './request';

const endpointFor = (contractId: string) => {
  const endpoint = registry.endpoints.find(
    (item) => item.contractId === contractId,
  );
  if (!endpoint) throw new Error(`Missing public contract: ${contractId}`);
  return endpoint;
};

describe('current wrapper public surface', () => {
  it.each([
    'consultarRecibosCaja',
    'consultarMovimientoBanco_idBanco',
    'consultarMovimientosDetalle',
  ])('documents %s as a bounded group-only read query', (id) => {
    const endpoint = endpointFor(id);
    expect(endpoint.kind).toBe('query');
    expect(endpoint.method).toBe('POST');
    expect(endpoint.columns).toEqual([]);
    expect(endpoint.queryParams.map((item) => item.name)).not.toContain(
      'pagina',
    );
    expect(endpoint.queryParams.map((item) => item.name)).not.toContain(
      'estado',
    );
    expect(endpoint.queryParams.map((item) => item.name)).not.toContain(
      'id_bodega',
    );
    for (const name of ['id_sucursal', 'fecha_desde', 'fecha_hasta'])
      expect(
        endpoint.queryParams.find((item) => item.name === name)?.required,
      ).toBe(true);
    expect(endpoint.bodyFields.map((item) => item.name)).toEqual(['grupos']);
    expect(endpoint.bodyRequired).toBe(false);
    expect(endpoint.bodyDescription).toContain('cuerpo ausente o {}');
    expect(endpoint.notes.join(' ')).toContain('proyección SAFE completa');
    expect(endpoint.notes.join(' ')).toContain(
      'No admite columnas, detalle ni paginación',
    );
    expect(endpoint.cache.mode).toBe('bypass');
    expect(endpoint.responseEnvelope).toBe('items');
    const draft = defaultDraft(endpoint);
    draft.credentials = {
      company: 'fixture',
      token: 'fixture',
      branch: '1',
      employee: '1',
      timezone: 'GMT-0500',
    };
    draft.query = {
      id_sucursal: '1',
      fecha_desde: '1735707600000',
      fecha_hasta: '1735794000000',
      id_producto: '25',
    };
    if (endpoint.pathParams.length) draft.path.id_banco = '73';
    const request = buildRequest(endpoint, draft);
    expect(request.init.method).toBe('POST');
    expect(request.init.body).toBe('{}');
    expect(request.curl).not.toContain('confirmation');
    draft.body = '';
    expect(buildRequest(endpoint, draft).init.body).toBeUndefined();
    draft.body = JSON.stringify({ grupos: [endpoint.groups[0].name] });
    expect(buildRequest(endpoint, draft).init.body).toBe(draft.body);
    const source = rawRegistry.endpoints.find((item) => item.id === id);
    const mappings = (
      source?.response as unknown as {
        boundedQuery: { groups: Record<string, object> };
      }
    ).boundedQuery.groups;
    expect(endpoint.groups.map((group) => group.name)).toEqual(
      Object.keys(mappings),
    );
    for (const group of endpoint.groups)
      expect(group.fields).toEqual(Object.keys(mappings[group.name]));
    if (id === 'consultarMovimientoBanco_idBanco') {
      expect(defaultDraft(endpoint).path.id_banco).toBe('');
      expect(request.url).toContain('/bancos/73/movimientos/');
      expect(endpoint.notes.join(' ')).toContain(
        '31 días calendario inclusivos en GMT-0500',
      );
    }
    if (id === 'consultarMovimientosDetalle')
      expect(
        endpoint.queryParams.find((item) => item.name === 'id_producto'),
      ).toMatchObject({ required: true, minimum: 1 });
  });
  it('projects only the production route discriminator and its bounded requirements', () => {
    const route = rawRegistry.routes.find(
      (item) => item.translation.boundedProduction,
    );
    const endpoint = registry.endpoints.find(
      (item) => item.id === route?.routeId,
    );
    expect(endpoint?.responseExample).toHaveProperty(
      'documentos.0.codigos.tipo_documento',
      route?.translation.fixedQuery?.tipo_documento,
    );
    expect(
      rawRegistry.endpoints.find((item) => item.id === route?.contract)
        ?.response.example,
    ).toHaveProperty('documentos.0.codigos.tipo_documento', 4);
    for (const name of ['id_sucursal', 'fecha_desde', 'fecha_hasta'])
      expect(
        endpoint?.queryParams.find((item) => item.name === name)?.required,
      ).toBe(true);
    expect(endpoint?.kind).toBe('query');
    expect(
      endpoint?.queryParams.some((item) => item.name === 'tipo_documento'),
    ).toBe(false);
    expect(endpoint?.queryParams.some((item) => item.name === 'pagina')).toBe(
      true,
    );
    expect(endpoint?.notes.join(' ')).toContain('no consumos reales');
    if (!endpoint) throw new Error('Missing production route');
    expect(endpoint.bodyRequired).toBe(true);
    expect(endpoint.presets.some((preset) => preset.id === 'sales')).toBe(
      false,
    );
    const draft = defaultDraft(endpoint);
    draft.credentials = {
      company: 'fixture',
      token: 'fixture',
      branch: '1',
      employee: '1',
      timezone: 'GMT-0500',
    };
    Object.assign(draft.query, {
      id_sucursal: '1',
      fecha_desde: '1735707600000',
      fecha_hasta: '1735794000000',
    });
    expect(buildRequest(endpoint, draft).curl).not.toContain('confirmation');
    expect(draft.query.es_facturado).toBe('');
    expect(endpoint.notes.join(' ')).not.toContain('proyección SAFE completa');
    for (const body of [
      {},
      { grupos: [] },
      { grupos: ['codigos', 'codigos'] },
      { grupos: ['desconocido'] },
    ]) {
      draft.body = JSON.stringify(body);
      expect(() => buildRequest(endpoint, draft)).toThrow(
        'grupos debe ser una lista no vacía',
      );
    }
    draft.body = JSON.stringify({ grupos: ['codigos'] });
    expect(buildRequest(endpoint, draft).init.body).toBe(draft.body);
    draft.body = '';
    expect(() => buildRequest(endpoint, draft)).toThrow(
      'El cuerpo JSON es obligatorio',
    );
  });
  it('does not advertise mutation body fields as selectable response columns', () => {
    for (const endpoint of registry.endpoints.filter(
      (item) => item.kind === 'mutation',
    )) {
      expect(endpoint.columns, endpoint.id).toEqual([]);
    }
  });
  it('does not turn partial third-party updates into creation payloads', () => {
    const update = registry.endpoints.find(
      (endpoint) => endpoint.id === 'terceros-actualizar',
    );
    expect(update?.bodyFields.every((field) => !field.required)).toBe(true);
    expect(update?.notes).toContain('Las actualizaciones son parciales');
    const creation = registry.endpoints.find(
      (endpoint) => endpoint.id === 'terceros-crear',
    );
    expect(
      creation?.bodyFields.find((field) => field.name === 'es_cliente')
        ?.required,
    ).toBe(false);
    expect(creation?.notes).toContain('es_cliente=1 o es_proveedor=1');
  });
  it('preserves response examples unless projected, plus fallbacks and declared headers', () => {
    for (const route of rawRegistry.routes) {
      const source = rawRegistry.endpoints.find(
        (item) => item.id === route.contract,
      );
      const endpoint = registry.endpoints.find(
        (item) => item.id === route.routeId,
      );
      expect(endpoint, route.routeId).toBeDefined();
      expect(endpoint?.method).toBe(route.method);
      expect(endpoint?.path).toBe(route.path);
      if (
        !route.translation.boundedProduction &&
        !route.translation.omitBodyFields?.length
      )
        expect(endpoint?.responseExample).toEqual(source?.response.example);
      expect(endpoint?.responseEnvelope).toBe(source?.response.envelope);
      expect(endpoint?.responseFallbackExample).toEqual(
        source?.response.fallbackExample,
      );
      expect(endpoint?.headers.map((header) => header.name)).toEqual(
        source?.requiredHeaders,
      );
    }
  });

  it('documents cost centers as a bodyless uncached query with the standard envelope', () => {
    const endpoint = endpointFor('consultarCentro_costo2');
    expect(endpoint.path).toBe('/api/v1/organizacion/centros-costo');
    expect(endpoint.method).toBe('GET');
    expect(endpoint.bodyType).toBe('none');
    expect(endpoint.cache.mode).toBe('bypass');
    expect(endpoint.responseEnvelope).toBe('items');
    expect(endpoint.responseExample).toHaveProperty(
      'data.items.0.id_centro_costo',
      1,
    );
    expect(
      buildCurl(endpoint, defaultDraft(endpoint), 'http://127.0.0.1:8083'),
    ).not.toContain('--data');
  });

  it('preserves nullable document integers and exposes all canonical body rules and monetary bounds', () => {
    const endpoint = endpointFor('grabarDocumentoSimple');
    for (const name of [
      'emitir_electronicamente',
      'bodega_destino',
      'id_documento',
    ]) {
      expect(
        endpoint.bodyFields.find((field) => field.name === name),
      ).toMatchObject({
        type: 'integer',
        nullable: true,
        required: false,
        minimum: undefined,
      });
      const draft = defaultDraft(endpoint);
      draft.credentials = {
        company: 'example-company',
        token: 'example-token',
        branch: '1',
        employee: '1',
        timezone: 'GMT-0500',
      };
      for (const value of [null, -1, 0, 1]) {
        draft.body = JSON.stringify({
          ...(endpoint.requestExample as object),
          [name]: value,
        });
        expect(
          JSON.parse(buildRequest(endpoint, draft).init.body as string)[name],
        ).toBe(value);
      }
    }
    const source = rawRegistry.endpoints.find(
      (item) => item.id === 'grabarDocumentoSimple',
    );
    for (const rule of source?.body.rules ?? [])
      expect(endpoint.notes).toContain(rule);
    expect(
      endpointFor('agregarPagoAnticipo').bodyFields.find(
        (field) => field.name === 'valor',
      )?.exclusiveMinimum,
    ).toBe(0);
  });

  it('covers the declared public catalog without exposing private descriptors', () => {
    expect(registry.endpoints).toHaveLength(54);
    expect(registry.endpoints.map((item) => item.id)).toEqual([
      ...rawRegistry.routes.map((route) => route.routeId),
      ...externalTools.tools.map((tool) => tool.id),
    ]);
    expect(
      registry.endpoints.some(
        (item) => item.contractId === 'consultarClienteId',
      ),
    ).toBe(false);
    expect(
      registry.endpoints.some((item) =>
        /asignarFacturaDocumento/.test(item.path),
      ),
    ).toBe(false);
  });

  it('fails closed without public routes or with ambiguous method/path tuples', () => {
    expect(() => adaptRegistry({ ...rawRegistry, routes: [] })).toThrow(
      /rutas públicas/i,
    );
    const duplicate = { ...rawRegistry.routes[0], routeId: 'duplicate-route' };
    expect(() =>
      adaptRegistry({
        ...rawRegistry,
        routes: [...rawRegistry.routes, duplicate],
      }),
    ).toThrow(/método.*ruta/i);
    expect(() =>
      adaptRegistry({
        ...rawRegistry,
        routes: [{ ...duplicate, contract: 'private-missing' }],
      }),
    ).toThrow(/no encontrado/i);
  });

  it('documents the existing bodyless document cancellation and its public response', () => {
    const endpoint = endpointFor('anularDocumento');
    expect(endpoint.path).toBe(
      '/api/v1/documentos/{id_documento}/anulaciones/{id_empleado}',
    );
    expect(endpoint.method).toBe('POST');
    expect(endpoint.kind).toBe('mutation');
    expect(endpoint.bodyRequired).toBe(false);
    expect(endpoint.responseExample).toEqual({
      success: true,
      status: 'ANULADO',
    });
    const draft = defaultDraft(endpoint);
    draft.credentials = {
      company: 'example-company',
      token: 'example-token',
      branch: '1',
      employee: '1',
      timezone: 'GMT-0500',
    };
    const request = buildRequest(endpoint, draft);
    expect(request.init.body).toBeUndefined();
    expect((request.init.headers as Headers).get('Content-Type')).toBe(
      'application/json',
    );
    expect(request.curl).not.toContain('/jServerj4ErpPro');
  });

  it('keeps financial envelopes specific and hides internal cancellation selectors', () => {
    for (const contractId of [
      'agregarPagoAnticipo',
      'listaAnticiposClienteActivo',
      'anularAnticipo',
      'anularPago',
    ]) {
      expect(
        Object.keys(endpointFor(contractId).responseExample as object).sort(),
      ).toEqual(['data', 'error', 'request_id', 'success']);
    }
    expect(
      endpointFor('agregarPagoTransacion').responseExample,
    ).not.toHaveProperty('request_id');
    const cancellation = endpointFor('anularPago');
    expect(cancellation.bodyFields.map((field) => field.name)).not.toContain(
      'id_transacion_comprobante_transacion',
    );
    expect(JSON.stringify(cancellation.requestExample)).not.toContain(
      'id_transacion_comprobante_transacion',
    );
  });

  it('omits fixed body selectors declared as field names or objects', () => {
    for (const endpoint of registry.endpoints) {
      expect(endpoint.bodyFields.map((field) => field.name)).not.toContain(
        'route-fixed-selector',
      );
    }
    expect(
      endpointFor('guardarTercero').bodyFields.map((field) => field.name),
    ).not.toContain('id_cliente');
  });

  it('preserves local financial datetimes rather than converting them to epoch', () => {
    const endpoint = endpointFor('agregarPagoAnticipo');
    const draft = defaultDraft(endpoint);
    draft.credentials = {
      company: 'example-company',
      token: 'example-token',
      branch: '1',
      employee: '1',
      timezone: 'GMT-0500',
    };
    const body = JSON.parse(draft.body);
    body.fecha_registro = '2026-10-21T15:30:00';
    draft.body = JSON.stringify(body);
    expect(
      JSON.parse(buildRequest(endpoint, draft).init.body as string)
        .fecha_registro,
    ).toBe('2026-10-21T15:30:00');
    expect(
      endpoint.bodyFields.find((field) => field.name === 'fecha_registro')
        ?.description,
    ).toContain('YYYY-MM-DDTHH:mm:ss');
  });

  it.each([
    'obtenerComandas',
    'platosEliminados',
  ])('uses only %s headers and permits an empty body', (contractId) => {
    const endpoint = endpointFor(contractId);
    expect(endpoint.headers.map((header) => header.name)).toEqual([
      'Content-Type',
      'X-Auth-Token-empresa',
      'Authorization',
    ]);
    const draft = defaultDraft(endpoint);
    draft.body = '';
    draft.credentials = {
      company: 'example-company',
      token: 'example-token',
      branch: '',
      employee: '',
      timezone: 'not-used',
    };
    expect(hasRequiredCredentials(draft.credentials, endpoint)).toBe(true);
    const request = buildRequest(endpoint, draft);
    const headers = request.init.headers as Headers;
    expect(headers.get('X-Auth-Token-sucursal')).toBeNull();
    expect(headers.get('X-Id-Empleado')).toBeNull();
    expect(headers.get('X-gtm')).toBeNull();
    expect(request.init.body).toBeUndefined();
    expect(buildCurl(endpoint, draft, '')).toContain(
      'Authorization: Bearer example-token',
    );
    expect(request.curl).not.toContain('example-token');
    draft.credentials.token = '';
    expect(hasRequiredCredentials(draft.credentials, endpoint)).toBe(false);
    expect(() => buildRequest(endpoint, draft)).toThrow(/Authorization/);
  });
});
