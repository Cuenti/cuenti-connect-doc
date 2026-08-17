import { Button } from '@cuenti-dna/react/button';
import { Input } from '@cuenti-dna/react/input';
import { CuentiIsotype } from '@cuenti-dna/react/isotype';
import { CuentiLogo } from '@cuenti-dna/react/logo';
import type { EndpointCategory, EndpointDoc } from '../../model';
import { categories } from '../../model';
import { EndpointMethodBadge } from '../endpoint-documentation/EndpointMethodBadge';

const categoryPanelId = (category: EndpointCategory) =>
  `nav-group-${category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

const NavigationIcon = ({ kind }: { kind: string }) => {
  const paths: Record<string, React.ReactNode> = {
    mcp: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3m0-14-3 3M8 16l-3 3" />
      </>
    ),
    catalog: (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    'Productos e inventario': (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </>
    ),
    'Categorías e impuestos': (
      <>
        <path d="M4 4h7v7H4zM13 13h7v7h-7z" />
        <path d="m14 4 6 6M20 4l-6 6M4 16h7" />
      </>
    ),
    Terceros: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2" />
        <path d="M3 20c0-4 2-6 6-6s6 2 6 6M15 15c3 0 5 2 5 5" />
      </>
    ),
    Maestros: (
      <>
        <path d="M5 3h14v18H5z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </>
    ),
    'Facturas e historiales': (
      <>
        <path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" />
        <path d="M9 8h6M9 12h6" />
      </>
    ),
    Cartera: (
      <>
        <path d="M3 7h18v12H3z" />
        <path d="M3 10h18M16 15h2" />
      </>
    ),
    Comandas: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
  };
  return (
    <svg aria-hidden="true" className="navigation-icon" viewBox="0 0 24 24">
      {paths[kind] ?? paths.catalog}
    </svg>
  );
};

export const PortalSidebar = ({
  navigationOpen,
  sidebarCollapsed,
  search,
  filteredEndpoints,
  selectedEndpoint,
  pageKind,
  expandedCategories,
  onToggleCollapsed,
  onSearchChange,
  onSelectMcpGuide,
  onSelectCatalogGuide,
  onToggleCategory,
  onSelectEndpoint,
}: {
  navigationOpen: boolean;
  sidebarCollapsed: boolean;
  search: string;
  filteredEndpoints: EndpointDoc[];
  selectedEndpoint: EndpointDoc;
  pageKind: 'endpoint' | 'mcp' | 'catalog';
  expandedCategories: Set<EndpointCategory>;
  onToggleCollapsed: () => void;
  onSearchChange: (value: string) => void;
  onSelectMcpGuide: () => void;
  onSelectCatalogGuide: () => void;
  onToggleCategory: (category: EndpointCategory) => void;
  onSelectEndpoint: (endpoint: EndpointDoc) => void;
}) => (
  <aside
    id="endpoint-navigation"
    className={`sidebar ${navigationOpen ? 'sidebar-open' : ''}`}
  >
    <div className="sidebar-header">
      <Button
        type="button"
        className="sidebar-brand-control"
        variant="ghost"
        aria-label={
          sidebarCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'
        }
        aria-expanded={!sidebarCollapsed}
        onClick={onToggleCollapsed}
      >
        {sidebarCollapsed ? (
          <CuentiIsotype
            className="sidebar-isotype"
            color="default"
            size="sm"
            aria-hidden="true"
          />
        ) : (
          <>
            <CuentiLogo
              className="sidebar-logo"
              color="white"
              size="md"
              aria-hidden="true"
            />
            <span>Documentación Cuenti Connect</span>
          </>
        )}
      </Button>
      <div className="sidebar-mobile-brand">
        <CuentiLogo color="white" size="md" aria-label="Cuenti" />
        <span>Documentación Cuenti Connect</span>
      </div>
    </div>
    <div className="sidebar-intro">
      <p className="eyebrow">Índice implementado</p>
      <h2>{filteredEndpoints.length} operaciones</h2>
    </div>
    <label className="search-label" htmlFor="endpoint-search">
      <span className="sr-only">Buscar operaciones</span>
      <Input
        id="endpoint-search"
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Ruta, filtro, grupo, columna..."
        aria-describedby="search-results"
      />
    </label>
    <p id="search-results" className="search-count" aria-live="polite">
      {filteredEndpoints.length} resultados
    </p>
    <nav aria-label="Operaciones implementadas">
      <button
        type="button"
        className={`guide-link${pageKind === 'mcp' ? ' active' : ''}`}
        aria-label="Guía de conexión MCP"
        aria-current={pageKind === 'mcp' ? 'page' : undefined}
        onClick={onSelectMcpGuide}
      >
        <NavigationIcon kind="mcp" />
        <span className="guide-link-label">Guía de conexión MCP</span>
      </button>
      <button
        type="button"
        className={`guide-link${pageKind === 'catalog' ? ' active' : ''}`}
        aria-label="Catálogos y valores"
        aria-current={pageKind === 'catalog' ? 'page' : undefined}
        onClick={onSelectCatalogGuide}
      >
        <NavigationIcon kind="catalog" />
        <span className="guide-link-label">Catálogos y valores</span>
      </button>
      {categories.map((category) => {
        const endpoints = filteredEndpoints.filter(
          (endpoint) => endpoint.category === category,
        );
        if (!endpoints.length) return null;
        const panelId = categoryPanelId(category);
        const isExpanded =
          search.trim().length > 0 || expandedCategories.has(category);
        return (
          <section className="nav-group" key={category}>
            <h3>
              <button
                type="button"
                className="nav-group-toggle"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-label={sidebarCollapsed ? category : undefined}
                title={sidebarCollapsed ? category : undefined}
                onClick={() => {
                  if (sidebarCollapsed) onToggleCollapsed();
                  onToggleCategory(category);
                }}
              >
                <NavigationIcon kind={category} />
                <span className="nav-group-title">{category}</span>
                <span className="nav-group-count">{endpoints.length}</span>
                <span
                  className={`nav-group-chevron ${isExpanded ? 'is-open' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isExpanded ? (
              <ul id={panelId}>
                {endpoints.map((endpoint) => (
                  <li key={endpoint.id}>
                    <button
                      type="button"
                      className={
                        endpoint.id === selectedEndpoint.id
                          ? 'endpoint-link active'
                          : 'endpoint-link'
                      }
                      aria-current={
                        endpoint.id === selectedEndpoint.id ? 'page' : undefined
                      }
                      onClick={() => onSelectEndpoint(endpoint)}
                    >
                      <EndpointMethodBadge method={endpoint.method} />
                      <span>{endpoint.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </nav>
  </aside>
);
