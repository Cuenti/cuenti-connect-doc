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
  await expect(selectValue).toHaveCSS('color', 'rgb(26, 38, 68)');

  await page
    .getByRole('checkbox', { name: 'Cambiar a modo oscuro' })
    .check({ force: true });

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(selectValue).toHaveCSS('color', 'rgb(220, 221, 236)');
  await expect(selectValue).toHaveCSS('transition-property', 'color');
});

test('mantiene el inicio rápido después del título entre 1100 y 1250 px', async ({
  page,
}) => {
  test.skip(test.info().project.name === 'mobile');

  for (const width of [1100, 1175, 1250]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const heroBox = await page.locator('.endpoint-hero').boundingBox();
    const titleBox = await page.locator('.hero-title-row').boundingBox();
    const routeBox = await page.locator('.route-bar').boundingBox();
    const quickStartBox = await page.locator('.quick-start').boundingBox();

    expect(heroBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(routeBox).not.toBeNull();
    expect(quickStartBox).not.toBeNull();
    if (!heroBox || !titleBox || !routeBox || !quickStartBox) {
      throw new Error(`No se pudo medir el hero a ${width}px.`);
    }

    expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(routeBox.y);
    expect(routeBox.y + routeBox.height).toBeLessThanOrEqual(quickStartBox.y);
    expect(quickStartBox.x).toBeGreaterThanOrEqual(heroBox.x);
    expect(quickStartBox.x + quickStartBox.width).toBeLessThanOrEqual(
      heroBox.x + heroBox.width,
    );
  }

  const firstPreset = page.locator('.preset-docs details').first();
  await firstPreset.locator('summary').click();
  await expect(firstPreset.getByRole('heading', { name: 'Filtros' })).toBeVisible();
  await expect(firstPreset.locator('.preset-value-list')).toHaveCount(2);
  await expect(firstPreset.locator('.json-code')).toHaveCount(0);
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
    'rgb(255, 255, 255)',
  );
  await expect(page.locator('.sidebar')).toHaveCSS(
    'background-color',
    'rgb(27, 63, 131)',
  );
  await expect(page.locator('.sidebar-logo path').first()).toHaveAttribute(
    'fill',
    '#ffffff',
  );
  await expect(page.locator('main')).toHaveCSS(
    'background-color',
    'rgb(244, 246, 250)',
  );
  await expect(page.locator('.route-bar')).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  await expect(page.locator('.quick-start')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(page.locator('.method-get').first()).toHaveCSS(
    'background-color',
    'rgb(243, 246, 253)',
  );
  await expect(page.locator('.method-get').first()).toHaveCSS(
    'color',
    'rgb(19, 50, 103)',
  );
  const copyCurlButton = page.locator('.quick-start-footer button');
  await copyCurlButton.click();
  await expect(copyCurlButton).toHaveCSS('outline-style', 'none');
  await expect(copyCurlButton).toHaveCSS('box-shadow', 'none');
  await expect(page.locator('.code-block').first()).toHaveCSS(
    'background-color',
    'rgb(238, 241, 247)',
  );
  await expect(page.locator('.code-block').first()).toHaveCSS(
    'color',
    'rgb(26, 38, 68)',
  );
  await expect(
    page.getByRole('columnheader', { name: 'Predeterminado' }).first(),
  ).toHaveCSS('color', 'rgb(9, 21, 44)');
  const firstSectionIndex = page.locator('.detail-sections .section-index').first();
  await expect(firstSectionIndex).toHaveText('01');
  await expect(firstSectionIndex).toHaveCSS('font-size', '16px');
  await expect(firstSectionIndex).toHaveCSS('line-height', '20px');
  await expect(firstSectionIndex).toHaveCSS('color', 'rgb(128, 99, 0)');
  await expect(page.getByRole('heading', { name: 'Ejecuta esta operación' })).toBeVisible();
  await expect(page.getByText('Con variables Postman')).toHaveCount(0);
  await expect(page.locator('.form-error').first()).toHaveCSS(
    'background-color',
    'rgb(255, 243, 243)',
  );
  await expect(page.locator('.form-error').first()).toHaveCSS(
    'color',
    'rgb(164, 20, 20)',
  );
  await expect(page.locator('.quick-start-code .curl-command')).toHaveText('curl');
  await expect(page.locator('.quick-start-code .curl-method')).toHaveText('GET');
  await expect(page.locator('.quick-start-code .curl-variable').first()).toHaveText(
    '{{id_empresa}}',
  );
  await expect(page.locator('.quick-start')).toContainText('{{id_empresa}}');
  await expect(page.locator('.quick-start')).toContainText('Bearer {{token}}');
  await page.getByLabel('id_sucursal *').fill('');
  await page.getByLabel('pagina *').fill('');
  await expect(page.locator('.quick-start')).toContainText(
    '/{{id_sucursal}}/{{pagina}}',
  );
  await expect(page.locator('.quick-start')).not.toContainText(/%3C|%3E/i);
  await page.evaluate(() => window.scrollTo(0, 0));

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
  expect(responseCardBox.width).toBeGreaterThan(exampleGridBox.width * 0.55);
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

    const collapseButton = page.getByRole('button', {
      name: 'Contraer barra lateral',
    });
    await collapseButton.click();
    await expect(page.locator('.app-shell')).toHaveClass(/sidebar-collapsed/);
    await expect(
      page.getByRole('button', { name: 'Expandir barra lateral' }),
    ).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.sidebar-isotype')).toBeVisible();
    await expect(page.locator('.sidebar-isotype')).toHaveCSS('width', '36px');
    await expect(page.locator('.sidebar-isotype')).toHaveCSS(
      'color',
      'rgb(255, 198, 0)',
    );

    await expect
      .poll(async () => (await page.locator('.sidebar').boundingBox())?.width)
      .toBe(80);
    const collapsedSidebarBox = await page.locator('.sidebar').boundingBox();
    const collapsedMainBox = await page.locator('main').boundingBox();
    expect(collapsedSidebarBox).not.toBeNull();
    expect(collapsedMainBox).not.toBeNull();
    if (!collapsedSidebarBox || !collapsedMainBox) {
      throw new Error('No se pudo medir el índice contraído.');
    }
    expect(collapsedSidebarBox.width).toBe(80);
    expect(collapsedMainBox.x).toBe(80);
    const expandSidebar = page.getByRole('button', {
      name: 'Expandir barra lateral',
    });
    await expandSidebar.hover();
    await expect(expandSidebar).toHaveCSS('cursor', 'pointer');
    await expect(expandSidebar).toHaveCSS(
      'background-color',
      'rgb(18, 42, 87)',
    );
    await expect(expandSidebar).toHaveCSS(
      'border-left-color',
      'rgb(255, 198, 0)',
    );
    await expandSidebar.click();
    await expect(page.locator('.app-shell')).not.toHaveClass(
      /sidebar-collapsed/,
    );
    await expect(page.locator('.sidebar-logo')).toBeVisible();
    await expect
      .poll(async () => (await page.locator('.sidebar').boundingBox())?.width)
      .toBe(304);
    const expandedSidebarBox = await page.locator('.sidebar').boundingBox();
    const sidebarLogoBox = await page.locator('.sidebar-logo').boundingBox();
    expect(expandedSidebarBox).not.toBeNull();
    expect(sidebarLogoBox).not.toBeNull();
    if (!expandedSidebarBox || !sidebarLogoBox) {
      throw new Error('No se pudo medir la marca del índice expandido.');
    }
    const sidebarCenter = expandedSidebarBox.x + expandedSidebarBox.width / 2;
    const logoCenter = sidebarLogoBox.x + sidebarLogoBox.width / 2;
    expect(Math.abs(sidebarCenter - logoCenter)).toBeLessThanOrEqual(1);

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
    'rgb(32, 33, 38)',
  );
  await expect(page.locator('.route-bar')).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  await expect(page.locator('.code-block').first()).toHaveCSS(
    'background-color',
    'rgb(18, 20, 25)',
  );
  await expect(page.locator('.quick-start')).toHaveCSS(
    'background-color',
    'rgb(32, 33, 38)',
  );
  await expect(page.locator('.quick-start')).toHaveCSS(
    'border-right-color',
    'rgb(59, 61, 69)',
  );
  await expect(page.locator('.quick-start')).toHaveCSS(
    'border-top-color',
    'rgb(255, 198, 0)',
  );
  await expect(page.locator('.quick-start-code')).toHaveCSS(
    'background-color',
    'rgb(24, 25, 28)',
  );
  await expect(page.locator('.quick-start-code')).toHaveCSS(
    'scrollbar-color',
    'rgb(80, 83, 93) rgba(0, 0, 0, 0)',
  );
  await expect(page.locator('.method-get').first()).toHaveCSS(
    'background-color',
    'rgb(13, 33, 69)',
  );
  await expect(page.locator('.method-get').first()).toHaveCSS(
    'color',
    'rgb(218, 229, 248)',
  );
  await expect(page.locator('.detail-sections .section-index').first()).toHaveCSS(
    'color',
    'rgb(255, 198, 0)',
  );
  await expect(page.locator('.form-error').first()).toHaveCSS(
    'background-color',
    'rgb(82, 10, 10)',
  );
  await expect(page.locator('.form-error').first()).toHaveCSS(
    'color',
    'rgb(251, 220, 220)',
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .getByRole('checkbox', { name: 'Cambiar a modo claro' })
    .uncheck({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle('Guía de integración de Cuenti');
  await expect(
    page.getByRole('heading', { name: '24 operaciones' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Probar consulta' }),
  ).toBeVisible();
  await expect(page.locator('.quick-start')).toContainText(
    'https://cuenti-connect.cuenti.co/jServerj4ErpPro',
  );
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
    .getByRole('button', { name: 'Aceptar' })
    .click();
  await expect(page.getByText('Con credenciales activas')).toHaveCount(0);
  await expect(page.locator('.quick-start')).toContainText('empresa-e2e');
  await expect(page.locator('.quick-start')).not.toContainText('{{token}}');
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
    .getByRole('button', { name: 'Aceptar' })
    .click();
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();

  const postBadge = page.locator('.method-post').first();
  await expect(postBadge).toHaveCSS('background-color', 'rgb(184, 235, 189)');
  await expect(postBadge).toHaveCSS('color', 'rgb(17, 62, 22)');
  await page
    .getByRole('checkbox', { name: 'Cambiar a modo oscuro' })
    .check({ force: true });
  await expect(postBadge).toHaveCSS('background-color', 'rgb(26, 93, 33)');
  await expect(postBadge).toHaveCSS('color', 'rgb(235, 255, 237)');
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
