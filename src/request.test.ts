import { describe, expect, it } from 'vitest';
import { endpointFromLocation, endpointUrl } from './navigation';
import { registry } from './registry';
import {
  buildCurl,
  buildRequest,
  defaultDraft,
  hasRequiredCredentials,
} from './request';

const credentials = {
  company: 'tenant-secret',
  timezone: '',
  token: 'Bearer Bearer bearer-secret',
  branch: 'branch-secret',
  employee: '42',
};

const findEndpoint = (id: string) =>
  registry.endpoints.find(
    (endpoint) =>
      endpoint.id === id ||
      (endpoint as { contractId?: string }).contractId === id,
  );

describe('URL selection', () => {
  it('reads and updates endpoint selection without removing other query values', () => {
    const location = {
      pathname: '/docs',
      search: '?theme=dark',
      hash: '#detail',
    };
    const url = endpointUrl(location, 'buscarCartera');
    expect(url).toBe('/docs?theme=dark&endpoint=buscarCartera#detail');
    expect(
      endpointFromLocation({ search: '?endpoint=buscarCartera' } as Location),
    ).toBe('buscarCartera');
  });
});

describe('request builder', () => {
  it('requires valid global credentials before enabling requests', () => {
    expect(hasRequiredCredentials({ ...credentials, company: '' })).toBe(false);
    expect(hasRequiredCredentials({ ...credentials, branch: '' })).toBe(false);
    expect(hasRequiredCredentials({ ...credentials, employee: '' })).toBe(
      false,
    );
    expect(hasRequiredCredentials({ ...credentials, token: '' })).toBe(false);
    expect(
      hasRequiredCredentials({
        ...credentials,
        company: 'empresa con espacios',
      }),
    ).toBe(false);
    expect(hasRequiredCredentials(credentials)).toBe(true);
  });

  it('builds the catalog POST with global headers and a placeholder curl by default', () => {
    const endpoint = findEndpoint('buscarProductosCatalogo');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_sucursal: '3', pagina: '0' };
    draft.query = { total: '30', nombre_producto: 'Cafe molido' };
    draft.credentials = credentials;

    const request = buildRequest(
      endpoint,
      draft,
      'https://proxy.example.test/',
    );
    expect(request.url).toContain('/api/v1/catalogo/productos/busquedas?');
    expect(request.url).toContain('nombre_producto=Cafe+molido');
    expect(request.init.headers).toBeInstanceOf(Headers);
    const headers = request.init.headers as Headers;
    expect(headers.get('X-Auth-Token-empresa')).toBe(credentials.company);
    expect(headers.get('X-Auth-Token-sucursal')).toBe(credentials.branch);
    expect(headers.get('X-Id-Empleado')).toBe(credentials.employee);
    expect(headers.get('X-gtm')).toBe('GMT-0500');
    expect(headers.get('Authorization')).toBe('Bearer bearer-secret');
    expect(request.curl).toContain('X-Auth-Token-empresa: {{id_empresa}}');
    expect(request.curl).toContain('X-gtm: GMT-0500');
    expect(request.curl).toContain('Authorization: Bearer {{token}}');
    expect(request.curl).toContain('X-Auth-Token-sucursal: {{id_sucursal}}');
    expect(request.curl).toContain('X-Id-Empleado: {{id_empleado}}');
    expect(request.curl).not.toContain('\n+');
    expect(request.curl).not.toContain(credentials.company);
    expect(request.curl).not.toContain('bearer-secret');
  });

  it('includes configured credentials only when explicitly requested for curl', () => {
    const endpoint = findEndpoint('buscarProductosCatalogo');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_sucursal: '3', pagina: '0' };
    draft.credentials = credentials;

    const request = buildRequest(
      endpoint,
      draft,
      'https://proxy.example.test',
      {
        includeCredentials: true,
      },
    );

    expect(request.curl).toContain(
      `X-Auth-Token-empresa: ${credentials.company}`,
    );
    expect(request.curl).toContain(
      `X-Auth-Token-sucursal: ${credentials.branch}`,
    );
    expect(request.curl).toContain(`X-Id-Empleado: ${credentials.employee}`);
    expect(request.curl).toContain('Authorization: Bearer bearer-secret');
  });

  it('builds an anonymous curl with exact Postman placeholders', () => {
    const endpoint = findEndpoint('buscarProductosCatalogo');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_sucursal: '3', pagina: '0' };

    const curl = buildCurl(endpoint, draft, 'https://proxy.example.test');

    expect(curl).toContain('X-Auth-Token-empresa: {{id_empresa}}');
    expect(curl).toContain('X-Auth-Token-sucursal: {{id_sucursal}}');
    expect(curl).toContain('X-Id-Empleado: {{id_empleado}}');
    expect(curl).toContain('Authorization: Bearer {{token}}');
    expect(curl).toContain('X-gtm: GMT-0500');
  });

  it('preserves Postman path variables instead of encoding documentary markers', () => {
    const endpoint = findEndpoint('consultarImpuestoCuenti');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_impuesto: '<id_impuesto>' };

    const curl = buildCurl(endpoint, draft, 'https://proxy.example.test');

    expect(curl).toContain('/api/v1/tributario/impuestos/{{id_impuesto}}');
    expect(curl).not.toMatch(/%3C|%3E|%7B|%7D/i);
  });

  it('keeps URL encoding enabled for real request path values', () => {
    const endpoint = findEndpoint('consultarImpuestoCuenti');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_impuesto: 'branch/with space' };
    draft.credentials = credentials;

    const request = buildRequest(endpoint, draft, 'https://proxy.example.test');

    expect(request.url).toContain(
      '/api/v1/tributario/impuestos/branch%2Fwith%20space',
    );
  });

  it('builds an authenticated curl from in-memory credentials', () => {
    const endpoint = findEndpoint('buscarProductosCatalogo');
    if (!endpoint) throw new Error('Product endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.path = { id_sucursal: '3', pagina: '0' };
    draft.credentials = credentials;

    const curl = buildCurl(endpoint, draft, 'https://proxy.example.test');

    expect(curl).toContain(`X-Auth-Token-empresa: ${credentials.company}`);
    expect(curl).toContain('Authorization: Bearer bearer-secret');
    expect(curl).not.toContain('{{token}}');
  });

  it('builds a POST with global headers and exactly one Bearer prefix', () => {
    const endpoint = findEndpoint('buscarCategorias');
    if (!endpoint) throw new Error('Category endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.credentials = credentials;

    const request = buildRequest(endpoint, draft);
    const headers = request.init.headers as Headers;
    expect(headers.get('X-Auth-Token-empresa')).toBe(credentials.company);
    expect(headers.get('X-Auth-Token-sucursal')).toBe(credentials.branch);
    expect(headers.get('X-Id-Empleado')).toBe(credentials.employee);
    expect(headers.get('X-gtm')).toBe('GMT-0500');
    expect(headers.get('Authorization')).toBe('Bearer bearer-secret');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(request.init.body).toBeTruthy();
  });

  it('rejects global header values that Envoy would reject', () => {
    const endpoint = findEndpoint('buscarCategorias');
    if (!endpoint) throw new Error('Category endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.credentials = {
      ...credentials,
      company: 'empresa con espacios',
      timezone: 'GMT-0300',
      token: 'token con espacios',
    };

    expect(() => buildRequest(endpoint, draft)).toThrow(
      /empresa no puede contener espacios.*X-gtm debe ser GMT-0500.*token sin espacios/,
    );
  });

  it('redacts secret-looking body fields from curl snippets', () => {
    const endpoint = findEndpoint('guardarTercero');
    if (!endpoint) throw new Error('Third-party endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.credentials = credentials;
    draft.body = JSON.stringify({
      id_cliente: -1,
      nombre_cliente: "O'Brien",
      clave_portal: 'body-secret',
    });

    const request = buildRequest(endpoint, draft);
    expect(request.curl).toContain('clave_portal');
    expect(request.curl).toContain('<valor-omitido>');
    expect(request.curl).toContain("O'\"'\"'Brien");
    expect(request.curl).not.toContain('body-secret');
  });

  it('rejects missing required filters and invalid JSON', () => {
    const endpoint = findEndpoint('buscarCartera');
    if (!endpoint) throw new Error('Accounts endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.query.es_ingreso = '';
    draft.body = '{broken';
    draft.credentials = credentials;
    expect(() => buildRequest(endpoint, draft)).toThrow(/JSON válido/);
  });

  it('keeps the Try It body editor open to empty and column projections', () => {
    const endpoint = findEndpoint('buscarCategorias');
    if (!endpoint) throw new Error('Category endpoint was not found.');
    const draft = defaultDraft(endpoint);
    draft.credentials = credentials;

    draft.body = '{}';
    expect(buildRequest(endpoint, draft).init.body).toBe('{}');

    draft.body = JSON.stringify({
      columnas: ['id_categoria', 'nombre_categoria'],
    });
    expect(buildRequest(endpoint, draft).init.body).toBe(
      '{"columnas":["id_categoria","nombre_categoria"]}',
    );
  });
});
