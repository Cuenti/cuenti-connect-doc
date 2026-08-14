import { Button } from '@cuenti-dna/react/button';
import { Card } from '@cuenti-dna/react/card';
import { Checkbox } from '@cuenti-dna/react/checkbox';
import { HelperText } from '@cuenti-dna/react/helper-text';
import { Label } from '@cuenti-dna/react/label';
import { useTryItController } from './components/try-it/controller';
import { ParameterInputs } from './components/try-it/ParameterInputs';
import { ResponsePanel } from './components/try-it/ResponsePanel';
import { formatJsonText } from './JsonCodeBlock';
import type { EndpointDoc } from './model';
import type { Credentials } from './request';

interface TryItProps {
  endpoint: EndpointDoc;
  enabled: boolean;
  proxyBaseUrl: string;
  curlBaseUrl: string;
  credentials: Credentials;
}

export const formatResponseBody = (body: string) => {
  return formatJsonText(body).text;
};

export const TryIt = ({
  endpoint,
  enabled,
  proxyBaseUrl,
  curlBaseUrl,
  credentials,
}: TryItProps) => {
  const {
    pathValues,
    queryValues,
    body,
    confirmed,
    error,
    response,
    loading,
    copied,
    credentialsConfigured,
    applyPreset,
    copyCurl,
    execute,
    setPathValues,
    setQueryValues,
    setBody,
    setConfirmed,
  } = useTryItController({ endpoint, proxyBaseUrl, curlBaseUrl, credentials });

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

      {response ? <ResponsePanel response={response} /> : null}
    </Card>
  );
};
