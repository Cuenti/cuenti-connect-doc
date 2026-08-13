const dynamicIds = [
  ['id_plan_cuentas / id_plan_cuenta', 'Cuenta contable del ERP', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
  ['id_centro_costo', 'Centro de costos', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
  ['id_bodega', 'Bodega del movimiento o empleado', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
  ['id_lista_precios', 'Lista de precios', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
  ['id_ruta_despacho', 'Ruta de despacho', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
  ['id_cocina', 'Cocina que prepara una comanda', 'Preguntar el ID; no hay catálogo MCP dedicado.'],
];

const CatalogTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <div className="table-scroll catalog-table-scroll">
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join('-')}>
            {row.map((cell, index) => (
              <td key={`${row[0]}-${index}`}>
                {index === 0 ? <code>{cell}</code> : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CatalogGuide = () => (
  <div className="catalog-guide">
    <header className="catalog-guide-hero">
      <p className="eyebrow">Referencia independiente</p>
      <h1>Catálogos y valores base</h1>
      <p>
        Consulta esta sección para conocer el significado de los IDs y los
        valores enumerados que utiliza Cuenti.
      </p>
    </header>

    <div className="catalog-guide-content">
      <section className="catalog-guide-section" aria-labelledby="dynamic-ids-title">
        <p className="section-index">01 / IDs por empresa</p>
        <h2 id="dynamic-ids-title">IDs de configuración</h2>
        <CatalogTable
          headers={['Campo', 'Representa']}
          rows={dynamicIds.map(([field, meaning]) => [field, meaning])}
        />
      </section>

      <section className="catalog-guide-section" aria-labelledby="base-values-title">
        <p className="section-index">02 / Enumeraciones</p>
        <h2 id="base-values-title">Valores base confirmados</h2>
        <div className="catalog-value-grid">
          <CatalogTable
            headers={['Valor', 'Tipo de cliente']}
            rows={[
              ['1', 'General'],
              ['2', 'Referidor'],
            ]}
          />
          <CatalogTable
            headers={['Valor', 'Tipo de tercero']}
            rows={[
              ['1', 'Cliente'],
              ['2', 'Proveedor'],
              ['3', 'Cliente y proveedor'],
            ]}
          />
          <CatalogTable
            headers={['Valor', 'Legalidad']}
            rows={[
              ['1', 'No responsable'],
              ['2', 'Régimen simple de tributación'],
              ['3', 'Agente de retención IVA'],
              ['4', 'Autorretenedor'],
              ['5', 'Gran contribuyente'],
            ]}
          />
          <CatalogTable
            headers={['Valor', 'Régimen']}
            rows={[
              ['1', 'Ninguno'],
              ['2', 'Régimen ordinario'],
              ['3', 'Régimen simple'],
            ]}
          />
          <CatalogTable
            headers={['Valor', 'Régimen de impuestos']}
            rows={[
              ['1', 'Impuesto sobre las ventas - IVA'],
              ['2', 'No responsable de IVA'],
            ]}
          />
          <CatalogTable
            headers={['Valor', 'Estado de comanda']}
            rows={[
              ['1', 'En espera'],
              ['2', 'En proceso de preparación'],
              ['3', 'Preparada'],
              ['4', 'Entregada'],
            ]}
          />
        </div>
        <h3>Tipo de identificación</h3>
        <p>
          Envía el primer valor como <code>id_tipo_identificacion</code>. El
          código DIAN es informativo y no reemplaza el ID.
        </p>
        <CatalogTable
          headers={['ID', 'Significado', 'Código']}
          rows={[
            ['1', 'Registro civil', 'RC'],
            ['2', 'Tarjeta de identidad', 'TI'],
            ['3', 'Cédula de ciudadanía', 'CC'],
            ['4', 'Tarjeta de extranjería', 'TE'],
            ['5', 'Cédula de extranjería', 'CE'],
            ['6', 'NIT', 'NIT'],
            ['7', 'Pasaporte', 'PASAPORTE'],
            ['8', 'Documento de identificación extranjero', 'Identificacion'],
            ['9', 'Otro', 'Identificacion'],
            ['10', 'RTN', 'RTN'],
            ['11', 'RUC', 'RUC'],
            ['12', 'DNI', 'DNI'],
            ['13', 'Identificación', 'Identificacion'],
            ['14', 'RNC', 'RNC'],
            ['15', 'Cédula Física', 'CF'],
            ['16', 'Cédula Jurídica', 'CJ'],
            ['17', 'DIMEX', 'DIMEX'],
            ['18', 'NITE', 'NITE'],
            ['19', 'Cédula', 'CC'],
            ['20', 'RUC', 'RUC'],
            ['21', 'RUC (Gobierno)', 'RUCG'],
          ]}
        />
        <h3>Impuestos</h3>
        <CatalogTable
          headers={['Valor', 'tipo_impuesto']}
          rows={[
            ['1', 'Impuesto / IVA'],
            ['2', 'ICO / impoconsumo'],
            ['3', 'Valor / bolsa'],
          ]}
        />
        <CatalogTable
          headers={['Valor', 'clasificacion_tributaria']}
          rows={[
            ['1', 'Gravado'],
            ['2', 'Exento'],
            ['3', 'Excluido'],
          ]}
        />
        <h3>Tipo de documento</h3>
        <p>
          Cuando un filtro acepta varios documentos, envía los valores separados
          por comas.
        </p>
        <CatalogTable
          headers={['Valor', 'Significado']}
          rows={[
            ['1', 'Factura'],
            ['7', 'Compra o gasto'],
            ['9', 'Prefactura o remisión'],
          ]}
        />
      </section>
    </div>
  </div>
);
