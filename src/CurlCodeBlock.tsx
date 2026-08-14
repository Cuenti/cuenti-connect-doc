import type { ReactNode } from 'react';
import { highlightJson } from './JsonCodeBlock';

const SHELL_TOKEN_PATTERN =
  /\{\{[^}]+\}\}|https?:\/\/[^\s']+|(?<!\S)--?[a-zA-Z-]+|\b(?:GET|POST|PUT|PATCH|DELETE)\b|\bcurl\b/g;

const highlightShell = (text: string) => {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(SHELL_TOKEN_PATTERN)) {
    const index = match.index;
    if (index > cursor) parts.push(text.slice(cursor, index));

    const token = match[0];
    const className = token.startsWith('{{')
      ? 'curl-variable'
      : token.startsWith('http')
        ? 'curl-url'
        : token === 'curl'
          ? 'curl-command'
          : token.startsWith('-')
            ? 'curl-option'
            : 'curl-method';
    parts.push(
      <span className={className} key={`${index}-${token}`}>
        {token}
      </span>,
    );
    cursor = index + token.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
};

export const CurlCodeBlock = ({ curl }: { curl: string }) => {
  const bodyMarker = "--data '";
  const bodyStart = curl.indexOf(bodyMarker);
  const bodyEnd = curl.lastIndexOf("'");

  if (bodyStart < 0 || bodyEnd <= bodyStart + bodyMarker.length) {
    return <code className="curl-code">{highlightShell(curl)}</code>;
  }

  const prefixEnd = bodyStart + bodyMarker.length;
  return (
    <code className="curl-code">
      {highlightShell(curl.slice(0, prefixEnd))}
      <span className="curl-json">
        {highlightJson(curl.slice(prefixEnd, bodyEnd))}
      </span>
      {curl.slice(bodyEnd)}
    </code>
  );
};
