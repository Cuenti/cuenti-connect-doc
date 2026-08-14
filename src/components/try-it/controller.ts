import { useEffect, useRef, useState } from 'react';
import type { EndpointDoc, EndpointPreset } from '../../model';
import type { Credentials, RequestDraft } from '../../request';
import {
  buildCurl,
  buildRequest,
  defaultDraft,
  hasRequiredCredentials,
} from '../../request';

export interface ResponseState {
  status: number;
  duration: number;
  headers: Array<[string, string]>;
  body: string;
}

export const useTryItController = ({
  endpoint,
  proxyBaseUrl,
  curlBaseUrl,
  credentials,
}: {
  endpoint: EndpointDoc;
  proxyBaseUrl: string;
  curlBaseUrl: string;
  credentials: Credentials;
}) => {
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeController = useRef<AbortController | null>(null);

  useEffect(() => {
    const draft = defaultDraft(endpoint);
    setPathValues(draft.path);
    setQueryValues(draft.query);
    setBody(draft.body);
    setConfirmed(false);
    setError('');
    setResponse(null);
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    const endpointId = endpoint.id;
    return () => {
      if (!endpointId) return;
      activeController.current?.abort();
      activeController.current = null;
    };
  }, [endpoint.id]);

  const draft: RequestDraft = {
    path: pathValues,
    query: queryValues,
    body,
    credentials,
  };
  const credentialsConfigured = hasRequiredCredentials(credentials);

  const applyPreset = (preset: EndpointPreset) => {
    setPathValues((current) => ({ ...current, ...preset.path }));
    setQueryValues((current) => ({ ...current, ...preset.query }));
    if (preset.body !== undefined)
      setBody(JSON.stringify(preset.body, null, 2));
    setResponse(null);
    setError('');
  };

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

    const controller = new AbortController();
    activeController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    const startedAt = performance.now();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const result = await fetch(request.url, {
        ...request.init,
        signal: controller.signal,
      });
      const responseBody = await result.text();
      if (activeController.current !== controller) return;
      setResponse({
        status: result.status,
        duration: Math.round(performance.now() - startedAt),
        headers: [...result.headers.entries()].filter(
          ([name]) => name.toLowerCase() !== 'x-cache',
        ),
        body: responseBody,
      });
    } catch (reason) {
      if (activeController.current !== controller) return;
      setError(
        reason instanceof DOMException && reason.name === 'AbortError'
          ? 'La solicitud excedió el tiempo límite de 20 segundos.'
          : 'No fue posible completar la solicitud. Verifica la configuración del entorno.',
      );
    } finally {
      window.clearTimeout(timeout);
      if (activeController.current === controller) {
        activeController.current = null;
        setLoading(false);
      }
    }
  };

  return {
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
  };
};
