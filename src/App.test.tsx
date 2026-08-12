import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App, { isTryItEnabled } from './App';

const openCategory = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) => {
  const toggle = screen.getByRole('button', { name: new RegExp(`^${name}`) });
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

    expect(document.querySelector('.sidebar .sidebar-logo')).toBeVisible();
    expect(document.querySelector('.sidebar .sidebar-logo')).toHaveAttribute(
      'aria-label',
      'Cuenti',
    );
  });

  it('renders a collapsed index and opens endpoint groups on demand', async () => {
    const user = userEvent.setup();
    render(<App />);
    const navigation = screen.getByRole('navigation', {
      name: 'Operaciones implementadas',
    });
    expect(
      screen.getByRole('button', { name: /^Productos e inventario/ }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('button', { name: /^Facturas e historiales/ }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(navigation).queryByRole('button', {
        name: /Buscar transacciones/i,
      }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /^Facturas e historiales/ }),
    );
    expect(
      within(navigation).getByRole('button', {
        name: /Buscar transacciones/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '19 operaciones' }),
    ).toBeVisible();
  });

  it('hides the server base prefix from the displayed route', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Categorías e impuestos');
    await user.click(
      screen.getByRole('button', { name: /Buscar categorías/i }),
    );

    const displayedRoute = document.querySelector('.route-bar code');
    expect(displayedRoute).toHaveTextContent(
      '/com/j4ErpPro/server/inv/categoria/buscarCategorias',
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

  it('shows functional descriptions for columns on hover and groups on focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openCategory(user, 'Categorías e impuestos');
    await user.click(
      screen.getByRole('button', { name: /Buscar categorías/i }),
    );
    const categoryColumn = screen.getByRole('button', { name: 'id_categoria' });
    await user.hover(categoryColumn);
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Identificador único de la categoría.',
    );

    await openCategory(user, 'Comandas');
    await user.click(screen.getByRole('button', { name: /Obtener comandas/i }));
    const productGroup = screen.getByRole('button', { name: 'producto' });
    productGroup.focus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Identificación, descripción y presentación del producto.',
    );
  });

  it('updates selection in the URL and responds to browser history', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openCategory(user, 'Cartera');
    await user.click(
      screen.getByRole('button', {
        name: /Buscar cuentas por cobrar y pagar/i,
      }),
    );
    expect(new URLSearchParams(window.location.search).get('endpoint')).toBe(
      'buscarCartera',
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Buscar cuentas por cobrar y pagar',
      }),
    ).toBeVisible();

    window.history.pushState({}, '', '?endpoint=buscarCategorias');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Buscar categorías',
      }),
    ).toBeVisible();
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
    await user.type(within(dialog).getByLabelText('Empresa *'), 'empresa-1');
    await user.type(within(dialog).getByLabelText('Token *'), 'token-1');
    expect(within(dialog).getByLabelText('Zona horaria *')).toHaveValue(
      'GMT-0500',
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Usar configuración' }),
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Credenciales/i }));
    expect(screen.getByLabelText('Empresa *')).toHaveValue('empresa-1');
    expect(screen.getByLabelText('Token *')).toHaveValue('token-1');
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
    await user.click(
      within(dialog).getByRole('button', { name: 'Usar configuración' }),
    );

    expect(sendButton).toBeEnabled();
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
    ).toBeGreaterThan(
      0,
    );
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
    expect(screen.getByText(/\/jServerj4ErpPro$/)).toBeVisible();
    expect(
      screen.getAllByText(/todos deben cumplirse simultáneamente mediante AND/),
    ).not.toHaveLength(0);
    expect(
      screen.queryByText('PUBLIC_TRY_IT_ENABLED=true'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ERP_PROXY_TARGET')).not.toBeInTheDocument();
    expect(
      screen.queryByText('17 consultas con caché · 2 mutaciones sin caché'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Try It')).not.toBeInTheDocument();
    expect(screen.queryByText('Query params')).not.toBeInTheDocument();
  });

  it('renders useful validation rules instead of generic placeholders', () => {
    render(<App />);

    expect(screen.queryByText('Validación 1')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'id_producto debe ser mayor que cero cuando se proporciona.',
      ),
    ).toBeVisible();
  });

  it('enables interactive requests by default only in development', () => {
    expect(isTryItEnabled(undefined, true)).toBe(true);
    expect(isTryItEnabled('false', true)).toBe(false);
    expect(isTryItEnabled(undefined, false)).toBe(false);
    expect(isTryItEnabled('true', false)).toBe(true);
  });
});
