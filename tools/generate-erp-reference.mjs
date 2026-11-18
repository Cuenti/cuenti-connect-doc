import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicContract } from '../src/registry/publicContract.mjs';

const json = (value) => `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
const cell = (value) =>
  String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, rows) =>
  [headers, headers.map(() => '---'), ...rows]
    .map((row) => `| ${row.map(cell).join(' | ')} |`)
    .join('\n');
const list = (values) => values.map((value) => `- ${value}`).join('\n');
const omit = (value, hidden) =>
  value && !Array.isArray(value) && typeof value === 'object'
    ? Object.fromEntries(
        Object.entries(value).filter(([key]) => !hidden.has(key)),
      )
    : value;

const constraints = (field) =>
  [
    field.description,
    field.notes,
    field.type && `Tipo: ${field.type}`,
    field.type || Object.hasOwn(field, 'nullable')
      ? field.nullable
        ? 'admite null'
        : 'no admite null'
      : 'Tipo no declarado; consulta las reglas de la operación',
    field.allowed &&
      `valores: ${field.allowed.map((value) => `\`${value}\``).join(', ')}`,
    field.minimum !== undefined && `mínimo: ${field.minimum}`,
    field.maximum !== undefined && `máximo: ${field.maximum}`,
    field.exclusiveMinimum !== undefined &&
      `mayor que: ${field.exclusiveMinimum}`,
    field.minimumItems !== undefined &&
      `mínimo de elementos: ${field.minimumItems}`,
    field.maximumItems !== undefined &&
      `máximo de elementos: ${field.maximumItems}`,
    field.default !== undefined &&
      `predeterminado: ${JSON.stringify(field.default)}`,
    field.pattern && `patrón: \`${field.pattern}\``,
    field.uniqueWithinRequest && 'único dentro de la solicitud',
  ]
    .filter((value) => value !== false && value !== undefined && value !== '')
    .join('; ');

const fields = (schema, prefix = '') =>
  (schema.fields ?? []).flatMap((value) => {
    const field = typeof value === 'string' ? { name: value } : value;
    const path = `${prefix}${field.name}`;
    const required =
      field.required ||
      schema.createRequired?.includes(field.name) ||
      (field.name === 'telefonos' &&
        schema.createRequired?.some((rule) => rule.includes('teléfono'))) ||
      (field.name === 'correos' &&
        schema.createRequired?.some((rule) => rule.includes('correo')));
    return [
      [`\`${path}\``, required ? 'Sí' : 'No', constraints(field)],
      ...fields(field, `${path}.`),
      ...fields(field.items ?? {}, `${path}[].`),
    ];
  });

const project = (sourceContract, route) => {
  const contract = publicContract(sourceContract, route);
  const translation = route.translation ?? {};
  const bodyHidden = new Set([
    ...Object.keys(translation.fixedBody ?? {}),
    ...Object.values(translation.pathToBody ?? {}),
  ]);
  const body = {
    ...contract.body,
    fields: (contract.body.fields ?? []).filter(
      (field) => !bodyHidden.has(field.name ?? field),
    ),
    example: omit(contract.body.example, bodyHidden),
    createRequired:
      route.method === 'PUT'
        ? []
        : contract.body.createRequired?.filter(
            (rule) => ![...bodyHidden].some((name) => rule.includes(name)),
          ),
    updateRules:
      route.method === 'PUT'
        ? contract.body.updateRules?.filter(
            (rule) => ![...bodyHidden].some((name) => rule.includes(name)),
          )
        : [],
  };
  const query = (contract.params.query ?? []).filter(
    (parameter) =>
      !parameter.documentationHidden &&
      !Object.hasOwn(translation.fixedQuery ?? {}, parameter.name),
  );
  const path = [...route.path.matchAll(/\{([^{}]+)\}/g)].map(
    ([, name]) =>
      contract.params.path.find((parameter) => parameter.name === name) ?? {
        name,
        type: 'integer',
        required: true,
        minimum: 1,
      },
  );
  const example = {};
  for (const parameter of path) {
    const source = translation.pathToBody?.[parameter.name];
    example[parameter.name] =
      contract.tryIt?.path?.[parameter.name] ??
      contract.tryIt?.body?.[source] ??
      parameter.example ??
      `{{${parameter.name}}}`;
  }
  for (const parameter of query) {
    const value =
      contract.tryIt?.query?.[parameter.name] ??
      (parameter.required
        ? (parameter.example ?? `{{${parameter.name}}}`)
        : undefined);
    if (value !== undefined) example[parameter.name] = value;
  }
  if (body.type !== 'none')
    example.body = omit(contract.tryIt?.body ?? body.example ?? {}, bodyHidden);
  if (contract.operation === 'mutation')
    example.confirmation = `confirm:${route.routeId}`;
  return {
    ...contract,
    ...route,
    summary: route.description ?? route.title ?? contract.summary,
    id: route.routeId,
    body,
    params: { path, query },
    example,
  };
};

const section = (endpoint, headerDefinitions) => {
  const blocks = [
    `### \`${endpoint.id}\`: ${endpoint.title}`,
    `**Para qué sirve:** ${endpoint.summary ?? endpoint.purpose ?? endpoint.title}`,
    `**Método:** \`${endpoint.method}\`.`,
    `**Ruta:** \`${endpoint.path}\`.`,
    `**Tipo:** ${endpoint.operation === 'mutation' ? 'Mutación: confirma antes de ejecutarla y no reintentes automáticamente.' : 'Consulta.'}`,
    '**Encabezados del REST público**',
    table(
      ['Encabezado', 'Obligatorio', 'Uso'],
      endpoint.requiredHeaders.map((header) => [
        `\`${header}\``,
        'Sí',
        headerDefinitions[header]?.description ??
          `Valor de referencia: \`${headerDefinitions[header]?.example ?? header}\``,
      ]),
    ),
    'En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos. `confirmation` es un argumento MCP, nunca un campo del body REST.',
  ];
  for (const [location, title] of [
    ['path', 'Parámetros de ruta'],
    ['query', 'Filtros disponibles'],
  ]) {
    if (endpoint.params[location].length)
      blocks.push(
        `**${title}**`,
        table(
          ['Dato', 'Obligatorio', 'Valores que acepta'],
          endpoint.params[location].map((field) => [
            `\`${field.name}\``,
            field.required ? 'Sí' : 'No',
            constraints(field),
          ]),
        ),
      );
  }
  blocks.push(
    `**Cuerpo:** ${endpoint.body.type === 'none' ? 'sin cuerpo' : `${endpoint.body.required ? 'obligatorio' : 'opcional'}; ${endpoint.body.type}`}.`,
  );
  if (fields(endpoint.body).length)
    blocks.push(
      '**Campos del cuerpo**',
      'Los campos anidados obligatorios se exigen cuando se envía su objeto padre. Las reglas condicionales se indican debajo.',
      table(
        ['Dato', 'Obligatorio', 'Valores que acepta'],
        fields(endpoint.body),
      ),
    );
  const bodyRules = [
    ...(endpoint.body.rules ?? []),
    endpoint.body.minimumItems !== undefined &&
      `El cuerpo exige al menos ${endpoint.body.minimumItems} elementos.`,
    endpoint.body.maximumItems !== undefined &&
      `El cuerpo admite como máximo ${endpoint.body.maximumItems} elementos.`,
    endpoint.body.emptyBodyAllowed &&
      (endpoint.body.required
        ? 'Acepta {} como cuerpo para solicitar la proyección completa; no omitas el cuerpo.'
        : 'Admite cuerpo ausente o {}.'),
    endpoint.body.emptyBodyProjection &&
      `Proyección sin selección: ${endpoint.body.emptyBodyProjection}.`,
    endpoint.body.strict && 'No admite campos desconocidos en el cuerpo.',
    ...(endpoint.body.createRequired ?? []).map(
      (rule) => `Para crear: ${rule}.`,
    ),
    ...(endpoint.body.updateRules ?? []).map(
      (rule) => `Para actualizar: ${rule}.`,
    ),
  ].filter(Boolean);
  if (bodyRules.length) blocks.push('**Reglas del cuerpo**', list(bodyRules));
  if (endpoint.body.columns?.length)
    blocks.push(
      '**Columnas permitidas**',
      endpoint.body.columns.map((name) => `\`${name}\``).join(', '),
    );
  if (endpoint.body.groups?.length)
    blocks.push('**Grupos permitidos**', json(endpoint.body.groups));
  if (endpoint.body.selectionRules)
    blocks.push(
      '**Reglas de selección de grupos**',
      json(endpoint.body.selectionRules),
    );
  if (
    endpoint.body.fields?.some(
      (field) => field.items?.additionalProperties === true,
    )
  ) {
    blocks.push(
      'Los elementos de `objDetalle` admiten campos adicionales; los demás objetos conservan sus campos declarados.',
    );
  }
  blocks.push(
    '**Ejemplo de argumentos:**',
    json(endpoint.example),
    `**Respuesta esperada:** ${endpoint.response.shape}.`,
    '**Ejemplo de respuesta:**',
    json(endpoint.response.example),
  );
  if (endpoint.response.fallbackExample)
    blocks.push(
      '**Respuesta alternativa de pago confirmado:**',
      'Si falta el comprobante enriquecido, consulta por ID sin repetir la escritura.',
      json(endpoint.response.fallbackExample),
    );
  if (endpoint.response.envelope)
    blocks.push(
      'Este REST usa `{success,data,error,request_id}`. En error, `data=null` y `error={code,message,retryable,field?}`.',
    );
  const errors = (endpoint.errors ?? []).map((error) =>
    typeof error === 'string'
      ? error
      : `${error.status ?? ''} ${error.description ?? ''}`.trim(),
  );
  if (errors.length) blocks.push('**Errores y límites**', list(errors));
  if (endpoint.notes?.length) blocks.push('**Notas**', list(endpoint.notes));
  if (endpoint.autocompletedFields?.length)
    blocks.push(
      '**Campos autocompletados**',
      table(
        ['Campo', 'Valor', 'Descripción'],
        endpoint.autocompletedFields.map((field) => [
          field.name,
          field.value,
          field.description,
        ]),
      ),
    );
  return blocks.join('\n\n');
};

export const renderErpReference = (registry, external) => {
  const contracts = new Map(
    registry.endpoints.map((endpoint) => [endpoint.id, endpoint]),
  );
  const endpoints = registry.routes.map((route) =>
    project(contracts.get(route.contract), route),
  );
  for (const tool of external.tools)
    endpoints.push({
      ...tool,
      params: { path: [], query: [] },
      example: { body: tool.body.example, confirmation: `confirm:${tool.id}` },
    });
  const categories = [
    ...new Set(endpoints.map((endpoint) => endpoint.category)),
  ];
  return `${[
    '# Catálogo funcional de Cuenti MCP ERP',
    '<!-- Generated by tools/generate-erp-reference.mjs from contracts/j4/endpoints.json and contracts/mcp/external-tools.json. Do not edit manually. -->',
    '## Cómo usarlo',
    list([
      'Elige la herramienta por necesidad y contrasta siempre los argumentos con `tools/list` del servidor MCP.',
      'Los ejemplos de argumentos son MCP. Para REST usa únicamente `body` como cuerpo y los parámetros de ruta/consulta donde corresponda; nunca envíes `confirmation` al ERP.',
      'Solicita confirmación antes de cada mutación. Ante un resultado desconocido consulta el estado; no repitas automáticamente.',
      'Usa los IDs reales de la empresa; pagina solo cuando el contrato lo admita. Los ejemplos no demuestran despliegue en producción.',
      `El catálogo contiene ${registry.routes.length} rutas ERP y ${external.tools.length} herramienta externa.`,
      'Consulta [Finanzas y documentos](mcp-guide.md#finanzas-y-documentos) para errores, pagos y referencias de pedidos.',
    ]),
    '## Herramientas por necesidad',
    table(
      ['Necesidad', 'Herramientas'],
      categories.map((category) => [
        category,
        endpoints
          .filter((endpoint) => endpoint.category === category)
          .map((endpoint) => `\`${endpoint.id}\``)
          .join(', '),
      ]),
    ),
    ...categories.flatMap((category) => [
      `## ${category}`,
      ...endpoints
        .filter((endpoint) => endpoint.category === category)
        .map((endpoint) => section(endpoint, registry.headerDefinitions)),
    ]),
  ].join('\n\n')}\n`;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(import.meta.dirname, '..');
  const load = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  writeFileSync(
    resolve(root, 'public/skills/cuenti-mcp-erp/references/endpoints.md'),
    renderErpReference(
      load('contracts/j4/endpoints.json'),
      load('contracts/mcp/external-tools.json'),
    ),
  );
  execFileSync(
    'python3',
    [
      '-c',
      `
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path('public/skills')
files = ['SKILL.md', 'references/endpoints.md', 'references/mcp-guide.md', 'references/catalogos.md']
with ZipFile(root / 'cuenti-mcp-erp.zip', 'w', compression=ZIP_DEFLATED) as archive:
    for file in files:
        name = 'cuenti-mcp-erp/' + file
        info = ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
        info.external_attr = 0o100644 << 16
        info.compress_type = ZIP_DEFLATED
        archive.writestr(info, (root / name).read_bytes())
`,
    ],
    { cwd: root },
  );
  console.log(
    'ERP reference and ZIP generated from the local canonical registry.',
  );
}
