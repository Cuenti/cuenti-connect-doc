import { JsonCodeBlock } from '../../JsonCodeBlock';
import type { EndpointDoc } from '../../model';
import type { Credentials } from '../../request';
import { buildCurl, defaultDraft } from '../../request';

export const JsonBlock = ({
  value,
  fallback = 'No hay un ejemplo documentado para esta sección.',
}: {
  value: unknown;
  fallback?: string;
}) => <JsonCodeBlock value={value} fallback={fallback} />;

export const endpointCurl = (
  endpoint: EndpointDoc,
  curlBaseUrl: string,
  credentials: Credentials,
) => {
  const draft = defaultDraft(endpoint);
  draft.path = Object.fromEntries(
    endpoint.pathParams.map((parameter) => [
      parameter.name,
      parameter.example ?? parameter.defaultValue ?? `<${parameter.name}>`,
    ]),
  );
  draft.credentials = credentials;
  try {
    return buildCurl(endpoint, draft, curlBaseUrl);
  } catch {
    return `curl --request ${endpoint.method} '${curlBaseUrl}${endpoint.path}'`;
  }
};
