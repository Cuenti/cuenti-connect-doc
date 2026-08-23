import statsContract from '../contracts/stats/endpoints.json';

export const STATS_MCP_SERVER_URL = 'https://mcp-stats.cuenti.co/mcp';

type StatsEndpoint = (typeof statsContract.endpoints)[number];

const statsTools = statsContract.endpoints.filter(
  (endpoint) => endpoint.visibility === 'public' && endpoint.exposedAsTool,
);

const categories = [
  ...new Set(statsTools.map((endpoint) => endpoint.category)),
];

const StatsTool = ({ endpoint }: { endpoint: StatsEndpoint }) => (
  <details className="stats-tool">
    <summary>
      <span>{endpoint.title}</span>
    </summary>
    <div className="stats-tool-content">
      <p>{endpoint.purpose}</p>
      <dl className="stats-tool-facts">
        <div>
          <dt>Usar cuando</dt>
          <dd>{endpoint.use}</dd>
        </div>
        <div>
          <dt>Operación</dt>
          <dd>{endpoint.operation === 'workflow' ? 'Flujo' : 'Consulta'}</dd>
        </div>
      </dl>
      {endpoint.doNotUse.length ? (
        <div className="mcp-warning">
          <strong>No usar para</strong>
          <ul>
            {endpoint.doNotUse.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {endpoint.input.fields.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Tipo</th>
                <th>Obligatorio</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.input.fields.map((field) => (
                <tr key={field.name}>
                  <td>
                    <code>{field.name}</code>
                  </td>
                  <td>{field.format || field.type}</td>
                  <td>{field.required ? 'Sí' : 'No'}</td>
                  <td>{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-note">No requiere argumentos.</p>
      )}
      {endpoint.dateRange.required ? (
        <p className="stats-tool-note">
          Rango: <code>{endpoint.dateRange.from}</code> y{' '}
          <code>{endpoint.dateRange.to}</code>, máximo{' '}
          <strong>
            {endpoint.dateRange.maxDays} días calendario inclusivos
          </strong>
          .
        </p>
      ) : null}
      {endpoint.branch.required ? (
        <p className="stats-tool-note">
          Requiere sucursal mediante <code>{endpoint.branch.inputField}</code>.
        </p>
      ) : null}
      {endpoint.interpretation.length ? (
        <div className="stats-tool-interpretation">
          <strong>Interpretación</strong>
          <ul>
            {endpoint.interpretation.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  </details>
);

export const StatsGuide = () => (
  <div className="mcp-guide">
    <header className="mcp-guide-hero">
      <p className="eyebrow">Servidor MCP de indicadores y reportes</p>
      <h1>Conectar y usar Cuenti Stats MCP</h1>
      <p>
        Consulta KPIs y reportes de Cuenti mediante herramientas especializadas,
        con reglas explícitas para fechas, sucursales e interpretación.
      </p>
      <div className="mcp-route-bar">
        <span>Servidor MCP</span>
        <code>{STATS_MCP_SERVER_URL}</code>
        <span className="mcp-transport-badge">Streamable HTTP</span>
      </div>
    </header>

    <div className="mcp-guide-content">
      <section
        className="mcp-guide-section"
        aria-labelledby="stats-connect-title"
      >
        <p className="section-index">01 / Conexión</p>
        <h2 id="stats-connect-title">Conexión rápida</h2>
        <ol className="mcp-steps">
          <li>
            Configura la URL del servidor con transporte{' '}
            <strong>Streamable HTTP</strong>.
          </li>
          <li>
            Envía `Authorization`, `X-Auth-Token-Empresa` y `X-Auth-User-Id` de
            forma segura.
          </li>
          <li>
            Ejecuta <code>initialize</code> y después <code>tools/list</code>.
          </li>
          <li>Valida los argumentos y ejecuta la herramienta correcta.</li>
        </ol>
        <div className="mcp-callout">
          <strong>No pongas credenciales en los argumentos.</strong> El cliente
          MCP debe mantenerlas en la configuración segura de la conexión.
        </div>
      </section>

      <section
        className="mcp-guide-section mcp-checklist"
        aria-labelledby="stats-rules-title"
      >
        <p className="section-index">02 / Reglas de operación</p>
        <h2 id="stats-rules-title">Antes de consultar</h2>
        <ul>
          <li>
            Usa fechas `YYYY-MM-DD` y periodos máximos de 31 días calendario
            inclusivos.
          </li>
          <li>
            No adivines la sucursal; usa `list_accessible_branches` cuando falte
            contexto.
          </li>
          <li>
            Conserva el alcance, la sucursal y el periodo al explicar el
            resultado.
          </li>
          <li>Las herramientas Stats no utilizan caché.</li>
        </ul>
      </section>

      <section
        className="mcp-guide-section"
        aria-labelledby="stats-tools-title"
      >
        <p className="section-index">03 / Catálogo</p>
        <h2 id="stats-tools-title">
          {statsTools.length} herramientas públicas
        </h2>
        <p>
          El catálogo se deriva de <code>contracts/stats/endpoints.json</code>.
          Abre una herramienta para revisar su propósito, argumentos y reglas de
          interpretación.
        </p>
        {categories.map((category) => (
          <div className="stats-tool-group" key={category}>
            <h3>{category}</h3>
            {statsTools
              .filter((endpoint) => endpoint.category === category)
              .map((endpoint) => (
                <StatsTool endpoint={endpoint} key={endpoint.id} />
              ))}
          </div>
        ))}
      </section>
    </div>
  </div>
);
