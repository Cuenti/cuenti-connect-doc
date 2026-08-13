import { Badge } from '@cuenti-dna/react/badge';
import { Button } from '@cuenti-dna/react/button';
import { Card } from '@cuenti-dna/react/card';
import { Checkbox } from '@cuenti-dna/react/checkbox';
import { HelperText } from '@cuenti-dna/react/helper-text';
import { Input } from '@cuenti-dna/react/input';
import { Label } from '@cuenti-dna/react/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cuenti-dna/react/select';
import { useEffect, useState } from 'react';
import { formatJsonText, JsonCodeBlock } from './JsonCodeBlock';
import type { EndpointDoc, EndpointPreset, ParameterSpec } from './model';
import type { Credentials } from './request';
import {
  buildCurl,
  buildRequest,
  defaultDraft,
  hasRequiredCredentials,
} from './request';

interface TryItProps {
  endpoint: EndpointDoc;
  enabled: boolean;
  proxyBaseUrl: string;
  curlBaseUrl: string;
  credentials: Credentials;
  onCredentialsChange: (credentials: Credentials) => void;
}

interface ResponseState {
  status: number;
  duration: number;
  headers: Array<[string, string]>;
  body: string;
}

export const formatResponseBody = (body: string) => {
  return formatJsonText(body).text;
};

const ParameterInputs = ({
  title,
  idPrefix,
  parameters,
  values,
  onChange,
}: {
  title: string;
  idPrefix: string;
  parameters: ParameterSpec[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) => {
  if (parameters.length === 0) return null;
  return (
    <fieldset className="try-fieldset">
      <legend>{title}</legend>
      <div className="form-grid">
        {parameters.map((parameter) => {
          const hintId = `${idPrefix}-${parameter.name}-hint`;
          return (
            <div key={parameter.name} className="field-label">
              <Label
                className="field-label-title"
                htmlFor={`${idPrefix}-${parameter.name}`}
                required={parameter.required}
              >
                {parameter.name}
              </Label>
              {parameter.allowedValues?.length ? (
                <Select
                  id={`${idPrefix}-${parameter.name}`}
                  value={values[parameter.name] ?? ''}
                  onValueChange={(value) => onChange(parameter.name, value)}
                  required={parameter.required}
                  classNames={{
                    value: 'try-select-value',
                    icon: 'try-select-icon',
                  }}
                >
                  <SelectTrigger aria-describedby={hintId}>
                    <SelectValue
                      placeholder={parameter.example ?? parameter.defaultValue}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parameter.allowedValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {parameter.allowedValueLabels?.[value]
                          ? `${value} (${parameter.allowedValueLabels[value]})`
                          : value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`${idPrefix}-${parameter.name}`}
                  aria-describedby={hintId}
                  value={values[parameter.name] ?? ''}
                  onChange={(event) =>
                    onChange(parameter.name, event.target.value)
                  }
                  placeholder={parameter.example ?? parameter.defaultValue}
                />
              )}
              <HelperText id={hintId} className="field-helper" size="sm">
                {parameter.description}
              </HelperText>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export const TryIt = ({
  endpoint,
  enabled,
  proxyBaseUrl,
  curlBaseUrl,
  credentials,
}: TryItProps) => {
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const draft = defaultDraft(endpoint);
    setPathValues(draft.path);
    setQueryValues(draft.query);
    setBody(draft.body);
    setConfirmed(false);
    setError('');
    setResponse(null);
  }, [endpoint]);

  if (!enabled) {
    return (
      <Card as="section" className="try-disabled" aria-labelledby="try-title">
        <div>
          <p className="eyebrow">Ejecución interactiva</p>
          <h2 id="try-title">Probar consulta está desactivado</h2>
          <p>
            Este entorno permite consultar el contrato, pero no enviar
            solicitudes en esta compilación.
          </p>
        </div>
        <span className="status-light" aria-hidden="true" />
      </Card>
    );
  }

  const applyPreset = (preset: EndpointPreset) => {
    setPathValues((current) => ({ ...current, ...preset.path }));
    setQueryValues((current) => ({ ...current, ...preset.query }));
    if (preset.body !== undefined)
      setBody(JSON.stringify(preset.body, null, 2));
    setResponse(null);
    setError('');
  };

  const draft = { path: pathValues, query: queryValues, body, credentials };
  const credentialsConfigured = hasRequiredCredentials(credentials);

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(
        buildCurl(endpoint, draft, curlBaseUrl),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'No fue posible construir el comando.',
      );
    }
  };

  const execute = async () => {
    if (!credentialsConfigured) {
      setError(
        'Configura empresa, sucursal, empleado, zona horaria y token desde el candado antes de enviar solicitudes.',
      );
      return;
    }

    if (endpoint.kind === 'mutation' && !confirmed) {
      setError('Confirma explícitamente la mutación antes de enviarla.');
      return;
    }

    let request: ReturnType<typeof buildRequest>;
    try {
      request = buildRequest(endpoint, draft, proxyBaseUrl);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'La solicitud no es válida.',
      );
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    const startedAt = performance.now();

    try {
      const result = await fetch(request.url, {
        ...request.init,
        signal: controller.signal,
      });
      const responseBody = await result.text();
      setResponse({
        status: result.status,
        duration: Math.round(performance.now() - startedAt),
        headers: [...result.headers.entries()].filter(
          ([name]) => name.toLowerCase() !== 'x-cache',
        ),
        body: responseBody,
      });
    } catch (reason) {
      setError(
        reason instanceof DOMException && reason.name === 'AbortError'
          ? 'La solicitud excedió el tiempo límite de 20 segundos.'
          : 'No fue posible completar la solicitud. Verifica la configuración del entorno.',
      );
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <Card as="section" className="try-panel" aria-labelledby="try-title">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Ejecución</p>
          <h2 id="try-title">Probar consulta</h2>
        </div>
      </header>

      <p className="try-introduction">
        Completa el contexto de la solicitud en la configuración global antes de
        ejecutarla.
      </p>
      {!credentialsConfigured ? (
        <HelperText
          className="form-error"
          role="status"
          variant="warning"
          wrapped
        >
          Configura las credenciales desde el candado para habilitar el envío.
        </HelperText>
      ) : null}
      {endpoint.presets.length ? (
        <fieldset className="preset-row">
          <legend className="sr-only">Ejemplos del endpoint</legend>
          {endpoint.presets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </fieldset>
      ) : null}

      <ParameterInputs
        title="Parámetros de ruta"
        idPrefix="path"
        parameters={endpoint.pathParams}
        values={pathValues}
        onChange={(name, value) =>
          setPathValues((current) => ({ ...current, [name]: value }))
        }
      />
      <ParameterInputs
        title="Parámetros de consulta"
        idPrefix="query"
        parameters={endpoint.queryParams}
        values={queryValues}
        onChange={(name, value) =>
          setQueryValues((current) => ({ ...current, [name]: value }))
        }
      />

      {endpoint.method !== 'GET' ? (
        <div className="body-editor-label">
          <Label className="field-label-title" htmlFor="request-body">
            Cuerpo JSON
          </Label>
          <textarea
            id="request-body"
            className="body-editor"
            rows={12}
            spellCheck={false}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>
      ) : null}

      {endpoint.kind === 'mutation' ? (
        <div className="mutation-confirmation">
          <Checkbox
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          >
            Entiendo que esta operación modifica datos reales.
          </Checkbox>
        </div>
      ) : null}

      {error ? (
        <HelperText
          className="form-error"
          role="alert"
          variant="destructive"
          wrapped
        >
          {error}
        </HelperText>
      ) : null}

      <div className="try-actions">
        <Button
          variant={endpoint.kind === 'mutation' ? 'destructive' : 'primary'}
          onClick={execute}
          disabled={loading || !credentialsConfigured}
        >
          {loading ? 'Enviando...' : 'Enviar solicitud'}
        </Button>
        <Button variant="outline" onClick={copyCurl}>
          {copied ? 'Comando curl copiado' : 'Copiar comando curl'}
        </Button>
      </div>

      {response ? (
        <section
          className="response-panel"
          aria-live="polite"
          aria-label="Respuesta del servicio"
        >
          <header className="response-summary">
            <Badge
              variant={response.status < 400 ? 'success' : 'error'}
              color="translucent"
              size="sm"
            >
              Estado HTTP {response.status}
            </Badge>
            <span>{response.duration} ms</span>
          </header>
          <details>
            <summary>Encabezados ({response.headers.length})</summary>
            <dl className="header-list">
              {response.headers.map(([name, value]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </details>
          <JsonCodeBlock
            value={response.body}
            parseText
            fallback="(respuesta sin cuerpo)"
          />
        </section>
      ) : null}
    </Card>
  );
};
