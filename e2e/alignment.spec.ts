import { readFileSync } from 'node:fs';
import { expect, type Page, test } from '@playwright/test';

const rawRegistry: typeof import('../contracts/j4/endpoints.json') = JSON.parse(
  readFileSync(
    new URL('../contracts/j4/endpoints.json', import.meta.url),
    'utf8',
  ),
);

const configure = async (page: Page, full = false) => {
  await page
    .locator('header.topbar')
    .getByRole('button', { name: /Credenciales/i })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Contexto y credenciales' });
  await dialog.locator('#global-company').fill('example-company');
  await dialog.locator('#global-token').fill('example-token');
  if (full) {
    await dialog.locator('#global-branch').fill('1');
    await dialog.locator('#global-employee').fill('1');
  }
  await dialog.getByRole('button', { name: 'Aceptar' }).click();
};

test('exposes all newly documented public routes', async ({ page }) => {
  for (const id of [
    'transacciones-anular',
    'documentos-anular',
    'transacciones-notas-crear',
    'transacciones-notas-credito-emitir',
    'finanzas-abonos-crear',
    'finanzas-anticipos-crear',
    'finanzas-anticipos-cliente-sucursal',
    'finanzas-anticipos-anular',
    'finanzas-abonos-anular',
    'finanzas-comprobante-caja-por-id',
    'organizacion-centros-costo',
    'restaurante-mesas-ocupadas',
    'finanzas-comprobantes-caja-busquedas',
    'finanzas-bancos-movimientos-busquedas',
    'inventario-kardex-busquedas',
    'operativas-ordenes-produccion-busquedas',
  ]) {
    await page.goto(`/?endpoint=${id}`);
    const route = rawRegistry.routes.find((item) => item.routeId === id);
    if (!route) throw new Error(`Missing public route: ${id}`);
    await expect(page.locator('.route-bar code')).toContainText(
      route.path.replace(/^\/api/, ''),
    );
    await expect(page.locator('.endpoint-detail h1')).not.toBeEmpty();
  }
});

for (const id of [
  'finanzas-comprobantes-caja-busquedas',
  'finanzas-bancos-movimientos-busquedas',
  'inventario-kardex-busquedas',
  'operativas-ordenes-produccion-busquedas',
]) {
  test(`sends ${id} as a mocked read-only POST query`, async ({ page }) => {
    const requests: Array<{
      method: string;
      url: string;
      body: string | null;
    }> = [];
    const publicRoute = rawRegistry.routes.find(
      (route) => route.routeId === id,
    );
    const source = rawRegistry.endpoints.find(
      (item) => item.id === publicRoute?.contract,
    );
    if (!source) throw new Error(`Missing canonical contract ${id}`);
    const production = Boolean(publicRoute?.translation.boundedProduction);
    const response = structuredClone(source.response.example);
    if (production && 'documentos' in response && response.documentos)
      response.documentos[0].codigos.tipo_documento =
        publicRoute?.translation.fixedQuery?.tipo_documento ?? 0;
    await page.route('**/api/v1/**', async (route) => {
      const request = route.request();
      requests.push({
        method: request.method(),
        url: request.url(),
        body: request.postData(),
      });
      await route.fulfill({
        json: response,
        headers: { 'Cache-Control': 'no-store' },
      });
    });
    await page.goto(`/?endpoint=${id}`);
    await configure(page, true);
    await expect(
      page.getByRole('checkbox', { name: /Entiendo que esta operación/ }),
    ).toHaveCount(0);
    await page.locator('#query-id_sucursal').fill('1');
    await page.locator('#query-fecha_desde').fill('1735707600000');
    await page.locator('#query-fecha_hasta').fill('1735794000000');
    if (id === 'finanzas-bancos-movimientos-busquedas') {
      await expect(page.locator('#path-id_banco')).toHaveValue('');
      await page.locator('#path-id_banco').fill('73');
      await expect(page.locator('.notes-list')).toContainText(
        '31 días calendario inclusivos en GMT-0500',
      );
    }
    if (id === 'inventario-kardex-busquedas')
      await page.locator('#query-id_producto').fill('25');
    const editor = page.getByLabel('Cuerpo JSON', { exact: true });
    if (!production) {
      await expect(editor).toHaveValue('{}');
      await expect(page.locator('#query-pagina')).toHaveCount(0);
      await expect(page.locator('#query-estado')).toHaveCount(0);
      await expect(page.locator('#query-id_bodega')).toHaveCount(0);
      await expect(page.locator('.notes-list')).toContainText(
        'proyección SAFE completa',
      );
      await expect(page.locator('.notes-list')).toContainText(
        'No admite columnas, detalle ni paginación',
      );
    } else {
      await expect(page.locator('.notes-list')).toContainText(
        'no consumos reales',
      );
      await expect(page.locator('#query-tipo_documento')).toHaveCount(0);
      await expect(page.locator('#query-pagina')).toHaveCount(1);
      await expect(page.locator('.notes-list')).toContainText(
        '{} no es válido',
      );
      const validBody = await editor.inputValue();
      await editor.fill('{}');
      await page.getByRole('button', { name: 'Enviar solicitud' }).click();
      await expect(page.getByRole('alert')).toContainText(
        'grupos debe ser una lista no vacía',
      );
      expect(requests).toHaveLength(0);
      await editor.fill(validBody);
    }
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0].method).toBe('POST');
    expect(new URL(requests[0].url).searchParams.get('id_sucursal')).toBe('1');
    expect(requests[0].body).not.toContain('confirmation');
    if (!production) {
      expect(requests[0].body).toBe('{}');
      await editor.fill('');
      await page.getByRole('button', { name: 'Enviar solicitud' }).click();
      await expect.poll(() => requests.length).toBe(2);
      expect(requests[1].body).toBeNull();
      const group = source.body.groups?.[0].allowed[0];
      await editor.fill(JSON.stringify({ grupos: [group] }));
      await page.getByRole('button', { name: 'Enviar solicitud' }).click();
      await expect.poll(() => requests.length).toBe(3);
      expect(JSON.parse(requests[2].body ?? '{}')).toEqual({ grupos: [group] });
      await expect(page.locator('.response-panel')).toContainText('request_id');
    }
  });
}

test('preserves order references and nullable document integers and displays the unchanged rejection contract', async ({
  page,
}) => {
  const requests: unknown[] = [];
  await page.route('**/api/v1/**', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 422,
      json: {
        error: 'erp_mutation_rejected',
        message:
          'El ERP rechazó la operación. codigo_error:1050:Producto de ejemplo sin existencia',
        request_id: '0123456789abcdef0123456789abcdef',
        retryable: false,
      },
    });
  });
  await page.goto('/?endpoint=documentos-crear');
  await configure(page, true);
  const editor = page.getByLabel('Cuerpo JSON', { exact: true });
  const body = {
    ...JSON.parse(await editor.inputValue()),
    id_documento: 12345,
    bodega_destino: null,
    emitir_electronicamente: 0,
  };
  await editor.fill(JSON.stringify(body));
  await page
    .getByRole('checkbox', { name: /Entiendo que esta operación/ })
    .check();
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toEqual(body);
  await expect(page.locator('.response-panel')).toContainText(
    'Estado HTTP 422',
  );
  await expect(page.locator('.response-panel')).toContainText(
    'codigo_error:1050:Producto de ejemplo sin existencia',
  );
});

test('sends cost-center queries without body or filters and shows their standard envelope', async ({
  page,
}) => {
  const requests: Array<{ method: string; body: string | null; url: string }> =
    [];
  const response = rawRegistry.endpoints.find(
    (endpoint) => endpoint.id === 'consultarCentro_costo2',
  )?.response.example;
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    requests.push({
      method: request.method(),
      body: request.postData(),
      url: request.url(),
    });
    await route.fulfill({ json: response });
  });
  await page.goto('/?endpoint=organizacion-centros-costo');
  await configure(page, true);
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].method).toBe('GET');
  expect(requests[0].body).toBeNull();
  expect(new URL(requests[0].url).search).toBe('');
  await expect(page.locator('.response-panel')).toContainText(
    'nombre_centro_costo',
  );
  await expect(page.locator('.response-panel')).toContainText('request_id');
});

test('sends reduced-header restaurant queries without a body or unused credentials', async ({
  page,
}) => {
  const requests: Array<{
    headers: Record<string, string>;
    body: string | null;
  }> = [];
  await page.route('**/api/v1/**', async (route) => {
    requests.push({
      headers: route.request().headers(),
      body: route.request().postData(),
    });
    await route.fulfill({ json: { comandas: [] } });
  });
  await page.goto('/?endpoint=restaurante-comandas-busquedas');
  await configure(page);
  await page.getByLabel('Cuerpo JSON', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].body).toBeNull();
  expect(requests[0].headers.authorization).toBe('Bearer example-token');
  expect(requests[0].headers['x-auth-token-empresa']).toBe('example-company');
  expect(requests[0].headers['content-type']).toBe('application/json');
  for (const name of ['x-id-empleado', 'x-auth-token-sucursal', 'x-gtm']) {
    expect(requests[0].headers[name]).toBeUndefined();
  }
});

test('requires confirmation for document cancellation and preserves financial datetimes', async ({
  page,
}) => {
  const requests: Array<{ url: string; method: string; body: string | null }> =
    [];
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    requests.push({
      url: request.url(),
      method: request.method(),
      body: request.postData(),
    });
    await route.fulfill({ json: { success: true, status: 'ANULADO' } });
  });
  await page.goto('/?endpoint=documentos-anular');
  await configure(page, true);
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Confirma explícitamente',
  );
  expect(requests).toHaveLength(0);
  await page
    .getByRole('checkbox', { name: /Entiendo que esta operación/ })
    .check();
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].method).toBe('POST');
  expect(requests[0].url).toMatch(
    /\/api\/v1\/documentos\/\d+\/anulaciones\/\d+$/,
  );
  expect(requests[0].body).toBeNull();

  await page.goto('/?endpoint=finanzas-anticipos-crear');
  await configure(page, true);
  const editor = page.getByLabel('Cuerpo JSON', { exact: true });
  const body = JSON.parse(await editor.inputValue());
  body.fecha_registro = '2026-10-21T15:30:00';
  await editor.fill(JSON.stringify(body));
  await expect(
    page.getByRole('checkbox', { name: /Entiendo que esta operación/ }),
  ).not.toBeChecked();
  await page
    .getByRole('checkbox', { name: /Entiendo que esta operación/ })
    .check();
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(JSON.parse(requests[1].body ?? '{}').fecha_registro).toBe(
    '2026-10-21T15:30:00',
  );
});
