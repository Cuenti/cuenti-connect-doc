import { Badge } from '@cuenti-dna/react/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cuenti-dna/react/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@cuenti-dna/react/tooltip';
import { useEffect, useState } from 'react';
import {
  getFieldDescription,
  getGroupDescription,
} from '../../fieldDescriptions';
import type { EndpointDoc } from '../../model';
import type { Credentials } from '../../request';
import { projectResponseExample } from '../../responseProjection';
import { TryIt } from '../../TryIt';
import { JsonBlock } from '../shared/code';
import { EndpointGuidance } from './EndpointGuidance';
import { EndpointQuickStart } from './EndpointQuickStart';
import {
  BodyFieldsTable,
  ParameterTable,
  PresetOptions,
} from './EndpointTables';

const methodBadge = (method: EndpointDoc['method']) => (
  <Badge className={`method-badge method-${method.toLowerCase()}`} size="sm">
    {method}
  </Badge>
);

const FieldTooltip = ({
  label,
  description,
  className,
}: {
  label: string;
  description: string;
  className?: string;
}) => {
  return (
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
};

const columnDescription = (endpoint: EndpointDoc, column: string) =>
  getFieldDescription(endpoint.contractId ?? endpoint.id, column);

export const EndpointDetail = ({
  endpoint,
  routePath,
  enabled,
  proxyBaseUrl,
  curlBaseUrl,
  credentials,
}: {
  endpoint: EndpointDoc;
  routePath: string;
  enabled: boolean;
  proxyBaseUrl: string;
  curlBaseUrl: string;
  credentials: Credentials;
}) => {
  const [requestText, setRequestText] = useState(() =>
    JSON.stringify(endpoint.requestExample ?? {}, null, 2),
  );
  const [requestValue, setRequestValue] = useState(endpoint.requestExample);
  const [requestError, setRequestError] = useState('');
  const rejection = {
    code:
      endpoint.kind === 'mutation'
        ? 'erp_mutation_rejected'
        : 'erp_query_failed',
    message:
      endpoint.kind === 'mutation'
        ? 'El ERP rechazó la operación.'
        : 'No fue posible consultar la información en el ERP.',
    retryable: endpoint.kind === 'query',
  };
  if (endpoint.contractId === 'grabarDocumentoSimple') {
    rejection.message +=
      ' codigo_error:1050:Producto de ejemplo sin existencia';
  }
  const requestId = '0123456789abcdef0123456789abcdef';
  const rejectionExample = endpoint.responseEnvelope
    ? { success: false, data: null, error: rejection, request_id: requestId }
    : {
        error: rejection.code,
        message: rejection.message,
        request_id: requestId,
        retryable: rejection.retryable,
      };

  useEffect(() => {
    setRequestText(JSON.stringify(endpoint.requestExample ?? {}, null, 2));
    setRequestValue(endpoint.requestExample);
    setRequestError('');
  }, [endpoint]);

  const updateRequest = (value: string) => {
    setRequestText(value);
    try {
      setRequestValue(JSON.parse(value));
      setRequestError('');
    } catch {
      setRequestError('El JSON de ejemplo todavía no es válido.');
    }
  };

  return (
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
          <code>{routePath}</code>
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
          {endpoint.compatibility ? (
            <p className="projection-note">
              La proyección recomendada usa grupos; columnas está disponible
              para respuestas planas.
            </p>
          ) : null}
          {endpoint.bodyDescription ? <p>{endpoint.bodyDescription}</p> : null}
          <BodyFieldsTable
            fields={endpoint.bodyFields}
            endpointId={endpoint.contractId ?? endpoint.id}
          />
          <EndpointGuidance guidance={endpoint.guidance} />
          {endpoint.groups.length ? (
            <div>
              <h3>Grupos</h3>
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
                      {group.fields.length
                        ? ` Campos: ${group.fields.join(', ')}.`
                        : ''}
                      {group.aliases?.length
                        ? ` Alias: ${group.aliases.join(', ')}.`
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {endpoint.columns.length ? (
            <div>
              <h3>Columnas</h3>
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
            </div>
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
              Estas variaciones completan filtros y el cuerpo JSON; no
              representan rutas adicionales.
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
                {endpoint.method === 'GET' ||
                endpoint.requestExample == null ? (
                  <JsonBlock
                    value={endpoint.requestExample}
                    fallback="Usa los parámetros documentados sin cuerpo adicional."
                  />
                ) : (
                  <>
                    <textarea
                      className="body-editor documentation-example-editor"
                      aria-label="Solicitud JSON de ejemplo"
                      value={requestText}
                      onChange={(event) => updateRequest(event.target.value)}
                      rows={12}
                      spellCheck={false}
                    />
                    <p className={requestError ? 'form-error' : 'example-note'}>
                      {requestError ||
                        'La respuesta ilustrativa se actualiza al cambiar la selección de grupos.'}
                    </p>
                  </>
                )}
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
                <JsonBlock
                  value={projectResponseExample(endpoint, requestValue)}
                  fallback="No hay un ejemplo de respuesta documentado para esta operación."
                />
                {endpoint.responseFallbackExample !== undefined ? (
                  <>
                    <h4>
                      Respuesta alternativa: pago confirmado sin comprobante
                      enriquecido
                    </h4>
                    <p>
                      Consulta el comprobante por ID; no repitas la escritura.
                    </p>
                    <JsonBlock value={endpoint.responseFallbackExample} />
                  </>
                ) : null}
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
            <div>
              <h3>Errores controlados del ERP</h3>
              <ul className="plain-list">
                <li>
                  <code>erp_query_failed</code> permite reintentar consultas.
                </li>
                <li>
                  <code>erp_query_rejected</code> y{' '}
                  <code>erp_mutation_rejected</code> no deben reintentarse.
                </li>
                <li>
                  <code>erp_capacity_exceeded</code> permite reintentar después
                  del tiempo indicado en <code>Retry-After</code>.
                </li>
                <li>
                  <code>erp_mutation_outcome_unknown</code> indica que la
                  operación pudo persistirse y no debe repetirse
                  automáticamente.
                </li>
              </ul>
              <p className="security-note">
                Los errores controlados incluyen <code>request_id</code> y el
                header <code>X-Request-ID</code>; nunca exponen SQL ni detalles
                JDBC. Las respuestas exitosas conservan el formato de cada
                contrato.
              </p>
              {endpoint.id !== 'restaurante-comandas-crear' ? (
                <>
                  <h4>
                    Ejemplo de error HTTP{' '}
                    {endpoint.kind === 'mutation' ? '422' : '502'}
                  </h4>
                  <JsonBlock value={rejectionExample} />
                  <p>
                    {endpoint.responseEnvelope
                      ? 'Este contrato usa {success,data,error,request_id}; el código y message están dentro de error.'
                      : 'Este contrato conserva el error plano {error,message,request_id,retryable}. Una validación HTTP 400 usa {error:"invalid_request",field}.'}
                  </p>
                  <p>
                    Un rechazo de negocio reconocido puede ampliar únicamente
                    <code> message</code> con información útil, sin cambiar el
                    estado HTTP, el código ni <code>retryable</code>. SQL,
                    trazas y credenciales permanecen ocultos. Un error no se
                    almacena en caché.
                  </p>
                </>
              ) : null}
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
          enabled={enabled}
          proxyBaseUrl={proxyBaseUrl}
          curlBaseUrl={curlBaseUrl}
          credentials={credentials}
        />
      </div>
    </article>
  );
};
