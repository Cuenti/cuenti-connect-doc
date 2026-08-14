import type { FieldSpec, ParameterSpec } from '../../model';

const PresetValues = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item !== 'object' || item === null)) {
      return (
        <ul className="preset-chip-list">
          {value.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Preset values can repeat; the index preserves duplicate entries.
            <li key={`${String(item)}-${index}`}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="preset-record-list">
        {value.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Preset records can repeat; the index preserves duplicate entries.
          <section className="preset-record" key={`record-${index}`}>
            <h5>Registro {index + 1}</h5>
            <PresetValues value={item} />
          </section>
        ))}
      </div>
    );
  }

  if (value && typeof value === 'object') {
    return (
      <dl className="preset-value-list">
        {Object.entries(value).map(([name, item]) => (
          <div className="preset-value" key={name}>
            <dt>{name}</dt>
            <dd>
              <PresetValues value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (value === null || value === undefined || value === '') {
    return <span className="preset-empty-value">Sin valor</span>;
  }

  return <span className="preset-scalar">{String(value)}</span>;
};

export const PresetOptions = ({
  path,
  query,
  body,
}: {
  path?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}) => {
  const sections = [
    { label: 'Valores de la ruta', value: path },
    { label: 'Filtros', value: query },
    { label: 'Datos enviados', value: body },
  ].filter(({ value }) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  });

  return (
    <div className="preset-options">
      {sections.map(({ label, value }) => (
        <section className="preset-option-group" key={label}>
          <h4>{label}</h4>
          <PresetValues value={value} />
        </section>
      ))}
    </div>
  );
};

export const ParameterTable = ({
  parameters,
  empty,
}: {
  parameters: ParameterSpec[];
  empty: string;
}) => {
  if (!parameters.length) return <p className="empty-note">{empty}</p>;
  return (
    <section className="table-scroll" aria-label="Tabla de parámetros">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Regla</th>
            <th>Requerido</th>
            <th>Predeterminado</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => (
            <tr key={parameter.name}>
              <td>
                <code>{parameter.name}</code>
              </td>
              <td>{parameter.typeLabel ?? parameter.type ?? '—'}</td>
              <td>
                {parameter.description || 'Sin descripción adicional.'}
                {parameter.allowedValues?.length ? (
                  <small>
                    {' '}
                    Valores:{' '}
                    {parameter.allowedValues
                      .map((value) =>
                        parameter.allowedValueLabels?.[value]
                          ? `${value} (${parameter.allowedValueLabels[value]})`
                          : value,
                      )
                      .join(', ')}
                  </small>
                ) : null}
              </td>
              <td>{parameter.required ? 'Sí' : 'No'}</td>
              <td>{parameter.defaultValue ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const formatAllowedValues = (field: ParameterSpec) =>
  field.allowedValues?.length
    ? `Valores: ${field.allowedValues
        .map((value) =>
          field.allowedValueLabels?.[value]
            ? `${value} (${field.allowedValueLabels[value]})`
            : value,
        )
        .join(', ')}`
    : undefined;

const formatPattern = (pattern?: string) => {
  if (!pattern) return undefined;
  if (pattern === '^[0-9]{1,50}$') {
    return 'Formato: solo dígitos, entre 1 y 50 caracteres.';
  }
  return 'Formato: debe cumplir la regla definida para este campo.';
};

const formatFieldConstraints = (field: ParameterSpec) =>
  [
    formatPattern(field.pattern),
    field.minimum !== undefined ? `Mínimo: ${field.minimum}` : undefined,
    field.maximum !== undefined ? `Máximo: ${field.maximum}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

const flattenFields = (
  fields: FieldSpec[],
  prefix = '',
): Array<{ field: FieldSpec; path: string }> =>
  fields.flatMap((field) => {
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    const children = [
      ...(field.fields ? flattenFields(field.fields, path) : []),
      ...(field.itemFields ? flattenFields(field.itemFields, `${path}[]`) : []),
    ];
    return [{ field, path }, ...children];
  });

export const BodyFieldsTable = ({ fields }: { fields: FieldSpec[] }) => {
  const rows = flattenFields(fields);
  if (!rows.length) return null;
  return (
    <section className="body-fields" aria-label="Campos del cuerpo JSON">
      <h3>Campos del cuerpo</h3>
      <p className="field-table-intro">
        Usa estos nombres, tipos y reglas para construir el cuerpo de la
        solicitud. Los campos anidados conservan la ruta que deben tener en el
        JSON.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Valores y formato</th>
              <th>Requerido</th>
              <th>Predeterminado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ field, path }) => {
              const allowed = formatAllowedValues(field);
              const constraints = formatFieldConstraints(field);
              return (
                <tr key={path}>
                  <td>
                    <code>{path}</code>
                  </td>
                  <td>{field.typeLabel ?? field.type ?? '—'}</td>
                  <td>{field.description || 'Sin descripción adicional.'}</td>
                  <td>
                    {allowed || constraints ? (
                      <>
                        {allowed ? <span>{allowed}</span> : null}
                        {allowed && constraints ? <br /> : null}
                        {constraints ? <span>{constraints}</span> : null}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{field.required ? 'Sí' : 'No'}</td>
                  <td>{field.defaultValue ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
