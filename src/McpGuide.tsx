export const MCP_SERVER_URL = 'https://mcp-api.cuenti.co/mcp';

const connectionHeaders = [
  ['X-Auth-Token-empresa', 'Identificador de la empresa.'],
  ['X-Auth-Token-sucursal', 'Identificador de la sucursal.'],
  ['X-Id-Empleado', 'Empleado que ejecuta la operación.'],
  ['X-gtm', 'Zona horaria, normalmente GMT-0500.'],
  ['Authorization', 'Token con el formato Bearer <token>.'],
];

export const McpGuide = () => (
  <div className="mcp-guide">
    <header className="mcp-guide-hero">
      <p className="eyebrow">Guía independiente de endpoints</p>
      <h1>Conectar y usar Cuenti MCP</h1>
      <p>
        Conecta un cliente compatible con MCP y descubre las herramientas de
        Cuenti de forma segura.
      </p>
      <div className="mcp-route-bar">
        <span>Servidor MCP</span>
        <code>{MCP_SERVER_URL}</code>
        <Badge>Streamable HTTP</Badge>
      </div>
    </header>

    <div className="mcp-guide-content">
      <section className="mcp-guide-section" aria-labelledby="mcp-connect-title">
        <p className="section-index">01 / Conexión</p>
        <h2 id="mcp-connect-title">Conexión rápida</h2>
        <ol className="mcp-steps">
          <li>
            Configura en tu cliente MCP la URL del servidor y el transporte
            <strong> Streamable HTTP</strong>.
          </li>
          <li>
            Envía de forma segura el contexto de empresa, sucursal, empleado,
            zona horaria y autorización.
          </li>
          <li>
            Ejecuta <code>initialize</code> y después <code>tools/list</code> para
            conocer las herramientas disponibles y sus esquemas.
          </li>
          <li>Elige una herramienta, valida sus argumentos y realiza la llamada.</li>
        </ol>
        <div className="mcp-callout">
          <strong>No pongas credenciales en los argumentos.</strong> El cliente
          MCP debe mantenerlas en la configuración segura de la conexión.
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Encabezado</th>
                <th>Uso</th>
              </tr>
            </thead>
            <tbody>
              {connectionHeaders.map(([name, description]) => (
                <tr key={name}>
                  <td><code>{name}</code></td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mcp-guide-section mcp-checklist" aria-labelledby="mcp-check-title">
        <p className="section-index">02 / Antes de enviar</p>
        <h2 id="mcp-check-title">Lista de verificación</h2>
        <ul>
          <li>El cliente está conectado y recibió el esquema con <code>tools/list</code>.</li>
          <li>La herramienta corresponde a la necesidad.</li>
          <li>Los argumentos coinciden con el esquema de <code>tools/list</code>.</li>
          <li>La solicitud no contiene credenciales.</li>
          <li>Para una mutación, explica el cambio y solicita confirmación.</li>
        </ul>
      </section>
    </div>
  </div>
);

const Badge = ({ children }: { children: string }) => (
  <span className="mcp-transport-badge">{children}</span>
);
