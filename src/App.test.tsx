import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App, { isTryItEnabled } from './App';

const openCategory = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) => {
  const toggle = screen.getByRole('button', {
    name: new RegExp(`^${name}\\d+$`),
  });
  if (toggle.getAttribute('aria-expanded') === 'false') {
    await user.click(toggle);
  }
};

describe('documentation application', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('uses light mode by default and persists the dark preference', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeSwitch = screen.getByRole('checkbox', {
      name: 'Cambiar a modo oscuro',
    });
    expect(themeSwitch).toBeVisible();
    expect(screen.queryByText('Modo claro')).not.toBeInTheDocument();
    expect(screen.queryByText('Modo oscuro')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.theme-icon')).toHaveLength(2);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(themeSwitch);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('cuenti-erp-docs-theme')).toBe('dark');
    expect(
      screen.getByRole('checkbox', { name: 'Cambiar a modo claro' }),
    ).toBeVisible();
  });

  it('renders the Cuenti logo in the sidebar', () => {
    render(<App />);

    expect(
      document.querySelector('.sidebar-brand-control .sidebar-logo'),
    ).toBeVisible();
    expect(
      document.querySelector('.sidebar-brand-control .sidebar-logo'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('collapses and expands the desktop sidebar accessibly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Contraer barra lateral' }),
    );

    expect(document.querySelector('.app-shell')).toHaveClass(
      'sidebar-collapsed',
    );
    expect(document.querySelector('.sidebar-isotype')).toBeVisible();
    expect(
      document.querySelector('.sidebar-brand-control .sidebar-logo'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Expandir barra lateral' }),
    ).toHaveAttribute('aria-expanded', 'false');

    await user.click(
      screen.getByRole('button', { name: 'Expandir barra lateral' }),
    );

    expect(document.querySelector('.app-shell')).not.toHaveClass(
      'sidebar-collapsed',
    );
    expect(
      document.querySelector('.sidebar-brand-control .sidebar-logo'),
    ).toBeVisible();
  });

  it('renders a collapsed index and opens endpoint groups on demand', async () => {
    const user = userEvent.setup();
    render(<App />);
    const navigation = screen.getByRole('navigation', {
      name: 'Operaciones implementadas',
    });
    expect(
      screen.getByRole('button', { name: /^Catálogo\d+$/ }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('button', { name: /^Transacciones\d+$/ }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(navigation).queryByRole('button', {
        name: /^POSTBuscar facturas$/i,
      }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /^Transacciones\d+$/ }),
    );
    expect(
      within(navigation).getByRole('button', {
        name: /^POSTBuscar facturas$/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '45 operaciones' }),
    ).toBeVisible();
  });

  it('hides the server base prefix from the displayed route', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Catálogo');
    await user.click(
      screen.getByRole('button', { name: /Buscar categorías/i }),
    );

    const displayedRoute = document.querySelector('.route-bar code');
    expect(displayedRoute).toHaveTextContent(
      '/v1/catalogo/categorias/busquedas',
    );
    expect(displayedRoute).not.toHaveTextContent('/jServerj4ErpPro');
  });

  it('searches by a projected field', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(
      screen.getByRole('textbox', { name: 'Buscar operaciones' }),
      'id_auditoria',
    );
    expect(screen.getByText('1 resultados')).toBeVisible();
    const navigation = screen.getByRole('navigation', {
      name: 'Operaciones implementadas',
    });
    expect(navigation.querySelectorAll('.endpoint-link')).toHaveLength(1);
    expect(
      within(navigation).getByRole('button', {
        name: /Buscar platos eliminados/i,
      }),
    ).toBeVisible();
  });

  it('shows functional descriptions for groups on focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Catálogo');
    await user.click(
      screen.getByRole('button', { name: /Buscar categorías/i }),
    );
    const categoryGroup = screen.getByRole('button', { name: 'categoria' });
    categoryGroup.focus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Categoría comercial asociada al producto.',
    );

    await openCategory(user, 'Restaurante');
    await user.click(screen.getByRole('button', { name: /Obtener comandas/i }));
    const productGroup = screen.getByRole('button', { name: 'producto' });
    productGroup.focus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Identificación, descripción y presentación del producto.',
    );
  });

  it('keeps the API base at the public /api root', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Transacciones');
    await user.click(
      screen.getByRole('button', {
        name: /^POSTCrear factura$/i,
      }),
    );

    const apiBase = document.querySelector('.server-indicator code');
    expect(apiBase).toHaveTextContent(/\/api$/);
    expect(apiBase).not.toHaveTextContent('/jServerj4ErpPro');
  });

  it('shows human-readable body formats instead of regular expressions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Transacciones');
    await user.click(
      screen.getByRole('button', {
        name: /^POSTCrear factura$/i,
      }),
    );

    expect(
      screen.getByText('Formato: solo dígitos, entre 1 y 50 caracteres.'),
    ).toBeVisible();
    expect(document.body).not.toHaveTextContent('^[0-9]{1,50}$');
  });

  it('updates selection in the URL and responds to browser history', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openCategory(user, 'Finanzas y cartera');
    await user.click(
      screen.getByRole('button', {
        name: /^POSTBuscar cuentas por cobrar$/i,
      }),
    );
    expect(new URLSearchParams(window.location.search).get('endpoint')).toBe(
      'finanzas-cartera-cobrar-busquedas',
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Buscar cuentas por cobrar',
      }),
    ).toBeVisible();

    window.history.pushState({}, '', '?endpoint=catalogo-categorias-busquedas');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Buscar categorías',
      }),
    ).toBeVisible();
  });

  it('opens the independent MCP guide and keeps endpoint guidance separate', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Guía de conexión MCP' }),
    );

    expect(new URLSearchParams(window.location.search).get('section')).toBe(
      'mcp',
    );
    expect(
      screen.getByRole('heading', { name: 'Conectar y usar Cuenti MCP' }),
    ).toBeVisible();
    expect(screen.getByText('https://mcp-api.cuenti.co/mcp')).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Elegir type_match_producto' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('objDetalle[].id_producto'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Encabezados' }),
    ).not.toBeInTheDocument();
  });

  it('opens the independent catalog guide with dynamic ID rules and base values', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Catálogos y valores' }),
    );

    expect(new URLSearchParams(window.location.search).get('section')).toBe(
      'catalogos',
    );
    expect(
      screen.getByRole('heading', { name: 'Catálogos y valores base' }),
    ).toBeVisible();
    expect(screen.getByText('id_centro_costo')).toBeVisible();
    expect(screen.getByText('Gran contribuyente')).toBeVisible();
    expect(screen.getByText('No responsable de IVA')).toBeVisible();
    expect(screen.queryByText(/cómo obtenerlo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pregunta al usuario/i)).not.toBeInTheDocument();
  });

  it('shows invoice product matching guidance inside the endpoint documentation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Transacciones');
    await user.click(
      screen.getByRole('button', {
        name: /^POSTCrear factura$/i,
      }),
    );

    expect(
      screen.getByRole('heading', { name: 'Elegir type_match_producto' }),
    ).toBeVisible();
    const guidance = screen
      .getByRole('heading', { name: 'Elegir type_match_producto' })
      .closest('section');
    expect(guidance).not.toBeNull();
    expect(
      within(guidance as HTMLElement).getAllByText('objDetalle[].id_producto'),
    ).toHaveLength(1);
    expect(
      within(guidance as HTMLElement).getAllByText('objDetalle[].code'),
    ).toHaveLength(2);
    expect(screen.getByText('Modo 1: ID interno')).toBeVisible();
  });

  it('does not render capabilities pending implementation', () => {
    render(<App />);
    expect(
      screen.queryByRole('heading', { name: 'Próximamente' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Pendiente de contrato')).not.toBeInTheDocument();
  });

  it('does not persist credentials from application code', () => {
    const forbiddenStorageApi = ['local', 'Storage'].join('');
    expect(App.toString()).not.toContain(forbiddenStorageApi);
  });

  it('opens global credentials from the lock button', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(
      screen.queryByRole('dialog', { name: 'Contexto y credenciales' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Credenciales/i }));
    const dialog = screen.getByRole('dialog', {
      name: 'Contexto y credenciales',
    });
    expect(within(dialog).getByLabelText('Token *')).toHaveClass(
      'border-neutral-500',
      'h-12',
      'rounded-md',
    );
    expect(within(dialog).getByLabelText('Sucursal *')).toHaveClass(
      'border-neutral-500',
      'h-12',
      'rounded-md',
    );
    expect(within(dialog).getByLabelText('Sucursal *')).not.toHaveAttribute(
      'type',
      'password',
    );
    await user.type(within(dialog).getByLabelText('Empresa *'), 'empresa-1');
    await user.type(within(dialog).getByLabelText('Token *'), 'token-1');
    expect(within(dialog).getByLabelText('Zona horaria *')).toHaveValue(
      'GMT-0500',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Credenciales/i }));
    expect(screen.getByLabelText('Empresa *')).toHaveValue('empresa-1');
    expect(screen.getByLabelText('Token *')).toHaveValue('token-1');
  });

  it('copies the top curl anonymously and with active in-memory credentials', async () => {
    const user = userEvent.setup();
    render(<App />);

    const quickStart = screen
      .getByRole('heading', { name: 'Ejecuta esta operación' })
      .closest('section');
    expect(quickStart).not.toBeNull();
    expect(
      quickStart?.querySelector('.curl-code .curl-variable'),
    ).toHaveTextContent('{{id_empresa}}');
    expect(quickStart).toHaveTextContent('Bearer {{token}}');
    expect(quickStart?.querySelector('.curl-code')).toHaveTextContent(
      'GMT-0500',
    );

    await user.click(
      within(quickStart as HTMLElement).getByRole('button', {
        name: 'Copiar curl',
      }),
    );
    expect(await navigator.clipboard.readText()).toContain(
      'X-Auth-Token-empresa: {{id_empresa}}',
    );

    await user.click(screen.getByRole('button', { name: /Credenciales/i }));
    const dialog = screen.getByRole('dialog', {
      name: 'Contexto y credenciales',
    });
    await user.type(within(dialog).getByLabelText('Empresa *'), 'empresa-ui');
    await user.type(within(dialog).getByLabelText('Token *'), 'token-ui');
    await user.type(within(dialog).getByLabelText('Sucursal *'), '3');
    await user.type(within(dialog).getByLabelText('Empleado *'), '9');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));

    expect(
      within(quickStart as HTMLElement).getByText(
        'El comando usa la configuración actual, almacenada solo en memoria.',
      ),
    ).toBeVisible();
    expect(
      within(quickStart as HTMLElement).queryByText('Con credenciales activas'),
    ).not.toBeInTheDocument();
    await user.click(
      within(quickStart as HTMLElement).getByRole('button', {
        name: /Curl copiado|Copiar curl/,
      }),
    );
    expect(await navigator.clipboard.readText()).toContain(
      'X-Auth-Token-empresa: empresa-ui',
    );
    expect(await navigator.clipboard.readText()).toContain(
      'Authorization: Bearer token-ui',
    );
    expect(await navigator.clipboard.readText()).not.toContain('{{token}}');
  });

  it('offers the public MCP skill with installation instructions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Instalar skill del MCP' }),
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Instalar skill del MCP',
    });
    const skillDownload = within(dialog).getByRole('link', {
      name: 'Descargar skill',
    });
    expect(skillDownload).toHaveAttribute(
      'href',
      'http://localhost:3000/skills/cuenti-mcp.zip',
    );
    expect(skillDownload).toHaveAttribute('download', 'cuenti-mcp.zip');
    expect(
      within(dialog).getAllByText(/references\/endpoints\.md/),
    ).toHaveLength(2);
    expect(
      within(dialog).getAllByText(/references\/mcp-guide\.md/),
    ).toHaveLength(2);
    expect(
      within(dialog).getAllByText(/references\/catalogos\.md/),
    ).toHaveLength(2);
    expect(within(dialog).getByText(/\.agents\/skills/)).toBeVisible();
    expect(
      within(dialog).getByText(/\.config\/opencode\/skills/),
    ).toBeVisible();
  });

  it('blocks requests until credentials are configured and hides status badges', async () => {
    const user = userEvent.setup();
    render(<App />);

    const sendButton = screen.getByRole('button', { name: 'Enviar solicitud' });
    expect(sendButton).toBeDisabled();
    expect(
      screen.getByText(
        'Configura las credenciales desde el candado para habilitar el envío.',
      ),
    ).toBeVisible();
    expect(
      screen.queryByText(/^Probar consulta activo$/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/^Implementado$/)).not.toBeInTheDocument();
    expect(document.querySelector('.topbar-meta')).not.toBeInTheDocument();
    expect(
      document.querySelector('.operational-strip'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Credenciales/i }));
    const dialog = screen.getByRole('dialog', {
      name: 'Contexto y credenciales',
    });
    await user.type(within(dialog).getByLabelText('Empresa *'), 'empresa-1');
    await user.type(within(dialog).getByLabelText('Token *'), 'token-1');
    await user.type(within(dialog).getByLabelText('Sucursal *'), '1');
    await user.type(within(dialog).getByLabelText('Empleado *'), '7');
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));

    expect(sendButton).toBeEnabled();
    expect(document.querySelector('.credentials-status')).toHaveClass(
      'credentials-status-ready',
    );
    expect(
      screen.queryByText(
        'Configura las credenciales desde el candado para habilitar el envío.',
      ),
    ).not.toBeInTheDocument();
  });

  it('renders the visible controls and functional endpoint documentation in Spanish', () => {
    render(<App />);
    expect(
      screen.getAllByText('Documentación Cuenti Connect').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('Documentación API ERP')).not.toBeInTheDocument();
    expect(screen.queryByText('Vía proxy')).not.toBeInTheDocument();
    expect(screen.queryByText('Caché e invalidación')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Encabezados' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Parámetros y filtros' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'Probar consulta',
      }),
    ).toBeVisible();
    expect(screen.getByText(/\/api$/)).toBeVisible();
    expect(
      screen.getAllByText(/Los filtros y columnas desconocidos se rechazan/),
    ).not.toHaveLength(0);
    expect(
      screen.queryByText('PUBLIC_TRY_IT_ENABLED=true'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ERP_PROXY_TARGET')).not.toBeInTheDocument();
    expect(
      screen.queryByText('24 consultas con caché · 4 mutaciones sin caché'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Try It')).not.toBeInTheDocument();
    expect(screen.queryByText('Query params')).not.toBeInTheDocument();
  });

  it('renders useful validation rules instead of generic placeholders', () => {
    render(<App />);

    expect(screen.queryByText('Validación 1')).not.toBeInTheDocument();
    expect(
      screen.getByText('Los filtros y columnas desconocidos se rechazan.'),
    ).toBeVisible();
  });

  it('presents preset options as readable fields instead of JSON', () => {
    render(<App />);

    expect(screen.getAllByText('Filtros').length).toBeGreaterThan(0);
    expect(
      document.querySelector('.preset-docs .json-code'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('.preset-docs .preset-value-list'),
    ).toBeInTheDocument();
  });

  it('enables interactive requests by default only in development', () => {
    expect(isTryItEnabled(undefined, true)).toBe(true);
    expect(isTryItEnabled('false', true)).toBe(false);
    expect(isTryItEnabled(undefined, false)).toBe(false);
    expect(isTryItEnabled('true', false)).toBe(true);
  });
});
