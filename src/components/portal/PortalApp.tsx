import { TooltipProvider } from '@cuenti-dna/react/tooltip';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import '../../App.css';
import { type PageState, pageStateFromLocation } from '../../app/page-state';
import {
  emptyCredentials,
  proxyBaseUrl,
  serverApiUrl,
  serverOrigin,
  tryItEnabled,
} from '../../app/runtime';
import { CatalogGuide } from '../../CatalogGuide';
import { McpGuide } from '../../McpGuide';
import type { EndpointCategory, EndpointDoc } from '../../model';
import { catalogGuideUrl, endpointUrl, mcpGuideUrl } from '../../navigation';
import { registry } from '../../registry';
import { type Credentials, hasRequiredCredentials } from '../../request';
import { filterEndpoints } from '../../search';
import { applyTheme, persistTheme, readTheme } from '../../theme';
import { EndpointDetail } from '../endpoint-documentation/EndpointDetail';
import { CredentialsModal } from '../modals/CredentialsModal';
import { SkillInstallModal } from '../modals/SkillInstallModal';
import { PortalSidebar } from './PortalSidebar';
import { PortalTopbar } from './PortalTopbar';

const endpointIds = new Set(registry.endpoints.map((endpoint) => endpoint.id));
const fallbackId = registry.endpoints[0]?.id ?? '';

const PortalApp = () => {
  const [page, setPage] = useState<PageState>(() =>
    pageStateFromLocation(window.location, endpointIds, fallbackId),
  );
  const initialCategory = registry.endpoints.find(
    (endpoint) =>
      endpoint.id === (page.kind === 'endpoint' ? page.id : undefined),
  )?.category;
  const [expandedCategories, setExpandedCategories] = useState<
    Set<EndpointCategory>
  >(() => {
    const category = initialCategory ?? registry.endpoints[0]?.category;
    return category ? new Set([category]) : new Set();
  });
  const [search, setSearch] = useState('');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [skillInstallOpen, setSkillInstallOpen] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>(emptyCredentials);
  const [theme, setTheme] = useState(readTheme);
  const deferredSearch = useDeferredValue(search);
  const filteredEndpoints = filterEndpoints(registry.endpoints, deferredSearch);
  const selectedEndpoint =
    registry.endpoints.find(
      (endpoint) =>
        endpoint.id === (page.kind === 'endpoint' ? page.id : undefined),
    ) ?? registry.endpoints[0];

  useEffect(() => {
    const onPopState = () => {
      startTransition(() =>
        setPage(
          pageStateFromLocation(window.location, endpointIds, fallbackId),
        ),
      );
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => applyTheme(theme), [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    persistTheme(nextTheme);
    setTheme(nextTheme);
  };

  const selectEndpoint = (endpoint: EndpointDoc) => {
    window.history.pushState({}, '', endpointUrl(window.location, endpoint.id));
    setExpandedCategories((current) => {
      if (current.has(endpoint.category)) return current;
      return new Set(current).add(endpoint.category);
    });
    startTransition(() => {
      setPage({ kind: 'endpoint', id: endpoint.id });
      setNavigationOpen(false);
    });
    document.getElementById('main-content')?.focus();
  };

  const selectMcpGuide = () => {
    window.history.pushState({}, '', mcpGuideUrl(window.location));
    startTransition(() => {
      setPage({ kind: 'mcp' });
      setNavigationOpen(false);
    });
    document.getElementById('main-content')?.focus();
  };

  const selectCatalogGuide = () => {
    window.history.pushState({}, '', catalogGuideUrl(window.location));
    startTransition(() => {
      setPage({ kind: 'catalog' });
      setNavigationOpen(false);
    });
    document.getElementById('main-content')?.focus();
  };

  const toggleCategory = (category: EndpointCategory) => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (!selectedEndpoint)
    return <p>El registro canónico no contiene operaciones.</p>;

  const serverUrl = serverApiUrl(selectedEndpoint, serverOrigin);

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={`app-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}
      >
        <a className="skip-link" href="#main-content">
          Saltar al contenido
        </a>
        <PortalTopbar
          serverUrl={serverUrl}
          theme={theme}
          skillInstallOpen={skillInstallOpen}
          credentialsOpen={credentialsOpen}
          credentialsReady={hasRequiredCredentials(credentials)}
          navigationOpen={navigationOpen}
          onToggleTheme={toggleTheme}
          onOpenSkill={() => setSkillInstallOpen(true)}
          onOpenCredentials={() => setCredentialsOpen(true)}
          onToggleNavigation={() => setNavigationOpen((open) => !open)}
        />

        <CredentialsModal
          open={credentialsOpen}
          credentials={credentials}
          onChange={setCredentials}
          onClose={() => setCredentialsOpen(false)}
        />
        <SkillInstallModal
          open={skillInstallOpen}
          onClose={() => setSkillInstallOpen(false)}
        />

        <PortalSidebar
          navigationOpen={navigationOpen}
          sidebarCollapsed={sidebarCollapsed}
          search={search}
          filteredEndpoints={filteredEndpoints}
          selectedEndpoint={selectedEndpoint}
          pageKind={page.kind}
          expandedCategories={expandedCategories}
          onToggleCollapsed={() =>
            setSidebarCollapsed((collapsed) => !collapsed)
          }
          onSearchChange={setSearch}
          onSelectMcpGuide={selectMcpGuide}
          onSelectCatalogGuide={selectCatalogGuide}
          onToggleCategory={toggleCategory}
          onSelectEndpoint={selectEndpoint}
        />

        <main id="main-content" tabIndex={-1}>
          {page.kind === 'catalog' ? (
            <CatalogGuide />
          ) : page.kind === 'mcp' ? (
            <McpGuide />
          ) : (
            <EndpointDetail
              endpoint={selectedEndpoint}
              enabled={tryItEnabled}
              proxyBaseUrl={proxyBaseUrl}
              curlBaseUrl={serverOrigin}
              credentials={credentials}
            />
          )}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default PortalApp;
