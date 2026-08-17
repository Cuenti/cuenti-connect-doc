import type { EndpointDoc } from '../model';
import type { Credentials } from '../request';
import { DEFAULT_TIMEZONE } from '../request';

export const proxyBaseUrl = import.meta.env.PUBLIC_PROXY_BASE_URL?.trim() ?? '';
export const serverOrigin =
  proxyBaseUrl ||
  (import.meta.env.DEV ? 'http://localhost:8081' : window.location.origin);

export const serverApiUrl = (endpoint: EndpointDoc, origin: string) => {
  const baseSegment = endpoint.path.split('/').filter(Boolean)[0];
  const basePath = baseSegment ? `/${baseSegment}` : '';
  return `${origin.replace(/\/+$/, '')}${basePath}`;
};

export const serverApiPath = (endpoint: EndpointDoc) => {
  const baseSegment = endpoint.path.split('/').filter(Boolean)[0];
  const basePath = baseSegment ? `/${baseSegment}` : '';
  return basePath && endpoint.path.startsWith(basePath)
    ? endpoint.path.slice(basePath.length) || '/'
    : endpoint.path;
};

export const isTryItEnabled = (
  configuredValue: string | undefined,
  development: boolean,
) => configuredValue === 'true' || (development && configuredValue !== 'false');

export const tryItEnabled = isTryItEnabled(
  import.meta.env.PUBLIC_TRY_IT_ENABLED,
  import.meta.env.DEV,
);

export const emptyCredentials: Credentials = {
  company: '',
  timezone: DEFAULT_TIMEZONE,
  token: '',
  branch: '',
  employee: '',
};
