import { Badge } from '@cuenti-dna/react/badge';
import { JsonCodeBlock } from '../../JsonCodeBlock';
import type { ResponseState } from './controller';

export const ResponsePanel = ({ response }: { response: ResponseState }) => (
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
);
