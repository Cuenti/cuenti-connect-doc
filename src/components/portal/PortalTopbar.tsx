import { Button } from '@cuenti-dna/react/button';
import { Switch } from '@cuenti-dna/react/switch';
import type { ColorTheme } from '../../theme';

const LockIcon = () => (
  <svg
    aria-hidden="true"
    className="lock-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    aria-hidden="true"
    className="download-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
    <path d="M5 20h14" />
  </svg>
);

const SunIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden="true"
    className={`theme-icon theme-icon-sun${active ? ' is-active' : ''}`}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden="true"
    className={`theme-icon theme-icon-moon${active ? ' is-active' : ''}`}
    viewBox="0 0 24 24"
  >
    <path d="M20.7 15.1A8.5 8.5 0 0 1 8.9 3.3 8.5 8.5 0 1 0 20.7 15Z" />
  </svg>
);

export const PortalTopbar = ({
  serverUrl,
  theme,
  skillInstallOpen,
  credentialsOpen,
  credentialsReady,
  navigationOpen,
  onToggleTheme,
  onOpenSkill,
  onOpenCredentials,
  onToggleNavigation,
}: {
  serverUrl: string;
  theme: ColorTheme;
  skillInstallOpen: boolean;
  credentialsOpen: boolean;
  credentialsReady: boolean;
  navigationOpen: boolean;
  onToggleTheme: () => void;
  onOpenSkill: () => void;
  onOpenCredentials: () => void;
  onToggleNavigation: () => void;
}) => (
  <header className="topbar">
    <div className="server-indicator">
      <span className="server-indicator-label">API base</span>
      <code>{serverUrl}</code>
    </div>
    <div className="topbar-actions">
      <Switch
        id="theme-toggle"
        className="theme-switch"
        checked={theme === 'dark'}
        aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        onChange={onToggleTheme}
      >
        <SunIcon active={theme === 'light'} />
        <MoonIcon active={theme === 'dark'} />
      </Switch>
      <Button
        className="skill-trigger"
        variant="outline"
        size="sm"
        aria-haspopup="dialog"
        aria-expanded={skillInstallOpen}
        aria-label="Instalar skill del MCP"
        onClick={onOpenSkill}
      >
        <DownloadIcon />
        <span className="skill-trigger-label">Skill MCP</span>
      </Button>
      <Button
        className="credentials-trigger"
        variant="outline"
        size="sm"
        aria-haspopup="dialog"
        aria-expanded={credentialsOpen}
        aria-label="Configurar credenciales"
        onClick={onOpenCredentials}
      >
        <LockIcon />
        <span>Credenciales</span>
        <span
          className={`credentials-status ${
            credentialsReady ? 'credentials-status-ready' : ''
          }`}
          aria-hidden="true"
        />
      </Button>
      <Button
        className="mobile-menu"
        variant="outline"
        size="sm"
        aria-expanded={navigationOpen}
        aria-controls="endpoint-navigation"
        onClick={onToggleNavigation}
      >
        {navigationOpen ? 'Cerrar' : 'Índice'}
      </Button>
    </div>
  </header>
);
