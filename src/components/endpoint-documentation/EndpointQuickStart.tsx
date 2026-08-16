import { Button } from '@cuenti-dna/react/button';
import { useState } from 'react';
import { CurlCodeBlock } from '../../CurlCodeBlock';
import type { EndpointDoc } from '../../model';
import { type Credentials, hasRequiredCredentials } from '../../request';
import { endpointCurl } from '../shared/code';

export const EndpointQuickStart = ({
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
      <div className="quick-start-snippets">
        <section className="quick-start-snippet" aria-labelledby="curl-title">
          <h3 id="curl-title">cURL</h3>
          <pre className="quick-start-code">
            <CurlCodeBlock curl={curl} />
          </pre>
        </section>
      </div>
      <footer className="quick-start-footer">
        <p>
          {authenticated
            ? 'El comando usa la configuración actual, almacenada solo en memoria.'
            : 'Configura las variables al importar el comando en Postman.'}
        </p>
        <Button type="button" className="curl-copy-button" onClick={copyCurl}>
          {copied ? 'Curl copiado' : 'Copiar curl'}
        </Button>
      </footer>
    </section>
  );
};
