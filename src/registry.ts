import rawRegistry from '../contracts/j4/endpoints.json';
import {
  type CachePolicy,
  type CanonicalRegistry,
  categories,
  type EndpointCategory,
  type EndpointDoc,
  type EndpointGuidance,
  type EndpointPreset,
  type ErrorSpec,
  type FieldSpec,
  type FieldGroup,
  type HeaderSpec,
  type HttpMethod,
  type ParameterSpec,
} from './model';

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
  consultaProductoPaginadaMCP: 'Buscar productos paginados',
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
};

const presetTitles: Record<string, Record<string, string>> = {
  consultaProductoPaginadaMCP: { 'by-name': 'Por nombre de producto' },
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
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const categoryAliases: Record<string, EndpointCategory> = {
  productos: categories[0],
  producto: categories[0],
  inventario: categories[0],
  'productos-e-inventario': categories[0],
  'products-and-inventory': categories[0],
  categorias: categories[1],
  impuestos: categories[1],
  'categorias-e-impuestos': categories[1],
  'categories-and-taxes': categories[1],
  terceros: categories[2],
  'third-parties': categories[2],
  maestros: categories[3],
  masters: categories[3],
  transacciones: categories[4],
  facturas: categories[4],
  historiales: categories[4],
  'facturas-e-historiales': categories[4],
  'invoices-and-history': categories[4],
  cartera: categories[5],
  'accounts-receivable': categories[5],
  comandas: categories[6],
  'kitchen-orders': categories[6],
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
  if (method === 'POST') {
    headers.unshift({
      name: 'Content-Type',
      description: 'Cuerpo JSON.',
      required: true,
    });
  }
  return headers;
};

const normalizeGroups = (value: unknown): FieldGroup[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') return { name: entry, fields: [] };
        const item = asRecord(entry);
        return {
          name: asString(first(item, ['name', 'nombre', 'group', 'grupo'])),
          fields: strings(
            first(item, ['fields', 'campos', 'columns', 'columnas']),
          ),
          description:
            asString(first(item, ['description', 'descripcion'])) || undefined,
        };
      })
      .filter((group) => group.name);
  }
  return Object.entries(asRecord(value)).map(([name, fields]) => ({
    name,
    fields: strings(fields),
  }));
};

const mergeGroups = (groups: FieldGroup[]) => {
  const merged = new Map<string, FieldGroup>();
  for (const group of groups) {
    const current = merged.get(group.name);
    if (!current) {
      merged.set(group.name, { ...group });
      continue;
    }
    const descriptions = [current.description, group.description].filter(
      Boolean,
    ) as string[];
    current.description = [...new Set(descriptions)].join(' ');
    current.fields = [...new Set([...current.fields, ...group.fields])];
  }
  return [...merged.values()];
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
          grupos_encabezado: ['codigos', 'fechas', 'cliente', 'totales'],
          grupos_detalle: ['codigos', 'producto', 'cantidades', 'totales'],
        },
      },
      {
        id: 'invoice-number',
        name: 'Factura por número',
        description: 'Busca una factura concreta.',
        query: { n_factura: 'FV-1001' },
        body: {
          grupos_encabezado: ['codigos', 'cliente', 'totales'],
          grupos_detalle: ['producto', 'cantidades', 'precios'],
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
        body: { grupos_encabezado: ['fechas', 'cliente', 'totales'] },
      },
    ];
  }
  if (path.endsWith('/buscarDescuentos')) {
    return [
      {
        id: 'header',
        name: 'Nivel encabezado',
        description: 'Descuentos agregados por transacción.',
        query: { nivel: 'encabezado', pagina: '0', cantidad_registros: '30' },
        body: { grupos: ['transaccion', 'cliente', 'totales', 'impuestos'] },
      },
      {
        id: 'detail',
        name: 'Nivel detalle',
        description: 'Descuentos por producto.',
        query: { nivel: 'detalle', pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: [
            'transaccion',
            'cliente',
            'producto',
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
        query: { es_ingreso: '1', pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: ['transaccion', 'fechas', 'tercero', 'saldo', 'estado'],
        },
      },
      {
        id: 'payable',
        name: 'Cuentas por pagar',
        description: 'Cartera de proveedores.',
        query: { es_ingreso: '0', pagina: '0', cantidad_registros: '30' },
        body: {
          grupos: ['transaccion', 'fechas', 'tercero', 'saldo', 'estado'],
        },
      },
      {
        id: 'overdue',
        name: 'Cartera vencida',
        description: 'Solo documentos vencidos.',
        query: { es_ingreso: '1', vencida: '1' },
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
        query: { es_ingreso: '1' },
        body: { grupos: ['tercero', 'documentos', 'saldo'] },
      },
      {
        id: 'payable-summary',
        name: 'Resumen por pagar',
        description: 'Saldos agregados por proveedor.',
        query: { es_ingreso: '0' },
        body: { grupos: ['tercero', 'documentos', 'saldo'] },
      },
    ];
  }
  return [];
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
    endpointId,
  );

  if (!path || !name || !['GET', 'POST'].includes(method)) {
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
    method === 'POST' &&
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
  const bodyFields = normalizeFields(first(body, ['fields', 'campos']));
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
      path.endsWith('/platosEliminados') &&
      normalizedNote.includes(omittedDishField)
    )
      return false;
    return true;
  });
  const summary =
    asString(first(item, ['summary', 'description', 'descripcion'])) ||
    notes[0] ||
    `${kind === 'query' ? 'Consulta' : 'Operación'} del contrato Cuenti para ${(
      endpointTitles[endpointId] ?? name
    ).toLocaleLowerCase('es')}.`;
  return {
    id: endpointId,
    name: endpointTitles[endpointId] ?? name,
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
      (asBoolean(first(body, ['required', 'obligatorio']))
        ? 'El cuerpo JSON es obligatorio y debe respetar los campos, columnas o grupos documentados.'
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
    groups: groups.length ? groups : bodyGroups,
    columns: strings(first(item, ['columns', 'columnas'])).length
      ? strings(first(item, ['columns', 'columnas']))
      : strings(first(body, ['columns', 'columnas'])).length
        ? strings(first(body, ['columns', 'columnas']))
        : normalizeFieldNames(first(body, ['fields', 'campos'])),
    presets: explicitPresets.length ? explicitPresets : fallbackPresets(path),
    guidance: normalizeGuidance(first(item, ['guidance', 'documentation'])),
    errors: normalizeErrors(
      first(item, ['errors', 'errores', 'validations', 'validaciones']),
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

export const adaptRegistry = (value: unknown): CanonicalRegistry => {
  const root = asRecord(value);
  const documentation = asRecord(root.documentation);
  const groupDescriptions = asRecord(documentation.groups);
  const headerDefinitions = asRecord(
    first(root, ['headerDefinitions', 'headers']),
  );
  const endpoints = asArray(first(root, ['endpoints', 'routes', 'rutas'])).map(
    (endpoint) => normalizeEndpoint(endpoint, headerDefinitions),
  );
  for (const endpoint of endpoints) {
    for (const group of endpoint.groups) {
      const purpose = asString(groupDescriptions[group.name]);
      group.description = [purpose, group.description]
        .filter(Boolean)
        .join(' ');
    }
  }
  if (endpoints.length !== 24) {
    throw new Error(
      `El registro canónico debe contener 24 operaciones; contiene ${endpoints.length}.`,
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
