import { Badge } from '@cuenti-dna/react/badge';
import { Button } from '@cuenti-dna/react/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cuenti-dna/react/card';
import { CloseX } from '@cuenti-dna/react/icons';
import { Input } from '@cuenti-dna/react/input';
import { Label } from '@cuenti-dna/react/label';
import { CuentiIsotype } from '@cuenti-dna/react/isotype';
import { CuentiLogo } from '@cuenti-dna/react/logo';
import { Switch } from '@cuenti-dna/react/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@cuenti-dna/react/tooltip';
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import './App.css';
import { CatalogGuide } from './CatalogGuide';
import { CurlCodeBlock } from './CurlCodeBlock';
import { McpGuide } from './McpGuide';
import {
  getFieldDescription,
  getGroupDescription,
} from './fieldDescriptions';
import { JsonCodeBlock } from './JsonCodeBlock';
import {
  categories,
  type EndpointCategory,
  type EndpointDoc,
  type FieldSpec,
  type ParameterSpec,
} from './model';
import {
  endpointFromLocation,
  endpointUrl,
  catalogGuideFromLocation,
  catalogGuideUrl,
  mcpGuideFromLocation,
  mcpGuideUrl,
} from './navigation';
import { registry } from './registry';
import {
  buildCurl,
  type Credentials,
  DEFAULT_TIMEZONE,
  defaultDraft,
  hasRequiredCredentials,
} from './request';
import { filterEndpoints } from './search';
import { TryIt } from './TryIt';
import { applyTheme, persistTheme, readTheme } from './theme';

const proxyBaseUrl = import.meta.env.PUBLIC_PROXY_BASE_URL?.trim() ?? '';
const serverOrigin =
  proxyBaseUrl ||
  (import.meta.env.DEV ? 'http://localhost:8081' : window.location.origin);

const serverApiUrl = (endpoint: EndpointDoc, origin: string) => {
  const baseSegment = endpoint.path.split('/').filter(Boolean)[0];
  const basePath = baseSegment ? `/${baseSegment}` : '';
  return `${origin.replace(/\/+$/, '')}${basePath}`;
};

const categoryPanelId = (category: EndpointCategory) =>
  `nav-group-${category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

export const isTryItEnabled = (
  configuredValue: string | undefined,
  development: boolean,
) => configuredValue === 'true' || (development && configuredValue !== 'false');

const tryItEnabled = isTryItEnabled(
  import.meta.env.PUBLIC_TRY_IT_ENABLED,
  import.meta.env.DEV,
);

const emptyCredentials: Credentials = {
  company: '',
  timezone: DEFAULT_TIMEZONE,
  token: '',
  branch: '',
  employee: '',
};

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

const NavigationIcon = ({ kind }: { kind: string }) => {
  const paths: Record<string, React.ReactNode> = {
    mcp: <><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3m0-14-3 3M8 16l-3 3" /></>,
    catalog: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></>,
    'Productos e inventario': <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    'Categorías e impuestos': <><path d="M4 4h7v7H4zM13 13h7v7h-7z" /><path d="m14 4 6 6M20 4l-6 6M4 16h7" /></>,
    Terceros: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20c0-4 2-6 6-6s6 2 6 6M15 15c3 0 5 2 5 5" /></>,
    Maestros: <><path d="M5 3h14v18H5z" /><path d="M9 7h6M9 11h6M9 15h4" /></>,
    'Facturas e historiales': <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
    Cartera: <><path d="M3 7h18v12H3z" /><path d="M3 10h18M16 15h2" /></>,
    Comandas: <><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  };
  return (
    <svg aria-hidden="true" className="navigation-icon" viewBox="0 0 24 24">
      {paths[kind] ?? paths.catalog}
    </svg>
  );
};

const FieldTooltip = ({
  label,
  description,
  className,
}: {
  label: string;
  description: string;
  className?: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className={className ?? 'field-tooltip-trigger'}
        aria-label={label}
      >
        <code>{label}</code>
      </button>
    </TooltipTrigger>
    <TooltipContent className="field-tooltip-content" side="top">
      {description}
    </TooltipContent>
  </Tooltip>
);

const CredentialsModal = ({
  open,
  credentials,
  onChange,
  onClose,
}: {
  open: boolean;
  credentials: Credentials;
  onChange: (credentials: Credentials) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState(credentials);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) setDraft(credentials);
  }, [open, credentials]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <button
        className="modal-dismiss"
        type="button"
        tabIndex={-1}
        aria-label="Cerrar configuración"
        onClick={onClose}
      />
      <section
        ref={modalRef}
        className="credentials-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credentials-modal-title"
      >
        <header className="credentials-modal-header">
          <div>
            <p className="eyebrow">Configuración global</p>
            <h2 id="credentials-modal-title">Contexto y credenciales</h2>
          </div>
          <button
            className="modal-close"
            type="button"
            aria-label="Cerrar configuración"
            onClick={onClose}
          >
            <CloseX aria-hidden="true" />
          </button>
        </header>
        <p className="credentials-modal-description">
          Estos valores se aplican a todas las solicitudes que realices desde
          esta guía.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange({
              ...credentials,
              company: draft.company,
              timezone: DEFAULT_TIMEZONE,
              token: draft.token,
              branch: draft.branch,
              employee: draft.employee,
            });
            onClose();
          }}
        >
          <div className="credentials-modal-grid">
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-company"
                required
              >
                Empresa
              </Label>
              <Input
                id="global-company"
                value={draft.company}
                onChange={(event) =>
                  setDraft({ ...draft, company: event.target.value })
                }
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-timezone"
                required
              >
                Zona horaria
              </Label>
              <Input
                id="global-timezone"
                value={DEFAULT_TIMEZONE}
                readOnly
                autoComplete="off"
              />
            </div>
            <div className="field-label credentials-modal-token">
              <Label
                className="field-label-title"
                htmlFor="global-token"
                required
              >
                Token
              </Label>
              <Input
                id="global-token"
                type="password"
                value={draft.token}
                onChange={(event) =>
                  setDraft({ ...draft, token: event.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-branch"
                required
              >
                Sucursal
              </Label>
              <Input
                id="global-branch"
                value={draft.branch}
                onChange={(event) =>
                  setDraft({ ...draft, branch: event.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-employee"
                required
              >
                Empleado
              </Label>
              <Input
                id="global-employee"
                value={draft.employee}
                onChange={(event) =>
                  setDraft({ ...draft, employee: event.target.value })
                }
                autoComplete="off"
              />
            </div>
          </div>
          <footer className="credentials-modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Aceptar</Button>
          </footer>
        </form>
      </section>
    </div>
  );
};

const SkillInstallModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLElement>(null);
  const skillUrl = new URL('skills/cuenti-mcp/SKILL.md', document.baseURI).href;
  const catalogUrl = new URL(
    'skills/cuenti-mcp/references/endpoints.md',
    document.baseURI,
  ).href;
  const guideUrl = new URL(
    'skills/cuenti-mcp/references/mcp-guide.md',
    document.baseURI,
  ).href;
  const catalogsUrl = new URL(
    'skills/cuenti-mcp/references/catalogos.md',
    document.baseURI,
  ).href;
  const packageUrl = new URL('skills/cuenti-mcp.zip', document.baseURI).href;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const installCommand = (directory: string) =>
    `mkdir -p ${directory}/references && curl -fsSL '${skillUrl}' -o ${directory}/SKILL.md && curl -fsSL '${catalogUrl}' -o ${directory}/references/endpoints.md && curl -fsSL '${guideUrl}' -o ${directory}/references/mcp-guide.md && curl -fsSL '${catalogsUrl}' -o ${directory}/references/catalogos.md`;
  const sharedInstall = installCommand('~/.agents/skills/cuenti-mcp');
  const openCodeInstall = installCommand(
    '~/.config/opencode/skills/cuenti-mcp',
  );

  return (
    <div className="modal-backdrop">
      <button
        className="modal-dismiss"
        type="button"
        tabIndex={-1}
        aria-label="Cerrar instalación"
        onClick={onClose}
      />
      <section
        ref={modalRef}
        className="credentials-modal skill-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-modal-title"
      >
        <header className="credentials-modal-header">
          <div>
            <p className="eyebrow">Agentes de IA</p>
            <h2 id="skill-modal-title">Instalar skill del MCP</h2>
          </div>
          <button
            className="modal-close"
            type="button"
            aria-label="Cerrar instalación"
            onClick={onClose}
          >
            <CloseX aria-hidden="true" />
          </button>
        </header>
        <p className="credentials-modal-description">
          Descarga un único paquete con las instrucciones, la guía de conexión,
          los catálogos y el catálogo funcional de las 24 herramientas.
        </p>
        <div className="skill-downloads">
          <a
            className="skill-download"
            href={packageUrl}
            download="cuenti-mcp.zip"
          >
            <DownloadIcon />
            Descargar skill
          </a>
        </div>
        <div className="skill-install-options">
          <section>
            <h3>Directorio compartido de Agent Skills</h3>
            <JsonCodeBlock value={sharedInstall} fallback="" />
          </section>
          <section>
            <h3>OpenCode global</h3>
            <JsonCodeBlock value={openCodeInstall} fallback="" />
          </section>
        </div>
        <p className="skill-restart-note">
          Reinicia el cliente de agentes para que detecte la nueva skill.
        </p>
      </section>
    </div>
  );
};

const methodBadge = (method: EndpointDoc['method']) => (
  <Badge className={`method-badge method-${method.toLowerCase()}`} size="sm">
    {method}
  </Badge>
);

const JsonBlock = ({
  value,
  fallback = 'No hay un ejemplo documentado para esta sección.',
}: {
  value: unknown;
  fallback?: string;
}) => {
  return <JsonCodeBlock value={value} fallback={fallback} />;
};

const PresetValues = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item !== 'object' || item === null)) {
      return (
        <ul className="preset-chip-list">
          {value.map((item, index) => (
            <li key={`${String(item)}-${index}`}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="preset-record-list">
        {value.map((item, index) => (
          <section className="preset-record" key={`record-${index}`}>
            <h5>Registro {index + 1}</h5>
            <PresetValues value={item} />
          </section>
        ))}
      </div>
    );
  }

  if (value && typeof value === 'object') {
    return (
      <dl className="preset-value-list">
        {Object.entries(value).map(([name, item]) => (
          <div className="preset-value" key={name}>
            <dt>{name}</dt>
            <dd>
              <PresetValues value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (value === null || value === undefined || value === '') {
    return <span className="preset-empty-value">Sin valor</span>;
  }

  return <span className="preset-scalar">{String(value)}</span>;
};

const PresetOptions = ({
  path,
  query,
  body,
}: {
  path?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}) => {
  const sections = [
    { label: 'Valores de la ruta', value: path },
    { label: 'Filtros', value: query },
    { label: 'Datos enviados', value: body },
  ].filter(({ value }) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  });

  return (
    <div className="preset-options">
      {sections.map(({ label, value }) => (
        <section className="preset-option-group" key={label}>
          <h4>{label}</h4>
          <PresetValues value={value} />
        </section>
      ))}
    </div>
  );
};

const ParameterTable = ({
  parameters,
  empty,
}: {
  parameters: ParameterSpec[];
  empty: string;
}) => {
  if (!parameters.length) return <p className="empty-note">{empty}</p>;
  return (
    <section className="table-scroll" aria-label="Tabla de parámetros">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Regla</th>
            <th>Requerido</th>
            <th>Predeterminado</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => (
            <tr key={parameter.name}>
              <td>
                <code>{parameter.name}</code>
              </td>
              <td>{parameter.typeLabel ?? parameter.type ?? '—'}</td>
              <td>
                {parameter.description || 'Sin descripción adicional.'}
                {parameter.allowedValues?.length ? (
                  <small>
                    {' '}
                    Valores:{' '}
                    {parameter.allowedValues
                      .map(
                        (value) =>
                          parameter.allowedValueLabels?.[value]
                            ? `${value} (${parameter.allowedValueLabels[value]})`
                            : value,
                      )
                      .join(', ')}
                  </small>
                ) : null}
              </td>
              <td>{parameter.required ? 'Sí' : 'No'}</td>
              <td>{parameter.defaultValue ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const formatAllowedValues = (field: ParameterSpec) =>
  field.allowedValues?.length
    ? `Valores: ${field.allowedValues
        .map((value) =>
          field.allowedValueLabels?.[value]
            ? `${value} (${field.allowedValueLabels[value]})`
            : value,
        )
        .join(', ')}`
    : undefined;

const formatPattern = (pattern?: string) => {
  if (!pattern) return undefined;
  if (pattern === '^[0-9]{1,50}$') {
    return 'Formato: solo dígitos, entre 1 y 50 caracteres.';
  }
  return 'Formato: debe cumplir la regla definida para este campo.';
};

const formatFieldConstraints = (field: ParameterSpec) =>
  [
    formatPattern(field.pattern),
    field.minimum !== undefined ? `Mínimo: ${field.minimum}` : undefined,
    field.maximum !== undefined ? `Máximo: ${field.maximum}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

const flattenFields = (
  fields: FieldSpec[],
  prefix = '',
): Array<{ field: FieldSpec; path: string }> =>
  fields.flatMap((field) => {
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    const children = [
      ...(field.fields ? flattenFields(field.fields, path) : []),
      ...(field.itemFields ? flattenFields(field.itemFields, `${path}[]`) : []),
    ];
    return [{ field, path }, ...children];
  });

const BodyFieldsTable = ({ fields }: { fields: FieldSpec[] }) => {
  const rows = flattenFields(fields);
  if (!rows.length) return null;
  return (
    <section className="body-fields" aria-label="Campos del cuerpo JSON">
      <h3>Campos del cuerpo</h3>
      <p className="field-table-intro">
        Usa estos nombres, tipos y reglas para construir el cuerpo de la
        solicitud. Los campos anidados conservan la ruta que deben tener en el
        JSON.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Valores y formato</th>
              <th>Requerido</th>
              <th>Predeterminado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ field, path }) => {
              const allowed = formatAllowedValues(field);
              const constraints = formatFieldConstraints(field);
              return (
                <tr key={path}>
                  <td>
                    <code>{path}</code>
                  </td>
                  <td>{field.typeLabel ?? field.type ?? '—'}</td>
                  <td>{field.description || 'Sin descripción adicional.'}</td>
                  <td>
                    {allowed || constraints ? (
                      <>
                        {allowed ? <span>{allowed}</span> : null}
                        {allowed && constraints ? <br /> : null}
                        {constraints ? <span>{constraints}</span> : null}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{field.required ? 'Sí' : 'No'}</td>
                  <td>{field.defaultValue ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const EndpointGuidance = ({ guidance }: { guidance: EndpointDoc['guidance'] }) => {
  if (!guidance) return null;
  return (
    <section className="endpoint-guidance" aria-labelledby="guidance-title">
      <h3 id="guidance-title">{guidance.title}</h3>
      <p>{guidance.intro}</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Valor</th>
              <th>Campo en objDetalle</th>
              <th>Úsalo cuando...</th>
              <th>Regla</th>
            </tr>
          </thead>
          <tbody>
            {guidance.rows.map((row) => (
              <tr key={`${row.value}-${row.field}`}>
                <td><code>{row.value}</code></td>
                <td><code>{row.field}</code></td>
                <td>{row.use}</td>
                <td>{row.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="endpoint-guidance-notes">
        {guidance.notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
      {guidance.examples.length ? (
        <div className="endpoint-guidance-examples">
          <h4>Ejemplos</h4>
          <div className="example-grid">
            {guidance.examples.map((example) => (
              <Card as="section" className="example-card" key={example.title}>
                <CardHeader className="example-card-header">
                  <CardTitle>{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="example-card-content">
                  <JsonBlock value={example.value} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

const columnDescription = (endpoint: EndpointDoc, column: string) =>
  getFieldDescription(endpoint.id, column);

const endpointCurl = (
  endpoint: EndpointDoc,
  curlBaseUrl: string,
  credentials: Credentials,
) => {
  const draft = defaultDraft(endpoint);
  draft.path = Object.fromEntries(
    endpoint.pathParams.map((parameter) => [
      parameter.name,
      parameter.example ?? parameter.defaultValue ?? `<${parameter.name}>`,
    ]),
  );
  draft.credentials = credentials;
  try {
    return buildCurl(endpoint, draft, curlBaseUrl);
  } catch {
    return `curl --request ${endpoint.method} '${curlBaseUrl}${endpoint.path}'`;
  }
};

const EndpointQuickStart = ({
  endpoint,
  curlBaseUrl,
  credentials,
}: {
  endpoint: EndpointDoc;
  curlBaseUrl: string;
  credentials: Credentials;
}) => {
  const [copied, setCopied] = useState(false);
  const authenticated = hasRequiredCredentials(credentials);
  const curl = endpointCurl(endpoint, curlBaseUrl, credentials);

  const copyCurl = async () => {
    await navigator.clipboard.writeText(curl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="quick-start" aria-labelledby="quick-start-title">
      <header className="quick-start-header">
        <div>
          <p className="eyebrow">Inicio rápido</p>
          <h2 id="quick-start-title">Ejecuta esta operación</h2>
        </div>
      </header>
      <pre className="quick-start-code"><CurlCodeBlock curl={curl} /></pre>
      <footer className="quick-start-footer">
        <p>
          {authenticated
            ? 'El comando usa la configuración actual, almacenada solo en memoria.'
            : 'Configura las variables al importar el comando en Postman.'}
        </p>
        <Button type="button" onClick={copyCurl}>
          {copied ? 'Curl copiado' : 'Copiar curl'}
        </Button>
      </footer>
    </section>
  );
};

const EndpointDetail = ({
  endpoint,
  curlBaseUrl,
  credentials,
  onCredentialsChange,
}: {
  endpoint: EndpointDoc;
  curlBaseUrl: string;
  credentials: Credentials;
  onCredentialsChange: (credentials: Credentials) => void;
}) => (
  <article className="endpoint-detail">
    <header className="endpoint-hero">
      <nav className="breadcrumb" aria-label="Ubicación">
        <span>Documentación Cuenti Connect</span>
        <span aria-hidden="true">/</span>
        <span>{endpoint.category}</span>
      </nav>
      <div className="hero-title-row">
        <div>
          <p className="eyebrow">Operación implementada</p>
          <h1>{endpoint.name}</h1>
          <p className="endpoint-summary">
            {endpoint.summary ||
              'Referencia técnica para integrar esta operación.'}
          </p>
        </div>
      </div>
      <div className="route-bar">
        {methodBadge(endpoint.method)}
        <code>{endpoint.path.replace(/^\/jServerj4ErpPro/, '')}</code>
      </div>
      <EndpointQuickStart
        endpoint={endpoint}
        curlBaseUrl={curlBaseUrl}
        credentials={credentials}
      />
    </header>

    <div className="detail-sections">
      <section className="doc-section" aria-labelledby="headers-title">
        <div className="section-heading">
          <div>
            <p className="section-index">01</p>
            <h2 id="headers-title">Encabezados</h2>
          </div>
        </div>
        <ParameterTable
          parameters={endpoint.headers}
          empty="Esta operación no exige encabezados adicionales."
        />
        <p className="security-note">
          Envía estos encabezados con cada solicitud según las reglas del
          contrato.
        </p>
      </section>

      <section className="doc-section" aria-labelledby="parameters-title">
        <div className="section-heading">
          <div>
            <p className="section-index">02</p>
            <h2 id="parameters-title">Parámetros y filtros</h2>
          </div>
        </div>
        <h3>Parámetros de ruta</h3>
        <ParameterTable
          parameters={endpoint.pathParams}
          empty="La ruta no contiene parámetros variables."
        />
        <h3>Parámetros de consulta</h3>
        <ParameterTable
          parameters={endpoint.queryParams}
          empty="No recibe filtros en la cadena de consulta."
        />
      </section>

      <section className="doc-section" aria-labelledby="projection-title">
        <div className="section-heading">
          <div>
            <p className="section-index">03</p>
            <h2 id="projection-title">Cuerpo JSON, grupos y columnas</h2>
          </div>
        </div>
        {endpoint.bodyDescription ? <p>{endpoint.bodyDescription}</p> : null}
        <BodyFieldsTable fields={endpoint.bodyFields} />
        <EndpointGuidance guidance={endpoint.guidance} />
        {endpoint.groups.length ? (
          <div className="projection-grid">
            {endpoint.groups.map((group) => (
              <div className="projection-row" key={group.name}>
                <FieldTooltip
                  label={group.name}
                  description={
                    group.description || getGroupDescription(group.name)
                  }
                  className="field-tooltip-trigger projection-group-trigger"
                />
                <span className="projection-fields">
                  {group.description || getGroupDescription(group.name)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
         {endpoint.columns.length ? (
           <section className="token-cloud" aria-label="Columnas permitidas">
             {endpoint.columns.map((column) => (
               <FieldTooltip
                 key={column}
                 label={column}
                 description={columnDescription(endpoint, column)}
                 className="field-tooltip-trigger column-tooltip-trigger"
               />
             ))}
           </section>
         ) : null}
        {!endpoint.groups.length && !endpoint.columns.length ? (
          <p className="empty-note">
            No utiliza selectores de grupos o columnas.
          </p>
        ) : null}
      </section>

      {endpoint.presets.length ? (
        <section className="doc-section" aria-labelledby="presets-title">
          <div className="section-heading">
            <div>
              <p className="section-index">04</p>
              <h2 id="presets-title">Ejemplos de la misma operación</h2>
            </div>
          </div>
          <p>
            Estas variaciones completan filtros y el cuerpo JSON; no representan
            rutas adicionales.
          </p>
          <div className="preset-docs">
            {endpoint.presets.map((preset) => (
               <details key={preset.id}>
                 <summary>{preset.name}</summary>
                 <p>{preset.description}</p>
                 <PresetOptions
                   path={preset.path}
                   query={preset.query}
                   body={preset.body}
                 />
               </details>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className="doc-section examples-section"
        aria-labelledby="examples-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-index">05</p>
            <h2 id="examples-title">Solicitud y respuesta</h2>
          </div>
        </div>
        <div className="example-grid">
          <Card as="section" className="example-card">
            <CardHeader className="example-card-header">
              <CardTitle>Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="example-card-content">
              <JsonBlock
                value={endpoint.requestExample}
                fallback="Usa los parámetros documentados sin cuerpo adicional."
              />
            </CardContent>
          </Card>
          <Card as="section" className="example-card response-card">
            <CardHeader className="example-card-header">
              <CardTitle>Respuesta</CardTitle>
            </CardHeader>
            <CardContent className="example-card-content">
              {endpoint.responseContract ? (
                <div className="response-contract">
                  <span>Contrato esperado</span>
                  <code>{endpoint.responseContract}</code>
                </div>
              ) : null}
              <JsonBlock value={endpoint.responseExample} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="doc-section" aria-labelledby="behavior-title">
        <div className="section-heading">
          <div>
            <p className="section-index">06</p>
            <h2 id="behavior-title">Errores y comportamiento</h2>
          </div>
        </div>
        <div className="behavior-grid">
          <div>
            <h3>Validaciones</h3>
            {endpoint.errors.length ? (
              <ul className="plain-list">
                {endpoint.errors.map((error) => (
                  <li key={`${error.status}-${error.description}`}>
                    {error.status ? <code>{error.status}</code> : null}
                    {error.status ? ' ' : null}
                    {error.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">
                 Conserva los códigos y el cuerpo de error de la operación.
              </p>
            )}
          </div>
        </div>
        {endpoint.notes.length ? (
          <ul className="notes-list">
            {endpoint.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <TryIt
        endpoint={endpoint}
        enabled={tryItEnabled}
        proxyBaseUrl={proxyBaseUrl}
        curlBaseUrl={serverOrigin}
        credentials={credentials}
        onCredentialsChange={onCredentialsChange}
      />
    </div>
  </article>
);

const App = () => {
  const initialId = endpointFromLocation(window.location);
  const initialMcpGuide = mcpGuideFromLocation(window.location);
  const initialCatalogGuide = catalogGuideFromLocation(window.location);
  const [selectedId, setSelectedId] = useState(
    registry.endpoints.some((endpoint) => endpoint.id === initialId)
      ? initialId
      : registry.endpoints[0]?.id,
  );
  const initialCategory = registry.endpoints.find(
    (endpoint) => endpoint.id === initialId,
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
  const [showMcpGuide, setShowMcpGuide] = useState(initialMcpGuide);
  const [showCatalogGuide, setShowCatalogGuide] = useState(initialCatalogGuide);
  const [credentials, setCredentials] = useState<Credentials>(emptyCredentials);
  const [theme, setTheme] = useState(readTheme);
  const deferredSearch = useDeferredValue(search);
  const filteredEndpoints = filterEndpoints(registry.endpoints, deferredSearch);
  const selectedEndpoint =
    registry.endpoints.find((endpoint) => endpoint.id === selectedId) ??
    registry.endpoints[0];

  useEffect(() => {
    const onPopState = () => {
      const locationId = endpointFromLocation(window.location);
      const showGuide = mcpGuideFromLocation(window.location);
      const showCatalog = catalogGuideFromLocation(window.location);
      setShowMcpGuide(showGuide);
      setShowCatalogGuide(showCatalog);
      if (registry.endpoints.some((endpoint) => endpoint.id === locationId)) {
        startTransition(() => setSelectedId(locationId));
      }
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
      setShowMcpGuide(false);
      setShowCatalogGuide(false);
      setSelectedId(endpoint.id);
      setNavigationOpen(false);
    });
    document.getElementById('main-content')?.focus();
  };

  const selectMcpGuide = () => {
    window.history.pushState({}, '', mcpGuideUrl(window.location));
    startTransition(() => {
      setShowMcpGuide(true);
      setShowCatalogGuide(false);
      setNavigationOpen(false);
    });
    document.getElementById('main-content')?.focus();
  };

  const selectCatalogGuide = () => {
    window.history.pushState({}, '', catalogGuideUrl(window.location));
    startTransition(() => {
      setShowCatalogGuide(true);
      setShowMcpGuide(false);
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
      <div className={`app-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <a className="skip-link" href="#main-content">
          Saltar al contenido
        </a>
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
              onChange={toggleTheme}
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
              onClick={() => setSkillInstallOpen(true)}
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
              onClick={() => setCredentialsOpen(true)}
            >
              <LockIcon />
              <span>Credenciales</span>
              <span
                className={`credentials-status ${
                  hasRequiredCredentials(credentials)
                    ? 'credentials-status-ready'
                    : ''
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
              onClick={() => setNavigationOpen((open) => !open)}
            >
              {navigationOpen ? 'Cerrar' : 'Índice'}
            </Button>
          </div>
        </header>

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
                sidebarCollapsed
                  ? 'Expandir barra lateral'
                  : 'Contraer barra lateral'
              }
              aria-expanded={!sidebarCollapsed}
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
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
            <h2>24 operaciones</h2>
          </div>
          <label className="search-label" htmlFor="endpoint-search">
            <span className="sr-only">Buscar operaciones</span>
            <Input
              id="endpoint-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              className={`guide-link${showMcpGuide ? ' active' : ''}`}
              aria-label="Guía de conexión MCP"
              aria-current={showMcpGuide ? 'page' : undefined}
              onClick={selectMcpGuide}
            >
              <NavigationIcon kind="mcp" />
              <span className="guide-link-label">Guía de conexión MCP</span>
            </button>
            <button
              type="button"
              className={`guide-link${showCatalogGuide ? ' active' : ''}`}
              aria-label="Catálogos y valores"
              aria-current={showCatalogGuide ? 'page' : undefined}
              onClick={selectCatalogGuide}
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
                        if (sidebarCollapsed) setSidebarCollapsed(false);
                        toggleCategory(category);
                      }}
                    >
                      <NavigationIcon kind={category} />
                      <span className="nav-group-title">{category}</span>
                      <span className="nav-group-count">
                        {endpoints.length}
                      </span>
                      <span
                        className={`nav-group-chevron ${
                          isExpanded ? 'is-open' : ''
                        }`}
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
                              endpoint.id === selectedEndpoint.id
                                ? 'page'
                                : undefined
                            }
                            onClick={() => selectEndpoint(endpoint)}
                          >
                            {methodBadge(endpoint.method)}
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

        <main id="main-content" tabIndex={-1}>
          {showCatalogGuide ? (
            <CatalogGuide />
          ) : showMcpGuide ? (
            <McpGuide />
          ) : (
            <EndpointDetail
              endpoint={selectedEndpoint}
              curlBaseUrl={serverOrigin}
              credentials={credentials}
              onCredentialsChange={setCredentials}
            />
          )}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default App;
