import type { EndpointDoc, ParameterSpec } from './model';

export interface Credentials {
  company: string;
  timezone: string;
  token: string;
  branch: string;
  employee: string;
}

export interface RequestDraft {
  path: Record<string, string>;
  query: Record<string, string>;
  body: string;
  credentials: Credentials;
}

export interface BuiltRequest {
  url: string;
  init: RequestInit;
  curl: string;
}

export interface CurlOptions {
  includeCredentials?: boolean;
}

export const DEFAULT_TIMEZONE = 'GMT-0500';

const bearerToken = (token: string) =>
  token
    .trim()
    .replace(/^(?:Bearer(?:\s+|$))+/i, '')
    .trim();

export const hasRequiredCredentials = (credentials: Credentials) => {
  const company = credentials.company.trim();
  const branch = credentials.branch.trim();
  const employee = credentials.employee.trim();
  const token = bearerToken(credentials.token);
  return (
    Boolean(company) &&
    !/\s/.test(company) &&
    Boolean(branch) &&
    !/\s/.test(branch) &&
    Boolean(employee) &&
    !/\s/.test(employee) &&
    (credentials.timezone.trim() || DEFAULT_TIMEZONE) === DEFAULT_TIMEZONE &&
    Boolean(token) &&
    !/\s/.test(token)
  );
};

const headerValues = (credentials: Credentials) => ({
  'X-Auth-Token-empresa': credentials.company.trim(),
  'X-gtm': credentials.timezone.trim() || DEFAULT_TIMEZONE,
  Authorization: bearerToken(credentials.token)
    ? `Bearer ${bearerToken(credentials.token)}`
    : '',
  'X-Auth-Token-sucursal': credentials.branch.trim(),
  'X-Id-Empleado': credentials.employee.trim(),
});

const headerPlaceholders: Record<string, string> = {
  'X-Auth-Token-empresa': '{{id_empresa}}',
  'X-gtm': DEFAULT_TIMEZONE,
  Authorization: 'Bearer {{token}}',
  'X-Auth-Token-sucursal': '{{id_sucursal}}',
  'X-Id-Empleado': '{{id_empleado}}',
  'Content-Type': 'application/json',
};

const valueFor = (values: Record<string, string>, parameter: ParameterSpec) =>
  values[parameter.name]?.trim() || parameter.defaultValue || '';

const validateRequired = (
  specs: ParameterSpec[],
  values: Record<string, string>,
  errors: string[],
) => {
  for (const parameter of specs) {
    if (parameter.required && !valueFor(values, parameter)) {
      errors.push(`${parameter.name} es obligatorio.`);
    }
  }
};

const normalizeBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/$/, '');

const shellQuote = (value: string) => `'${value.replace(/'/g, `'"'"'`)}'`;

const redactSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      /authorization|token|password|contrasena|contraseña|clave|secret/i.test(
        key,
      )
        ? '<valor-omitido>'
        : redactSecrets(item),
    ]),
  );
};

export const buildRequest = (
  endpoint: EndpointDoc,
  draft: RequestDraft,
  proxyBaseUrl = '',
  curlOptions: CurlOptions = {},
): BuiltRequest => {
  const errors: string[] = [];
  validateRequired(endpoint.pathParams, draft.path, errors);
  validateRequired(endpoint.queryParams, draft.query, errors);

  const requestHeaderValues = headerValues(draft.credentials);
  if (/\s/.test(requestHeaderValues['X-Auth-Token-empresa'])) {
    errors.push('X-Auth-Token-empresa no puede contener espacios.');
  }
  if (requestHeaderValues['X-gtm'] !== DEFAULT_TIMEZONE) {
    errors.push(`X-gtm debe ser ${DEFAULT_TIMEZONE}.`);
  }
  if (
    requestHeaderValues.Authorization &&
    !/^Bearer \S+$/.test(requestHeaderValues.Authorization)
  ) {
    errors.push(
      'Authorization debe usar Bearer seguido de un token sin espacios.',
    );
  }

  let path = endpoint.path;
  for (const parameter of endpoint.pathParams) {
    const value = valueFor(draft.path, parameter);
    path = path.replace(`{${parameter.name}}`, encodeURIComponent(value));
  }

  if (/\{[^}]+\}/.test(path))
    errors.push('Faltan parámetros obligatorios en la ruta.');

  const query = new URLSearchParams();
  for (const parameter of endpoint.queryParams) {
    const value = valueFor(draft.query, parameter);
    if (value) query.set(parameter.name, value);
  }

  const headers = new Headers();
  for (const header of endpoint.headers) {
    const value =
      requestHeaderValues[header.name as keyof typeof requestHeaderValues] ??
      '';
    if (header.required && !value && header.name !== 'Content-Type') {
      errors.push(`${header.name} es obligatorio.`);
    }
    if (value) headers.set(header.name, value);
  }

  let parsedBody: unknown;
  if (
    endpoint.method !== 'GET' &&
    endpoint.bodyRequired &&
    !draft.body.trim()
  ) {
    errors.push('El cuerpo JSON es obligatorio.');
  }
  if (endpoint.method !== 'GET' && draft.body.trim()) {
    try {
      parsedBody = JSON.parse(draft.body);
      headers.set('Content-Type', 'application/json');
    } catch {
      errors.push('El cuerpo debe contener JSON válido.');
    }
  }

  if (errors.length > 0) throw new Error(errors.join(' '));

  const queryString = query.toString();
  const url = `${normalizeBaseUrl(proxyBaseUrl)}${path}${queryString ? `?${queryString}` : ''}`;
  const init: RequestInit = {
    method: endpoint.method,
    headers,
    body:
      endpoint.method === 'GET' || parsedBody === undefined
        ? undefined
        : JSON.stringify(parsedBody),
  };

  const curlHeaders = endpoint.headers.map((header) => {
    const value = curlOptions.includeCredentials
      ? (requestHeaderValues[header.name as keyof typeof requestHeaderValues] ??
        '')
      : '';
    const headerValue =
      value ||
      headerPlaceholders[header.name] ||
      `<${header.name.toLocaleLowerCase()}>`;
    return `-H ${shellQuote(`${header.name}: ${headerValue}`)}`;
  });
  if (
    parsedBody !== undefined &&
    !endpoint.headers.some((header) => header.name === 'Content-Type')
  ) {
    curlHeaders.push(`-H ${shellQuote('Content-Type: application/json')}`);
  }
  const curlParts = [
    `curl --request ${endpoint.method}`,
    shellQuote(url),
    ...curlHeaders,
  ];
  if (parsedBody !== undefined) {
    curlParts.push(
      `--data ${shellQuote(JSON.stringify(redactSecrets(parsedBody), null, 2))}`,
    );
  }

  return { url, init, curl: curlParts.join(' \\\n  ') };
};

export const defaultDraft = (endpoint: EndpointDoc): RequestDraft => ({
  path: Object.fromEntries(
    endpoint.pathParams.map((parameter) => [
      parameter.name,
      endpoint.tryIt?.path[parameter.name] ??
        endpoint.presets[0]?.path?.[parameter.name] ??
        parameter.example ??
        '',
    ]),
  ),
  query: Object.fromEntries(
    endpoint.queryParams.map((parameter) => [
      parameter.name,
      endpoint.tryIt?.query[parameter.name] ??
        parameter.example ??
        parameter.defaultValue ??
        '',
    ]),
  ),
  body:
    (endpoint.tryIt?.body ?? endpoint.requestExample) === undefined
      ? ''
      : JSON.stringify(
          endpoint.tryIt?.body ?? endpoint.requestExample,
          null,
          2,
        ),
  credentials: {
    company: '',
    timezone: DEFAULT_TIMEZONE,
    token: '',
    branch: '',
    employee: '',
  },
});
