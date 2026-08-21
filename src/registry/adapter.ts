import rawRegistry from '../../contracts/j4/endpoints.json';
import externalTools from '../../contracts/mcp/external-tools.json';
import { getGroupDescription } from '../fieldDescriptions';
import {
  type CachePolicy,
  type CanonicalRegistry,
  categories,
  type EndpointCategory,
  type EndpointDoc,
  type EndpointGuidance,
  type EndpointPreset,
  type ErrorSpec,
  type FieldGroup,
  type FieldSpec,
  type HeaderSpec,
  type HttpMethod,
  type ParameterSpec,
} from '../model';

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);
const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : fallback;
const asBoolean = (value: unknown, fallback = false) =>
  typeof value === 'boolean' ? value : fallback;
const asNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeGuidance = (value: unknown): EndpointGuidance | undefined => {
  const guidance = asRecord(value);
  const rows = asArray(guidance.rows).flatMap((row) => {
    const item = asRecord(row);
    const normalized = {
      value: asString(item.value),
      field: asString(item.field),
      use: asString(item.use),
      rule: asString(item.rule),
    };
    return normalized.value && normalized.field ? [normalized] : [];
  });
  if (!rows.length) return undefined;
  return {
    title: asString(guidance.title),
    intro: asString(guidance.intro),
    rows,
    notes: strings(guidance.notes),
    examples: asArray(guidance.examples).flatMap((example) => {
      const item = asRecord(example);
      return item.title && item.value !== undefined
        ? [{ title: asString(item.title), value: item.value }]
        : [];
    }),
  };
};

const recordStrings = (value: unknown) =>
  Object.fromEntries(
    Object.entries(asRecord(value))
      .map(([key, item]) => [key, asString(item)])
      .filter(([, item]) => item),
  );

const first = (record: UnknownRecord, keys: string[]) => {
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
};

const strings = (value: unknown) =>
  asArray(value)
    .map((item) => asString(item))
    .filter(Boolean);

const endpointTitles: Record<string, string> = {
  buscarProductosCatalogo: 'Buscar productos del catálogo',
  buscarCategorias: 'Buscar categorías',
  actualizarImpuestosLicores: 'Actualizar impuestos de licores',
  buscarTercero: 'Buscar terceros',
  guardarTercero: 'Guardar tercero',
  buscarImpuestos: 'Buscar impuestos',
  buscarBancos: 'Buscar bancos',
  buscarMediosPago: 'Buscar medios de pago',
  buscarConsecutivos: 'Buscar consecutivos de documentos',
  buscarSucursales: 'Buscar sucursales',
  buscarEmpleados: 'Buscar empleados',
  buscarTransacciones: 'Buscar transacciones',
  buscarProductosComprados: 'Buscar productos comprados',
  buscarDescuentos: 'Buscar descuentos',
  buscarConsolidado: 'Buscar historial consolidado',
  buscarCartera: 'Buscar cuentas por cobrar y pagar',
  buscarResumenTerceros: 'Resumir saldos por tercero',
  obtenerComandas: 'Obtener comandas',
  platosEliminados: 'Buscar platos eliminados',
  buscarDocumentosComerciales: 'Buscar documentos comerciales',
  buscarProductosDocumentosComerciales:
    'Buscar productos de documentos comerciales',
  buscarDescuentosDocumentosComerciales:
    'Buscar descuentos de documentos comerciales',
  buscarConsolidadoDocumentosComerciales: 'Consolidar documentos comerciales',
};

const presetTitles: Record<string, Record<string, string>> = {
  buscarProductosCatalogo: {
    'active-stock': 'Productos activos con inventario',
  },
  buscarCategorias: { 'active-tree': 'Árbol de categorías activas' },
  actualizarImpuestosLicores: {
    'partial-tax-update': 'Actualización parcial de impuestos',
  },
  buscarTercero: { customers: 'Clientes' },
  guardarTercero: {
    create: 'Crear',
    'partial-update': 'Actualización parcial',
  },
  buscarImpuestos: { active: 'Impuestos activos' },
  buscarBancos: { active: 'Bancos activos' },
  buscarMediosPago: { active: 'Medios de pago activos' },
  buscarConsecutivos: { active: 'Consecutivos activos' },
  buscarSucursales: { active: 'Sucursales activas' },
  buscarEmpleados: { active: 'Empleados activos' },
  buscarTransacciones: {
    'sales-history': 'Historial de ventas',
    'full-by-id': 'Factura completa por ID',
    'with-comments-and-files': 'Factura con comentarios y archivos',
    voided: 'Facturas anuladas',
  },
  buscarProductosComprados: {
    'customer-history': 'Productos comprados por cliente',
  },
  buscarDescuentos: {
    'header-discounts': 'Descuentos de factura',
    'line-discounts': 'Descuentos de producto',
  },
  buscarConsolidado: {
    'by-customer': 'Por cliente',
    'by-employee': 'Por empleado',
    'by-salesperson': 'Por vendedor',
  },
  buscarCartera: {
    receivables: 'Cuentas por cobrar',
    payables: 'Cuentas por pagar',
    overdue: 'Cuentas por cobrar vencidas',
  },
  buscarResumenTerceros: {
    'receivable-summary': 'Resumen por cobrar',
    'payable-summary': 'Resumen por pagar',
  },
  obtenerComandas: { 'active-branch': 'Comandas activas por sucursal' },
  platosEliminados: {
    'branch-audit': 'Auditoría de eliminaciones por sucursal',
  },
  buscarDocumentosComerciales: {
    sales: 'Facturas activas',
    'full-by-id': 'Documento completo por ID',
    'with-comments-and-files': 'Documento con comentarios y archivos',
  },
  buscarProductosDocumentosComerciales: {
    'by-customer': 'Productos por cliente',
  },
  buscarDescuentosDocumentosComerciales: {
    headers: 'Descuentos por documento',
  },
  buscarConsolidadoDocumentosComerciales: {
    'by-customer': 'Consolidado por cliente',
  },
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const categoryAliases: Record<string, EndpointCategory> = {
  productos: 'Catálogo',
  producto: 'Catálogo',
  catalogo: 'Catálogo',
  'productos-e-inventario': 'Catálogo',
  'products-and-inventory': 'Catálogo',
  inventario: 'Inventario',
  categorias: 'Catálogo',
  'categorias-e-impuestos': 'Catálogo',
  'categories-and-taxes': 'Catálogo',
  impuestos: 'Impuestos',
  tributario: 'Impuestos',
  terceros: 'Terceros',
  'third-parties': 'Terceros',
  transacciones: 'Transacciones',
  ventas: 'Transacciones',
  facturas: 'Transacciones',
  historiales: 'Transacciones',
  'facturas-e-historiales': 'Transacciones',
  'invoices-and-history': 'Transacciones',
  operativas: 'Otros documentos',
  'documentos-comerciales': 'Otros documentos',
  'other-documents': 'Otros documentos',
  finanzas: 'Finanzas y cartera',
  cartera: 'Finanzas y cartera',
  'accounts-receivable': 'Finanzas y cartera',
  organizacion: 'Organización',
  facturacion: 'Facturación',
  restaurante: 'Restaurante',
  comandas: 'Restaurante',
  'kitchen-orders': 'Restaurante',
  masters: 'Catálogo',
  maestros: 'Catálogo',
};

const normalizeCategory = (value: unknown): EndpointCategory => {
  const label = asString(value);
  const exact = categories.find((category) => category === label);
  const alias = categoryAliases[slugify(label)];
  if (exact) return exact;
  if (alias) return alias;
  throw new Error(`Categoría documental no reconocida: ${label || '(vacía)'}`);
};

const normalizeParameter = (value: unknown): ParameterSpec => {
  if (typeof value === 'string') {
    return { name: value, description: '', required: false };
  }
  const item = asRecord(value);
  const allowed = first(item, [
    'allowedValues',
    'allowed',
    'enum',
    'valoresPermitidos',
  ]);
  const typeLabels: Record<string, string> = {
    integer: 'entero',
    number: 'número',
    string: 'texto',
    boolean: 'booleano',
    array: 'arreglo',
    object: 'objeto',
    'integer-list': 'lista de enteros',
    'epoch-milliseconds': 'milisegundos desde epoch',
  };
  const ruleLabels: Record<string, string> = {
    partial: 'Coincidencia parcial.',
    parcial: 'Coincidencia parcial.',
    exact: 'Coincidencia exacta.',
    exacta: 'Coincidencia exacta.',
    'comma-separated': 'Valores separados por comas.',
    'base or presentation barcode': 'Código de barras base o de presentación.',
    'partial across three phone fields':
      'Coincidencia parcial en los tres campos de teléfono.',
    'partial across two email fields':
      'Coincidencia parcial en los dos campos de correo.',
    'Clamp to 1..1000': 'El valor se limita al intervalo de 1 a 1000.',
  };
  const type = asString(item.type);
  const nullable = item.nullable === true;
  const baseTypeLabel = (typeLabels[type] ?? type) || undefined;
  const typeLabel = baseTypeLabel
    ? `${baseTypeLabel}${nullable ? ' | null' : ''}`
    : undefined;
  const rule = asString(first(item, ['match', 'format', 'normalization']));
  const description = [
    asString(
      first(item, [
        'description',
        'descripcion',
        'notes',
        'notas',
        'rule',
        'regla',
      ]),
    ),
    type ? `Tipo: ${typeLabels[type] ?? type}.` : '',
    ruleLabels[rule] ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    name: asString(first(item, ['name', 'nombre', 'key'])),
    description,
    required: asBoolean(first(item, ['required', 'obligatorio'])),
    type: type || undefined,
    typeLabel,
    nullable,
    defaultValue:
      asString(first(item, ['defaultValue', 'default', 'predeterminado'])) ||
      undefined,
    allowedValues: strings(allowed).length ? strings(allowed) : undefined,
    allowedValueLabels: Object.keys(recordStrings(item.values)).length
      ? recordStrings(item.values)
      : undefined,
    example: asString(first(item, ['example', 'ejemplo'])) || undefined,
    pattern: asString(item.pattern) || undefined,
    minimum: asNumber(item.minimum),
    maximum: asNumber(item.maximum),
  };
};

const normalizeParameters = (value: unknown) =>
  asArray(value)
    .filter((parameter) => !asBoolean(asRecord(parameter).documentationHidden))
    .map(normalizeParameter)
    .filter((parameter) => parameter.name);

const normalizeFieldNames = (value: unknown) =>
  asArray(value)
    .map((field) =>
      typeof field === 'string'
        ? field
        : asString(first(asRecord(field), ['name', 'nombre', 'key'])),
    )
    .filter(Boolean);

const normalizeField = (value: unknown): FieldSpec => {
  const item = asRecord(value);
  const parameter = normalizeParameter(value);
  const fields = normalizeFields(first(item, ['fields', 'campos']));
  const items = asRecord(first(item, ['items', 'elementos']));
  const itemFields = normalizeFields(first(items, ['fields', 'campos']));
  const minimumItems = asNumber(
    first(item, ['minimumItems', 'minItems', 'min_items']),
  );
  return {
    ...parameter,
    path: parameter.name,
    fields: fields.length ? fields : undefined,
    itemFields: itemFields.length ? itemFields : undefined,
    minimumItems,
  };
};

const normalizeFields = (value: unknown): FieldSpec[] =>
  asArray(value)
    .map(normalizeField)
    .filter((field) => field.name);

const normalizeHeader = (value: unknown): HeaderSpec => {
  const parameter = normalizeParameter(value);
  const item = asRecord(value);
  return {
    ...parameter,
    sensitive:
      asBoolean(first(item, ['sensitive', 'secret', 'secreto'])) ||
      /authorization|token/i.test(parameter.name),
  };
};

const globalHeaders: HeaderSpec[] = [
  {
    name: 'X-Auth-Token-empresa',
    description: 'Identificador de la empresa.',
    required: true,
    sensitive: true,
  },
  {
    name: 'X-gtm',
    description: 'Zona horaria fija usada para interpretar fechas.',
    required: true,
    defaultValue: 'GMT-0500',
  },
  {
    name: 'X-Auth-Token-sucursal',
    description: 'Identificador de la sucursal afectada.',
    required: true,
    sensitive: true,
  },
  {
    name: 'X-Id-Empleado',
    description: 'Identificador del empleado que ejecuta la operación.',
    required: true,
  },
  {
    name: 'Authorization',
    description: 'Token de acceso con un único prefijo Bearer.',
    required: true,
    sensitive: true,
  },
];

const headerDescriptions: Record<string, string> = {
  'Content-Type': 'Tipo de contenido del cuerpo JSON.',
  'X-Auth-Token-empresa': 'Identificador de la empresa.',
  'X-gtm': 'Zona horaria fija usada para interpretar fechas.',
  Authorization: 'Token de acceso con un único prefijo Bearer.',
  'X-Auth-Token-sucursal': 'Identificador de la sucursal afectada.',
  'X-Id-Empleado': 'Identificador del empleado que ejecuta la operación.',
};

const defaultHeaders = (method: HttpMethod): HeaderSpec[] => {
  const headers: HeaderSpec[] = [...globalHeaders];
  if (method !== 'GET') {
    headers.unshift({
      name: 'Content-Type',
      description: 'Cuerpo JSON.',
      required: true,
    });
  }
  return headers;
};

const normalizeGroups = (value: unknown): FieldGroup[] => {
  const stringList = (entry: unknown) =>
    typeof entry === 'string' ? [entry] : strings(entry);
  const normalizeGroup = (
    entry: unknown,
    fallbackName?: string,
  ): FieldGroup => {
    if (typeof entry === 'string')
      return { name: entry, fields: [], type: 'object' };
    const item = asRecord(entry);
    const declaredName = asString(
      first(item, ['name', 'nombre', 'group', 'grupo', 'key']),
      fallbackName ?? '',
    );
    const aliasOf = asString(first(item, ['aliasOf', 'alias_of']));
    const name = aliasOf || declaredName;
    const aliases = [
      ...(aliasOf && declaredName && aliasOf !== declaredName
        ? [declaredName]
        : []),
      ...stringList(first(item, ['aliases', 'alias', 'aliasNames'])),
    ].filter((alias) => alias && alias !== name);
    const items = asRecord(first(item, ['items', 'elementos']));
    const fields = strings(
      first(item, ['fields', 'campos', 'columns', 'columnas']),
    );
    const itemFieldsFromEntry = stringList(
      first(item, ['itemFields', 'item_fields']),
    );
    const itemFields = itemFieldsFromEntry.length
      ? itemFieldsFromEntry
      : stringList(first(items, ['fields', 'campos', 'columns', 'columnas']));
    const type = asString(first(item, ['type', 'responseType', 'valueType']));
    return {
      name,
      fields,
      ...(itemFields.length ? { itemFields } : {}),
      ...(aliases.length ? { aliases: [...new Set(aliases)] } : {}),
      description:
        asString(first(item, ['description', 'descripcion'])) || undefined,
      level: ['header', 'detail', 'both'].includes(asString(item.level))
        ? (asString(item.level) as FieldGroup['level'])
        : undefined,
      type: type === 'array' || type === 'object' ? type : undefined,
    };
  };

  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeGroup(entry))
      .filter((group) => group.name);
  }
  return Object.entries(asRecord(value)).map(([name, definition]) =>
    normalizeGroup(
      typeof definition === 'string' || Array.isArray(definition)
        ? { fields: definition }
        : { ...asRecord(definition), name },
      name,
    ),
  );
};

const discountGroupLevels: Record<string, FieldGroup['level']> = {
  transaccion: 'both',
  documento: 'both',
  cliente: 'both',
  totales: 'both',
  empleado: 'header',
  vendedor: 'header',
  producto: 'detail',
  cantidades: 'detail',
  precios: 'detail',
  descuento: 'detail',
};

const classifyDiscountGroups = (groups: FieldGroup[], path: string) =>
  path.includes('/buscarDescuentos')
    ? groups.map((group) => ({
        ...group,
        level: discountGroupLevels[group.name] ?? group.level,
      }))
    : groups;

const mergeGroups = (groups: FieldGroup[]) => {
  const merged = new Map<string, FieldGroup>();
  const aliases = new Map(
    groups.flatMap((group) =>
      (group.aliases ?? []).map((alias) => [alias, group.name] as const),
    ),
  );
  for (const source of groups) {
    const canonicalName = aliases.get(source.name) ?? source.name;
    const group =
      canonicalName === source.name
        ? source
        : {
            ...source,
            name: canonicalName,
            aliases: [...(source.aliases ?? []), source.name],
          };
    const current = merged.get(canonicalName);
    if (!current) {
      merged.set(canonicalName, { ...group });
      continue;
    }
    const descriptions = [current.description, group.description].filter(
      Boolean,
    ) as string[];
    current.description = [...new Set(descriptions)].join(' ');
    current.fields = [...new Set([...current.fields, ...group.fields])];
    current.itemFields = [
      ...new Set([...(current.itemFields ?? []), ...(group.itemFields ?? [])]),
    ];
    current.aliases = [
      ...new Set([...(current.aliases ?? []), ...(group.aliases ?? [])]),
    ];
    current.level ??= group.level;
    current.type ??= group.type;
  }
  return [...merged.values()].map((group) => ({
    ...group,
    itemFields: group.itemFields?.length ? group.itemFields : undefined,
    aliases: group.aliases?.length ? group.aliases : undefined,
  }));
};

const normalizePresets = (
  value: unknown,
  endpointId: string,
): EndpointPreset[] =>
  asArray(value)
    .map((entry, index) => {
      const item = asRecord(entry);
      const name = asString(
        first(item, ['name', 'title', 'nombre']),
        `Ejemplo ${index + 1}`,
      );
      return {
        id: asString(item.id, slugify(name)),
        name:
          presetTitles[endpointId]?.[asString(item.id, slugify(name))] ?? name,
        description: asString(first(item, ['description', 'descripcion'])),
        path: Object.fromEntries(
          Object.entries(
            asRecord(first(item, ['path', 'pathParams', 'ruta'])),
          ).map(([key, itemValue]) => [key, asString(itemValue)]),
        ),
        query: Object.fromEntries(
          Object.entries(
            asRecord(first(item, ['query', 'filters', 'filtros'])),
          ).map(([key, itemValue]) => [key, asString(itemValue)]),
        ),
        body: first(item, ['body', 'cuerpo']),
      };
    })
    .filter((preset) => preset.name);

const fallbackPresets = (path: string): EndpointPreset[] => {
  if (path.endsWith('/buscarTransacciones')) {
    return [
      {
        id: 'invoices',
        name: 'Facturas detalladas',
        description: 'Listado paginado con encabezado y detalle.',
        query: { pagina: '0', cantidad_registros: '30', es_factura: '1' },
        body: {
          grupos: ['codigos', 'fechas', 'cliente', 'totales'],
          detalle: ['codigos', 'producto', 'cantidades', 'totales'],
        },
      },
      {
        id: 'invoice-number',
        name: 'Factura por número',
        description: 'Busca una factura concreta.',
        query: { n_factura: 'FV-1001' },
        body: {
          grupos: ['codigos', 'cliente', 'totales'],
          detalle: ['producto', 'cantidades', 'precios'],
        },
      },
      {
        id: 'sales-history',
        name: 'Historial de ventas',
        description: 'Ventas en un intervalo.',
        query: {
          pagina: '0',
          cantidad_registros: '30',
          es_ingreso: '1',
          fecha_desde: '1722470400000',
          fecha_hasta: '1725148799000',
        },
        body: { grupos: ['fechas', 'cliente', 'totales'] },
      },
    ];
  }
  if (path.endsWith('/buscarDescuentos')) {
    return [
      {
        id: 'header',
        name: 'Descuentos de encabezado',
        description: 'Descuentos agregados por transacción.',
        query: { pagina: '0', cantidad_registros: '30' },
        body: { grupos: ['transaccion', 'cliente', 'totales'] },
      },
      {
        id: 'detail',
        name: 'Descuentos de detalle',
        description: 'Descuentos por producto.',
        query: { pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: [
            'transaccion',
            'cliente',
            'producto',
            'cantidades',
            'precios',
            'descuento',
            'totales',
          ],
        },
      },
    ];
  }
  if (path.endsWith('/buscarConsolidado')) {
    return ['cliente', 'empleado', 'vendedor'].map((group) => ({
      id: group,
      name: `Consolidado por ${group}`,
      description: `Agrupa resultados por ${group}.`,
      query: { agrupar_por: group },
      body: { grupos: ['agrupacion', 'cantidad', 'totales'] },
    }));
  }
  if (path.endsWith('/buscarCartera')) {
    return [
      {
        id: 'receivable',
        name: 'Cuentas por cobrar',
        description: 'Cartera de clientes.',
        query: { pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: ['transaccion', 'fechas', 'tercero', 'saldo', 'estado'],
        },
      },
      {
        id: 'payable',
        name: 'Cuentas por pagar',
        description: 'Cartera de proveedores.',
        query: { pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: ['transaccion', 'fechas', 'tercero', 'saldo', 'estado'],
        },
      },
      {
        id: 'overdue',
        name: 'Cartera vencida',
        description: 'Solo documentos vencidos.',
        query: { vencida: '1' },
        body: { grupos: ['tercero', 'saldo', 'estado'] },
      },
    ];
  }
  if (path.endsWith('/buscarResumenTerceros')) {
    return [
      {
        id: 'receivable-summary',
        name: 'Resumen por cobrar',
        description: 'Saldos agregados por cliente.',
        query: {},
        body: { grupos: ['tercero', 'documentos', 'saldo'] },
      },
      {
        id: 'payable-summary',
        name: 'Resumen por pagar',
        description: 'Saldos agregados por proveedor.',
        query: {},
        body: { grupos: ['tercero', 'documentos', 'saldo'] },
      },
    ];
  }
  if (path.endsWith('/buscarDescuentos')) {
    return [
      {
        id: 'headers',
        name: 'Descuentos por documento',
        description: 'Descuentos agregados por documento.',
        query: {},
        body: {
          grupos: ['documento', 'cliente', 'empleado', 'vendedor', 'totales'],
        },
      },
    ];
  }
  return [];
};

const cloneRecord = (value: UnknownRecord): UnknownRecord =>
  JSON.parse(JSON.stringify(value)) as UnknownRecord;

const removeKeys = (value: unknown, hidden: Set<string>): unknown => {
  if (Array.isArray(value))
    return value.map((item) => removeKeys(item, hidden));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as UnknownRecord)
        .filter(([key]) => !hidden.has(key))
        .map(([key, item]) => [key, removeKeys(item, hidden)]),
    );
  }
  return value;
};

const redactTerms = (value: unknown, hidden: Set<string>): unknown => {
  if (Array.isArray(value))
    return value.map((item) => redactTerms(item, hidden));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as UnknownRecord).map(([key, item]) => [
        key,
        redactTerms(item, hidden),
      ]),
    );
  }
  if (typeof value === 'string') {
    return [...hidden]
      .sort((left, right) => right.length - left.length)
      .reduce(
        (text, term) => text.split(term).join('route-fixed-selector'),
        value,
      );
  }
  return value;
};

const projectPublicRoute = (
  contract: UnknownRecord,
  route: UnknownRecord,
): UnknownRecord => {
  const projected = cloneRecord(contract);
  const translation = asRecord(route.translation);
  const hiddenQuery = new Set(Object.keys(asRecord(translation.fixedQuery)));
  const hiddenBody = new Set(Object.keys(asRecord(translation.fixedBody)));
  const pathToBody = asRecord(translation.pathToBody);
  for (const name of Object.values(pathToBody)) hiddenBody.add(asString(name));
  const hiddenPath = new Set(Object.keys(asRecord(translation.fixedPath)));
  const hidden = new Set([...hiddenQuery, ...hiddenBody, ...hiddenPath]);
  const params = asRecord(
    first(projected, ['params', 'parameters', 'parametros']),
  );
  const sourceQuery = asArray(first(params, ['query', 'consulta']));
  const hiddenDocumentationQuery = new Set(
    sourceQuery
      .filter((parameter) => asBoolean(asRecord(parameter).documentationHidden))
      .map((parameter) =>
        asString(first(asRecord(parameter), ['name', 'nombre', 'key'])),
      ),
  );
  const query = sourceQuery.filter(
    (parameter) =>
      !hidden.has(
        asString(first(asRecord(parameter), ['name', 'nombre', 'key'])),
      ) &&
      !hiddenDocumentationQuery.has(
        asString(first(asRecord(parameter), ['name', 'nombre', 'key'])),
      ),
  );
  const path = asArray(first(params, ['path', 'ruta'])).filter(
    (parameter) =>
      !hiddenPath.has(
        asString(first(asRecord(parameter), ['name', 'nombre', 'key'])),
      ),
  );
  const pathNames = new Set(
    path.map((parameter) =>
      asString(first(asRecord(parameter), ['name', 'nombre', 'key'])),
    ),
  );
  for (const name of asString(route.path).matchAll(/\{([^{}]+)\}/g)) {
    if (!pathNames.has(name[1]))
      path.push({ name: name[1], type: 'integer', required: true, minimum: 1 });
  }
  projected.params = { ...params, query, path };
  const body = asRecord(projected.body);
  if (Object.keys(body).length) {
    body.fields = asArray(body.fields).filter(
      (field) =>
        !hiddenBody.has(
          asString(first(asRecord(field), ['name', 'nombre', 'key'])),
        ),
    );
    body.example = removeKeys(body.example, hiddenBody);
    projected.body = body;
  }
  if (projected.presets !== undefined)
    projected.presets = removeKeys(
      projected.presets,
      new Set([...hidden, ...hiddenDocumentationQuery]),
    );
  if (projected.tryIt !== undefined)
    projected.tryIt = removeKeys(
      projected.tryIt,
      new Set([...hidden, ...hiddenDocumentationQuery]),
    );
  projected.id = asString(route.routeId);
  projected.contractId = asString(route.contract);
  projected.method = asString(route.method).toUpperCase();
  projected.path = asString(route.path);
  projected.title = asString(route.title) || asString(projected.title);
  projected.category = asString(route.category) || asString(projected.category);
  projected.publicRoute = true;
  projected.descriptionId = asString(route.contract);
  return redactTerms(projected, hidden) as UnknownRecord;
};

const normalizeErrors = (value: unknown): ErrorSpec[] =>
  asArray(value).map((entry) => {
    if (typeof entry === 'string')
      return {
        status: '',
        description: entry,
      };
    const item = asRecord(entry);
    return {
      status: asString(first(item, ['status', 'code', 'codigo'])),
      description: asString(
        first(item, ['description', 'descripcion', 'message', 'mensaje']),
      ),
    };
  });

const publicErrors = (errors: ErrorSpec[]) =>
  errors.filter((error) => !/legacy|servidor|backend/i.test(error.description));

const documentMatchingGuidance = (
  endpointId: string,
): EndpointGuidance | undefined =>
  endpointId === 'grabarDocumentoSimple'
    ? {
        title: 'Elegir type_match_producto',
        intro: 'Selecciona cómo se localizará cada producto de objDetalle.',
        rows: [
          {
            value: '1',
            field: 'objDetalle[].id_producto',
            use: 'Modo 1: ID interno',
            rule: 'Envía id_producto y no envíes code.',
          },
          {
            value: '2',
            field: 'objDetalle[].code',
            use: 'Cuando conoces el SKU.',
            rule: 'Envía code con el SKU exacto.',
          },
          {
            value: '3',
            field: 'objDetalle[].code',
            use: 'Cuando conoces el código de barras.',
            rule: 'Envía code con el código de barras exacto.',
          },
        ],
        notes: ['No mezcles modos de identificación en una misma línea.'],
        examples: [],
      }
    : undefined;

const normalizeCache = (
  value: unknown,
  kind: 'query' | 'mutation',
  invalidations: unknown,
): CachePolicy => {
  const cache = asRecord(value);
  const modeValue = asString(
    first(cache, ['mode', 'policy', 'politica']) ?? value,
  ).toLowerCase();
  const ttlValue = first(cache, ['ttl', 'ttlSeconds', 'ttl_seconds']);
  return {
    mode:
      kind === 'mutation' || /bypass|no-cache|none/.test(modeValue)
        ? 'bypass'
        : 'cacheable',
    ttl:
      ttlValue === undefined
        ? undefined
        : `${asString(ttlValue)}${typeof ttlValue === 'number' ? ' s' : ''}`,
    invalidates: asArray(invalidations)
      .map((entry) => asString(first(asRecord(entry), ['domain', 'scope'])))
      .filter(Boolean),
    description:
      asString(first(cache, ['description', 'descripcion'])) || undefined,
  };
};

const normalizeBodyGroups = (value: unknown): FieldGroup[] => {
  const bodyGroups = asArray(value);
  const normalized: FieldGroup[] = [];
  for (const entry of bodyGroups) {
    const item = asRecord(entry);
    const condition = asString(first(item, ['when', 'condition']));
    const allowed = asArray(first(item, ['allowed', 'groups', 'grupos']));
    if (allowed.some((allowedItem) => typeof allowedItem === 'object')) {
      normalized.push(...normalizeGroups(allowed));
    } else {
      normalized.push(
        ...strings(allowed).map((name) => ({
          name,
          fields: [],
          description: condition ? `${name} (${condition}).` : undefined,
        })),
      );
    }
  }
  return normalized;
};

const normalizeEndpoint = (
  value: unknown,
  headerDefinitions: UnknownRecord,
): EndpointDoc => {
  const root = asRecord(value);
  const docs = asRecord(
    first(root, ['documentation', 'docs', 'documentacion']),
  );
  const item = { ...root, ...docs };
  const path = asString(first(item, ['path', 'route', 'ruta']));
  const name = asString(first(item, ['name', 'title', 'nombre']));
  const endpointId = asString(item.id, slugify(name));
  const contractId = asString(item.contractId, endpointId);
  const method = asString(
    first(item, ['method', 'httpMethod', 'metodo']),
  ).toUpperCase() as HttpMethod;
  const kindValue = asString(
    first(item, ['kind', 'classification', 'operation', 'type', 'tipo']),
  ).toLowerCase();
  const kind = /mutation|mutacion|write/.test(kindValue) ? 'mutation' : 'query';
  const params = asRecord(first(item, ['parameters', 'params', 'parametros']));
  const examples = asRecord(first(item, ['examples', 'ejemplos']));
  const body = asRecord(first(item, ['body', 'cuerpo']));
  const response = asRecord(first(item, ['response', 'respuesta']));
  const groups = normalizeGroups(first(item, ['groups', 'grupos']));
  const explicitPresets = normalizePresets(
    first(item, ['presets', 'variations', 'variaciones']),
    contractId,
  );

  if (!path || !name || !['GET', 'POST', 'PATCH', 'PUT'].includes(method)) {
    throw new Error(
      `Operación canónica incompleta: ${name || path || '(sin identificador)'}`,
    );
  }

  const requiredHeaders: HeaderSpec[] = asArray(
    first(item, ['requiredHeaders', 'headers', 'cabeceras']),
  ).map((header) => {
    const normalized = normalizeHeader(header);
    const definition = asRecord(headerDefinitions[normalized.name]);
    return {
      ...normalized,
      required: true,
      description:
        normalized.description ||
        headerDescriptions[normalized.name] ||
        'Encabezado obligatorio para esta operación.',
      example: asString(definition.example) || normalized.example,
      sensitive: asBoolean(definition.sensitive, normalized.sensitive),
    };
  });
  const mergedHeaders = [...requiredHeaders];
  for (const globalHeader of globalHeaders) {
    const current = mergedHeaders.find(
      (header) => header.name.toLowerCase() === globalHeader.name.toLowerCase(),
    );
    if (current) {
      Object.assign(current, {
        ...current,
        ...globalHeader,
        example: current.example ?? globalHeader.example,
        required: true,
        defaultValue: current.defaultValue ?? globalHeader.defaultValue,
      });
    } else {
      mergedHeaders.push({ ...globalHeader });
    }
  }
  if (
    method !== 'GET' &&
    !mergedHeaders.some(
      (header) => header.name.toLowerCase() === 'content-type',
    )
  ) {
    mergedHeaders.unshift({
      name: 'Content-Type',
      description: 'Cuerpo JSON.',
      required: true,
      sensitive: false,
    });
  }
  const bodyGroups = mergeGroups(
    normalizeBodyGroups(first(body, ['groups', 'grupos'])),
  );
  const classifiedGroups = classifyDiscountGroups(
    groups.length ? groups : bodyGroups,
    path,
  );
  const columns =
    first(item, ['projectionPolicy']) === 'groups-or-empty'
      ? []
      : first(body, ['allowColumns']) === false
        ? []
        : strings(first(item, ['columns', 'columnas'])).length
          ? strings(first(item, ['columns', 'columnas']))
          : strings(first(body, ['columns', 'columnas'])).length
            ? strings(first(body, ['columns', 'columnas']))
            : normalizeFieldNames(first(body, ['fields', 'campos']));
  const creationRequired = new Set(
    strings(body.createRequired).map((rule) => rule.split('=')[0].trim()),
  );
  if (contractId === 'guardarTercero') {
    if (strings(body.createRequired).some((rule) => /teléfono/i.test(rule))) {
      creationRequired.add('telefonos');
    }
    if (strings(body.createRequired).some((rule) => /correo/i.test(rule))) {
      creationRequired.add('correos');
    }
  }
  const bodyFields = normalizeFields(first(body, ['fields', 'campos'])).map(
    (field) =>
      creationRequired.has(field.name) ? { ...field, required: true } : field,
  );
  const retiredKitchenWrite = ['grabar', 'mesas'].join('');
  const retiredTaxFlag = ['impuesto', 'saludable'].join('_');
  const omittedDishField = ['id', 'transacion'].join('_');
  const notes = strings(first(item, ['notes', 'notas'])).filter((note) => {
    const normalizedNote = note.toLowerCase();
    if (
      normalizedNote.includes(retiredKitchenWrite) ||
      normalizedNote.includes(retiredTaxFlag)
    )
      return false;
    if (
      contractId === 'platosEliminados' &&
      normalizedNote.includes(omittedDishField)
    )
      return false;
    if (/legacy|servidor|backend/i.test(normalizedNote)) return false;
    return true;
  });
  const summary =
    asString(first(item, ['summary'])) ||
    asString(first(item, ['description', 'descripcion'])) ||
    notes[0] ||
    `${kind === 'query' ? 'Consulta' : 'Operación'} del contrato Cuenti para ${(
      asString(item.publicTitle) ||
        (endpointTitles[contractId] ?? endpointTitles[endpointId] ?? name)
    ).toLocaleLowerCase('es')}.`;
  const displayName =
    asString(item.publicTitle) ||
    endpointTitles[contractId] ||
    endpointTitles[endpointId] ||
    name;
  return {
    id: endpointId,
    contractId,
    name: displayName,
    summary,
    method,
    path,
    category: normalizeCategory(
      first(item, ['category', 'categoria', 'group']),
    ),
    kind,
    status: 'implemented',
    cache: normalizeCache(
      first(item, ['cache', 'cachePolicy', 'politicaCache']),
      kind,
      first(item, ['invalidates', 'invalidations', 'invalida']),
    ),
    headers: mergedHeaders.length ? mergedHeaders : defaultHeaders(method),
    pathParams: normalizeParameters(
      first(item, ['pathParams', 'pathParameters']) ??
        first(params, ['path', 'ruta']),
    ),
    queryParams: normalizeParameters(
      first(item, ['queryParams', 'queryParameters', 'filters', 'filtros']) ??
        first(params, ['query', 'consulta']),
    ),
    bodyRequired: asBoolean(first(body, ['required', 'obligatorio'])),
    bodyType: asString(body.type) || undefined,
    bodyFields,
    bodyDescription:
      asString(first(item, ['bodyDescription', 'descripcionBody'])) ||
      asString(first(body, ['description', 'descripcion'])) ||
      (asBoolean(first(body, ['required', 'obligatorio']))
        ? 'El cuerpo JSON es obligatorio y debe respetar los campos o grupos documentados.'
        : undefined),
    requestExample:
      first(item, ['requestExample', 'request']) ??
      first(examples, ['request', 'solicitud']) ??
      first(body, ['example', 'ejemplo']),
    responseContract:
      asString(first(response, ['shape', 'contract', 'tipo'])) || undefined,
    responseExample:
      first(item, ['responseExample']) ??
      first(examples, ['response', 'respuesta']) ??
      first(response, ['example', 'ejemplo']),
    groups: classifiedGroups,
    columns,
    compatibility:
      bodyGroups.length && columns.length
        ? { columns: [...columns] }
        : undefined,
    presets: explicitPresets.length ? explicitPresets : fallbackPresets(path),
    guidance:
      normalizeGuidance(first(item, ['guidance', 'documentation'])) ||
      documentMatchingGuidance(contractId),
    errors: publicErrors(
      normalizeErrors(
        first(item, ['errors', 'errores', 'validations', 'validaciones']),
      ),
    ),
    notes,
    rateLimit: asString(first(item, ['rateLimit', 'rate_limit'])) || undefined,
    queue: asString(first(item, ['queue', 'cola'])) || undefined,
    tryIt: (() => {
      const tryIt = asRecord(first(item, ['tryIt', 'probarConsulta']));
      if (!Object.keys(tryIt).length) return undefined;
      return {
        path: Object.fromEntries(
          Object.entries(asRecord(tryIt.path)).map(([key, itemValue]) => [
            key,
            asString(itemValue),
          ]),
        ),
        query: Object.fromEntries(
          Object.entries(asRecord(tryIt.query)).map(([key, itemValue]) => [
            key,
            asString(itemValue),
          ]),
        ),
        body: tryIt.body,
      };
    })(),
  };
};

const externalToolEndpoint = (value: unknown): UnknownRecord => {
  const tool = asRecord(value);
  const id = asString(tool.id);
  const rest = asRecord(tool.rest);
  const body = Object.keys(rest).length
    ? asRecord(rest.body)
    : asRecord(tool.body);
  const response = Object.keys(rest).length
    ? asRecord(rest.response)
    : asRecord(tool.response);
  return {
    id,
    contractId: id,
    publicRoute: true,
    publicTitle: asString(tool.title),
    title: asString(tool.title),
    name: asString(tool.title),
    summary: asString(tool.purpose),
    method: asString(tool.method).toUpperCase(),
    path: asString(tool.path),
    category: asString(tool.category),
    operation: asString(tool.operation, 'mutation'),
    requiredHeaders: asArray(tool.requiredHeaders),
    params: { path: [], query: [] },
    cache: { policy: asString(tool.cachePolicy, 'bypass') },
    body,
    response,
    notes: asArray(tool.notes),
    tryIt: { path: {}, query: {}, body: body.example },
  };
};

export const adaptRegistry = (value: unknown): CanonicalRegistry => {
  const root = asRecord(value);
  const documentation = asRecord(root.documentation);
  const groupDescriptions = asRecord(documentation.groups);
  const headerDefinitions = asRecord(
    first(root, ['headerDefinitions', 'headers']),
  );
  const contracts = new Map(
    asArray(root.endpoints).map((endpoint) => {
      const item = asRecord(endpoint);
      return [asString(item.id), item] as const;
    }),
  );
  const routes = asArray(root.routes);
  const source = routes.length
    ? routes.map((route) => {
        const item = asRecord(route);
        const contract = contracts.get(asString(item.contract));
        if (!contract) {
          throw new Error(
            `Contrato público no encontrado: ${asString(item.contract)}`,
          );
        }
        return projectPublicRoute(contract, item);
      })
    : asArray(first(root, ['endpoints', 'rutas']));
  const externalSource = asArray(asRecord(externalTools).tools).map(
    externalToolEndpoint,
  );
  const routeOccurrences = new Map<string, number>();
  const endpoints = [...source, ...externalSource].map((endpoint) => {
    const item = asRecord(endpoint);
    const contractId = asString(item.contractId);
    const occurrence = routeOccurrences.get(contractId) ?? 0;
    routeOccurrences.set(contractId, occurrence + 1);
    if (item.publicRoute) {
      item.publicTitle =
        asString(item.title) ||
        endpointTitles[contractId] ||
        asString(item.name);
    }
    return normalizeEndpoint(item, headerDefinitions);
  });
  for (const endpoint of endpoints) {
    for (const group of endpoint.groups) {
      const purpose = asString(groupDescriptions[group.name]);
      group.description = [
        purpose,
        group.description || getGroupDescription(group.name),
      ]
        .filter(Boolean)
        .join(' ');
      if (
        endpoint.contractId === 'buscarDescuentos' ||
        endpoint.contractId === 'buscarDescuentosDocumentosComerciales'
      ) {
        const levels: Record<string, FieldGroup['level']> = {
          documento: 'both',
          transaccion: 'both',
          cliente: 'both',
          totales: 'both',
          empleado: 'header',
          vendedor: 'header',
          producto: 'detail',
          cantidades: 'detail',
          precios: 'detail',
          descuento: 'detail',
        };
        for (const group of endpoint.groups) {
          group.level = levels[group.name] ?? group.level;
        }
      }
    }
  }
  if (endpoints.length !== 40) {
    throw new Error(
      `El registro público debe contener 40 operaciones; contiene ${endpoints.length}.`,
    );
  }
  if (
    new Set(endpoints.map((endpoint) => endpoint.id)).size !== endpoints.length
  ) {
    throw new Error(
      'El registro canónico contiene identificadores duplicados.',
    );
  }
  return {
    version: asString(
      first(root, ['version', 'schemaVersion', 'schema_version']),
      '1',
    ),
    endpoints,
  };
};

export const registry = adaptRegistry(rawRegistry);
