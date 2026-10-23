import { act, renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useTryItController } from './components/try-it/controller';
import { registry } from './registry';
import {
  buildCurl,
  buildRequest,
  defaultDraft,
  hasRequiredCredentials,
} from './request';

const credentials = {
  company: 'probe-tenant',
  timezone: 'GMT-0500',
  token: 'probe-secret',
  branch: '1',
  employee: '7',
};
const readyDraft = (endpoint: (typeof registry.endpoints)[number]) => {
  const draft = defaultDraft(endpoint);
  draft.credentials = { ...credentials };
  for (const parameter of endpoint.pathParams)
    draft.path[parameter.name] ||= parameter.defaultValue || '105';
  for (const parameter of endpoint.queryParams)
    if (parameter.required)
      draft.query[parameter.name] ||= parameter.defaultValue || '1';
  return draft;
};

test('S1/S2: all public consumers preserve drafts, reject invalid boundaries and redact secrets', () => {
  for (const endpoint of registry.endpoints) {
    const draft = readyDraft(endpoint);
    const before = JSON.stringify({ endpoint, draft });
    expect(buildRequest(endpoint, draft).init.method).toBe(endpoint.method);
    expect(JSON.stringify({ endpoint, draft })).toBe(before);
    for (const parameter of endpoint.pathParams.filter(
      (p) => p.required && !p.defaultValue,
    )) {
      expect(() =>
        buildRequest(endpoint, {
          ...draft,
          path: { ...draft.path, [parameter.name]: '' },
        }),
      ).toThrow(`${parameter.name} es obligatorio.`);
    }
    if (endpoint.method === 'GET') continue;
    expect(() => buildRequest(endpoint, { ...draft, body: '{' })).toThrow(
      'El cuerpo debe contener JSON válido.',
    );
    if (endpoint.bodyRequired)
      expect(() => buildRequest(endpoint, { ...draft, body: '' })).toThrow(
        'El cuerpo JSON es obligatorio.',
      );
    const secretDraft = {
      ...draft,
      body: '{"password":"body-secret","nested":{"token":"nested-secret"}}',
    };
    const request = buildRequest(endpoint, secretDraft);
    for (const secret of ['probe-secret', 'body-secret', 'nested-secret'])
      expect(request.curl).not.toContain(secret);
    expect(request.init.body).toContain('body-secret');
    expect(buildCurl(endpoint, secretDraft, '')).toContain('probe-secret');
    expect(JSON.stringify({ endpoint, draft })).toBe(before);
  }
});

test('S2/S6: endpoint credential guards and explicit mutation confirmation prevent network calls', async () => {
  const network = vi.fn().mockResolvedValue({
    status: 200,
    headers: new Headers(),
    text: async () => '{}',
  });
  vi.stubGlobal('fetch', network);
  try {
    for (const endpoint of registry.endpoints) {
      const hook = renderHook(
        ({ creds }) =>
          useTryItController({
            endpoint,
            credentials: creds,
            proxyBaseUrl: '',
            curlBaseUrl: '',
          }),
        { initialProps: { creds: { ...credentials } } },
      );
      const draft = readyDraft(endpoint);
      act(() => {
        hook.result.current.setPathValues(draft.path);
        hook.result.current.setQueryValues(draft.query);
      });
      network.mockClear();
      await act(async () => {
        await hook.result.current.execute();
      });
      if (endpoint.kind === 'mutation') {
        expect(network).not.toHaveBeenCalled();
        expect(hook.result.current.error).toBe(
          'Confirma explícitamente la mutación antes de enviarla.',
        );
        act(() => hook.result.current.setConfirmed(true));
        await act(async () => {
          await hook.result.current.execute();
        });
      }
      expect(network).toHaveBeenCalledTimes(1);
      for (const [header, key] of [
        ['Authorization', 'token'],
        ['X-Auth-Token-empresa', 'company'],
        ['X-Auth-Token-sucursal', 'branch'],
        ['X-Id-Empleado', 'employee'],
      ] as const) {
        if (!endpoint.headers.some((h) => h.name === header && h.required))
          continue;
        for (const value of ['', 'bad value']) {
          hook.rerender({ creds: { ...credentials, [key]: value } });
          network.mockClear();
          await act(async () => {
            await hook.result.current.execute();
          });
          expect(network).not.toHaveBeenCalled();
        }
      }
      hook.unmount();
    }
  } finally {
    vi.unstubAllGlobals();
  }
});

test('S2/S6: restaurant empty-body queries and document cancellation retain distinct contracts', () => {
  for (const contract of ['obtenerComandas', 'platosEliminados']) {
    const endpoint = registry.endpoints.find((e) => e.contractId === contract);
    if (!endpoint) throw new Error(`Missing contract: ${contract}`);
    const draft = readyDraft(endpoint);
    draft.credentials = {
      ...credentials,
      branch: '',
      employee: '',
      timezone: 'ignored',
    };
    expect(hasRequiredCredentials(draft.credentials, endpoint)).toBe(true);
    for (const body of ['', '{}']) {
      const request = buildRequest(endpoint, { ...draft, body });
      expect([...new Headers(request.init.headers).keys()].sort()).toEqual([
        'authorization',
        'content-type',
        'x-auth-token-empresa',
      ]);
      expect(request.init.body).toBe(body || undefined);
    }
  }
  const cancellation = registry.endpoints.find(
    (e) => e.id === 'documentos-anular',
  );
  if (!cancellation) throw new Error('Missing public document cancellation');
  const request = buildRequest(cancellation, readyDraft(cancellation));
  expect(request.url).toBe('/api/v1/documentos/12345/anulaciones/1');
  expect(request.init.method).toBe('POST');
  expect(request.init.body).toBeUndefined();
  expect(cancellation.kind).toBe('mutation');
  expect(cancellation.responseExample).toEqual({
    success: true,
    status: 'ANULADO',
  });
});
