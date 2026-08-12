import { expect, type Page, test } from '@playwright/test';

const openIndexOnMobile = async (page: Page) => {
  if (test.info().project.name === 'mobile') {
    await page.getByRole('button', { name: 'Índice' }).click();
  }
};

test('publica la skill MCP para descarga e instalación', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Instalar skill del MCP' }).click();

  const dialog = page.getByRole('dialog', { name: 'Instalar skill del MCP' });
  const skillDownload = dialog.getByRole('link', {
    name: 'Descargar skill',
  });
  await expect(skillDownload).toHaveAttribute(
    'href',
    /\/skills\/cuenti-mcp\.zip$/,
  );
  await expect(skillDownload).toHaveAttribute('download', 'cuenti-mcp.zip');
  await expect(dialog.getByText(/\.agents\/skills/)).toBeVisible();

  const packageResponse = await page.request.get(
    await skillDownload.getAttribute('href'),
  );
  expect(packageResponse.ok()).toBe(true);
  expect(packageResponse.headers()['content-type']).toContain(
    'application/zip',
  );
  expect((await packageResponse.body()).length).toBeGreaterThan(1000);
});

test('adapta el valor del Select al cambiar de tema', async ({ page }) => {
  await page.goto('/?endpoint=buscarCategorias');

  const selectValue = page
    .locator('#query-es_activo')
    .locator('xpath=..')
    .locator('[data-slot="select-value"]');

  await expect(selectValue).toHaveText('1');
  await expect(selectValue).toHaveCSS('color', 'rgb(24, 33, 52)');

  await page
    .getByRole('checkbox', { name: 'Cambiar a modo oscuro' })
    .check({ force: true });

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(selectValue).toHaveCSS('color', 'rgb(220, 229, 245)');
  await expect(selectValue).toHaveCSS('transition-property', 'color');
});

test('muestra la interfaz en español y ejecuta GET y POST', async ({
  page,
}) => {
  const requests: Array<{ method: string; headers: Record<string, string> }> =
    [];
  await page.route('**/jServerj4ErpPro/**', async (route) => {
    const request = route.request();
    requests.push({ method: request.method(), headers: request.headers() });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'X-Cache': 'MISS' },
      body: JSON.stringify({ resultados: [] }),
    });
  });

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.topbar')).toHaveCSS(
    'background-color',
    'rgb(247, 249, 252)',
  );
  await expect(page.locator('.sidebar')).toHaveCSS(
    'background-color',
    'rgb(247, 249, 252)',
  );
  await expect(page.locator('main')).toHaveCSS(
    'background-color',
    'rgb(237, 241, 245)',
  );
  await expect(page.locator('.route-bar')).toHaveCSS(
    'background-color',
    'rgb(220, 232, 244)',
  );
  await expect(page.locator('.code-block').first()).toHaveCSS(
    'background-color',
    'rgb(233, 238, 243)',
  );

  const exampleGridBox = await page.locator('.example-grid').boundingBox();
  const responseCardBox = await page.locator('.response-card').boundingBox();
  const responseCodeBox = await page
    .locator('.response-card .code-block')
    .boundingBox();

  expect(exampleGridBox).not.toBeNull();
  expect(responseCardBox).not.toBeNull();
  expect(responseCodeBox).not.toBeNull();
  if (!exampleGridBox || !responseCardBox || !responseCodeBox) {
    throw new Error('No se pudo medir el ejemplo de respuesta.');
  }
  expect(responseCardBox.width).toBeGreaterThan(exampleGridBox.width * 0.95);
  expect(responseCodeBox.width).toBeGreaterThan(responseCardBox.width * 0.85);
  expect(responseCodeBox.y + responseCodeBox.height).toBeLessThanOrEqual(
    responseCardBox.y + responseCardBox.height,
  );

  if (test.info().project.name !== 'mobile') {
    const sidebarBox = await page.locator('.sidebar').boundingBox();
    const topbarBox = await page.locator('.topbar').boundingBox();
    const mainBox = await page.locator('main').boundingBox();
    const viewport = page.viewportSize();

    expect(sidebarBox).not.toBeNull();
    expect(topbarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (!sidebarBox || !topbarBox || !mainBox || !viewport) {
      throw new Error('No se pudo medir el layout desktop.');
    }
    expect(sidebarBox.x).toBe(0);
    expect(sidebarBox.y).toBe(0);
    expect(sidebarBox.height).toBe(viewport.height);
    expect(topbarBox.x).toBe(sidebarBox.width);
    expect(topbarBox.y).toBe(0);
    expect(topbarBox.width).toBe(viewport.width - sidebarBox.width);
    expect(mainBox.x).toBe(sidebarBox.width);
    expect(mainBox.y).toBe(topbarBox.height);
    expect(mainBox.width).toBe(topbarBox.width);

    const themeSwitchBox = await page.locator('.theme-switch').boundingBox();
    const credentialsBox = await page
      .locator('.credentials-trigger')
      .boundingBox();
    expect(themeSwitchBox).not.toBeNull();
    expect(credentialsBox).not.toBeNull();
    if (!themeSwitchBox || !credentialsBox) {
      throw new Error('No se pudo medir la separación de acciones del topbar.');
    }
    expect(
      credentialsBox.x - (themeSwitchBox.x + themeSwitchBox.width),
    ).toBeGreaterThanOrEqual(12);
  }
  const themeButton = page.getByRole('checkbox', {
    name: 'Cambiar a modo oscuro',
  });
  await themeButton.check({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.sidebar')).toHaveCSS(
    'background-color',
    'rgb(13, 32, 66)',
  );
  await expect(page.locator('.route-bar')).toHaveCSS(
    'background-color',
    'rgb(9, 21, 44)',
  );
  await expect(page.locator('.code-block').first()).toHaveCSS(
    'background-color',
    'rgb(9, 21, 44)',
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .getByRole('checkbox', { name: 'Cambiar a modo claro' })
    .uncheck({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle('Guía de integración de Cuenti');
  await expect(
    page.getByRole('heading', { name: '19 operaciones' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Probar consulta' }),
  ).toBeVisible();
  await expect(
    page.getByText('http://localhost:8081/jServerj4ErpPro', { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText(/todos deben cumplirse simultáneamente mediante AND/)
      .first(),
  ).toBeVisible();
  await expect(page.getByText('PUBLIC_TRY_IT_ENABLED=true')).toHaveCount(0);
  await expect(page.getByText('ERP_PROXY_TARGET')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Enviar solicitud' }),
  ).toBeDisabled();

  const topbar = page.locator('header.topbar');
  await topbar.getByRole('button', { name: /Credenciales/i }).click();
  const credentialsDialog = page.getByRole('dialog', {
    name: 'Contexto y credenciales',
  });
  await credentialsDialog.getByLabel('Empresa *').fill('empresa-e2e');
  await expect(credentialsDialog.getByLabel('Zona horaria *')).toHaveValue(
    'GMT-0500',
  );
  await credentialsDialog.getByLabel('Token *').fill('Bearer Bearer token-e2e');
  await credentialsDialog.getByLabel('Sucursal *').fill('1');
  await credentialsDialog.getByLabel('Empleado *').fill('7');
  await credentialsDialog
    .getByRole('button', { name: 'Usar configuración' })
    .click();
  await page.getByLabel('id_sucursal *').fill('1');
  await page.getByLabel('pagina *').fill('0');
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();

  await openIndexOnMobile(page);
  await page.getByRole('button', { name: /^Categorías e impuestos/ }).click();
  await page.getByRole('button', { name: /Buscar categorías/i }).click();
  await expect(page).toHaveURL(/endpoint=buscarCategorias/);
  await topbar.getByRole('button', { name: /Credenciales/i }).click();
  await expect(credentialsDialog.getByLabel('Empresa *')).toHaveValue(
    'empresa-e2e',
  );
  await expect(credentialsDialog.getByLabel('Token *')).toHaveValue(
    'Bearer Bearer token-e2e',
  );
  await expect(credentialsDialog.getByLabel('Sucursal *')).toHaveValue('1');
  await expect(credentialsDialog.getByLabel('Empleado *')).toHaveValue('7');
  await credentialsDialog
    .getByRole('button', { name: 'Usar configuración' })
    .click();
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();

  const postBadge = page.locator('.method-post').first();
  await expect(postBadge).toHaveCSS('background-color', 'rgb(255, 243, 196)');
  await page
    .getByRole('checkbox', { name: 'Cambiar a modo oscuro' })
    .check({ force: true });
  await expect(postBadge).toHaveCSS('background-color', 'rgb(91, 76, 28)');
  await page
    .getByRole('checkbox', { name: 'Cambiar a modo claro' })
    .uncheck({ force: true });

  expect(requests.map((request) => request.method)).toEqual(['GET', 'POST']);
  for (const request of requests) {
    expect(request.headers['x-auth-token-empresa']).toBe('empresa-e2e');
    expect(request.headers['x-auth-token-sucursal']).toBe('1');
    expect(request.headers['x-id-empleado']).toBe('7');
    expect(request.headers['x-gtm']).toBe('GMT-0500');
    expect(request.headers.authorization).toBe('Bearer token-e2e');
  }
});
