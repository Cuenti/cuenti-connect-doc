// Project public documentation without changing the shared canonical contract.
export const publicContract = (source, route) => {
  const contract = structuredClone(source);
  const omitted = new Set(route.translation?.omitBodyFields ?? []);
  if (omitted.size) {
    const visible = (entry) => !omitted.has(entry?.name ?? entry);
    const body = contract.body;
    if (body.fields) body.fields = body.fields.filter(visible);
    for (const group of body.groups ?? []) {
      if (group.key === 'grupos') group.allowed = group.allowed.filter(visible);
    }
    for (const example of [
      body.example,
      contract.tryIt?.body,
      ...(contract.presets ?? []).map((preset) => preset.body),
    ]) {
      if (!example) continue;
      for (const name of omitted) delete example[name];
      if (Array.isArray(example.grupos))
        example.grupos = example.grupos.filter(visible);
    }
    // Response samples describe the groups callers can select on this route.
    const rows = contract.response?.example?.[contract.expectedCollection];
    if (Array.isArray(rows)) {
      for (const row of rows) {
        for (const name of omitted) delete row[name];
      }
    }
  }
  const bounded = contract.response?.boundedQuery;
  const production = route.translation?.boundedProduction;
  if (bounded && contract.projectionPolicy === 'groups-or-empty') {
    const names = Object.keys(bounded.groups);
    contract.body = {
      ...contract.body,
      emptyBodyAllowed: true,
      allowColumns: false,
      strict: true,
      fields: [{ name: 'grupos', type: 'array', minimumItems: 1 }],
      groups: [
        {
          key: 'grupos',
          allowed: names.map((name) => ({
            name,
            fields: Object.keys(bounded.groups[name]),
          })),
        },
      ],
      rules: [
        'Cuerpo ausente o {} devuelve la proyección SAFE completa, no el resultado crudo del ERP.',
        'grupos, si se envía, debe ser una lista no vacía, sin duplicados y solo con grupos permitidos.',
        'No admite columnas, detalle ni paginación; devuelve el resultado completo acotado.',
      ],
    };
    contract.notes = [
      ...(contract.notes ?? []),
      `Fechas epoch-milliseconds obligatorias y ordenadas (fecha_desde <= fecha_hasta); máximo ${bounded.maxWindowDays} días.`,
      'Consulta de solo lectura: no requiere confirmación. Cache bypass; Cache-Control: no-store.',
      'Fechas de salida en epoch-milliseconds; las relaciones ausentes conservan null.',
      ...(contract.dateGranularity === 'local-day'
        ? [
            `Máximo ${bounded.maxWindowDays} días calendario inclusivos en GMT-0500; el origen expande ambos extremos al día local completo, sin precisión intradía.`,
          ]
        : []),
    ];
  }
  if (production) {
    contract.body.allowColumns = false;
    const allowed = contract.body.groups
      .find((group) => group.key === 'grupos')
      .allowed.map((group) => (typeof group === 'string' ? group : group.name));
    contract.body.fields = [
      {
        name: 'grupos',
        type: 'array',
        required: true,
        minimumItems: 1,
        allowed,
      },
    ];
    contract.body.rules = [
      ...(contract.body.rules ?? []),
      'El cuerpo es obligatorio: grupos debe ser una lista no vacía, sin duplicados y solo con grupos permitidos. {} no es válido; detalle es opcional.',
    ];
    contract.presets = (contract.presets ?? []).filter(
      (preset) => preset.id !== 'sales',
    );
    contract.tryIt = { ...contract.tryIt, query: {} };
    for (const parameter of contract.params.query) {
      if (
        ['id_sucursal', 'fecha_desde', 'fecha_hasta'].includes(parameter.name)
      ) {
        parameter.required = true;
        if (parameter.name === 'id_sucursal') parameter.minimum = 1;
      }
    }
    for (const document of contract.response.example.documentos ?? []) {
      document.codigos.tipo_documento =
        route.translation.fixedQuery.tipo_documento;
    }
    contract.summary = route.title;
    contract.notes = [
      ...(contract.notes ?? []),
      `Sucursal positiva y fechas epoch-milliseconds obligatorias, ordenadas; máximo ${route.translation.maxWindowDays} días.`,
      'Cobertura parcial: líneas comerciales de la orden, no consumos reales de producción. Sin filtro estado ni bodega.',
      'Conserva grupos, detalle y paginación nativa de documentos; consulta de solo lectura sin confirmación.',
    ];
  }
  return contract;
};
