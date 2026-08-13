import { ScrollArea } from '@cuenti-dna/react/scroll-area';
import type { ReactNode } from 'react';

const JSON_TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

export const formatJsonText = (text: string) => {
  if (!text.trim()) {
    return { text: '(respuesta sin cuerpo)', isJson: false };
  }

  try {
    return {
      text: JSON.stringify(JSON.parse(text), null, 2),
      isJson: true,
    };
  } catch {
    return { text, isJson: false };
  }
};

const highlightJson = (text: string) => {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(JSON_TOKEN_PATTERN)) {
    const index = match.index;
    if (index > cursor) parts.push(text.slice(cursor, index));

    const token = match[0];
    if (match[1]) {
      parts.push(
        <span
          className={match[2] ? 'json-key' : 'json-string'}
          key={`${index}-value`}
        >
          {match[1]}
        </span>,
      );
      if (match[2]) {
        parts.push(
          <span className="json-punctuation" key={`${index}-colon`}>
            {match[2]}
          </span>,
        );
      }
    } else {
      const className =
        token === 'null'
          ? 'json-null'
          : token === 'true' || token === 'false'
            ? 'json-boolean'
            : 'json-number';
      parts.push(
        <span className={className} key={`${index}-scalar`}>
          {token}
        </span>,
      );
    }

    cursor = index + token.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
};

interface JsonCodeBlockProps {
  value: unknown;
  fallback?: string;
  parseText?: boolean;
}

export const JsonCodeBlock = ({
  value,
  fallback = 'No hay un ejemplo documentado para esta sección.',
  parseText = false,
}: JsonCodeBlockProps) => {
  if (value === undefined || value === null || value === '') {
    return <p className="empty-note">{fallback}</p>;
  }

  const formatted =
    typeof value === 'string'
      ? parseText
        ? formatJsonText(value)
        : { text: value, isJson: false }
      : { text: JSON.stringify(value, null, 2), isJson: true };

  return (
    <ScrollArea
      className="code-scroll-area"
      classNames={{ viewport: 'code-scroll-viewport' }}
      orientation="horizontal"
      withShadows
    >
      <pre className="code-block">
        <code className={formatted.isJson ? 'json-code' : undefined}>
          {formatted.isJson ? highlightJson(formatted.text) : formatted.text}
        </code>
      </pre>
    </ScrollArea>
  );
};
