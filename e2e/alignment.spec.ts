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
    'restaurante-mesas-ocupadas',
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
