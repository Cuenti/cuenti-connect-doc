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
  it('covers the declared public catalog without exposing private descriptors', () => {
    expect(registry.endpoints).toHaveLength(49);
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
