# IDs, catálogos y enumeraciones

Usa esta referencia antes de enviar IDs o valores enumerados a una herramienta.

## Regla para IDs

No confundas el nombre de un registro con su ID.

1. Si existe una herramienta de consulta, busca el registro por nombre y usa el ID que devuelve la respuesta.
2. Si no existe una herramienta de consulta para ese catálogo, pregunta al usuario cuál ID debe utilizar.
3. Si la respuesta no trae el ID, trae varios registros posibles o el nombre no coincide con lo solicitado, no adivines: pregunta al usuario y explica la inconsistencia.
4. Antes de una operación que modifica datos, confirma el nombre y el ID seleccionado.

IDs que normalmente dependen de la empresa y no deben inventarse:

| Campo | Qué representa | Cómo obtenerlo |
| --- | --- | --- |
| `id_plan_cuentas` / `id_plan_cuenta` | Cuenta contable del ERP. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_centro_costo` | Centro de costos. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_bodega` | Bodega asociada al movimiento o empleado. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_lista_precios` | Lista de precios. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_ruta_despacho` | Ruta de despacho. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_cocina` | Cocina que prepara una comanda. | No hay catálogo MCP dedicado; pregunta el ID. |
| `id_tipo_cliente` | Tipo de cliente configurado en el ERP. | Usa los valores base de esta referencia cuando correspondan. Si no coinciden, pregunta. |

Catálogos MCP disponibles:

| Necesitas el ID de... | Consulta |
| --- | --- |
| Producto | `buscarProductosCatalogo` |
| Categoría | `buscarCategorias` |
| Sucursal | `buscarSucursales` |
| Banco | `buscarBancos` |
| Impuesto | `buscarImpuestos` |
| Medio de pago | `buscarMediosPago` |
| Consecutivo | `buscarConsecutivos` |
| Empleado | `buscarEmpleados` |
| Tercero | `buscarTercero` |

## Valores base

Estos valores se envían como números y no requieren una consulta adicional, salvo que la respuesta de la empresa indique algo diferente o sea incoherente.

### Tipo de cliente

| Valor de `id_tipo_cliente` | Significado |
| --- | --- |
| `1` | General |
| `2` | Referidor |

### Tipo de tercero

| Valor de `tipo_tercero` | Significado |
| --- | --- |
| `1` | Cliente |
| `2` | Proveedor |
| `3` | Cliente y proveedor |

### Tipo de identificación

Usa el primer valor como `id_tipo_identificacion`. El código DIAN que aparece en la tabla no reemplaza este ID.

| Valor | Significado | Código |
| --- | --- | --- |
| `1` | Registro civil | `RC` |
| `2` | Tarjeta de identidad | `TI` |
| `3` | Cédula de ciudadanía | `CC` |
| `4` | Tarjeta de extranjería | `TE` |
| `5` | Cédula de extranjería | `CE` |
| `6` | NIT | `NIT` |
| `7` | Pasaporte | `PASAPORTE` |
| `8` | Documento de identificación extranjero | `Identificacion` |
| `9` | Otro | `Identificacion` |
| `10` | RTN | `RTN` |
| `11` | RUC | `RUC` |
| `12` | DNI | `DNI` |
| `13` | Identificación | `Identificacion` |
| `14` | RNC | `RNC` |
| `15` | Cédula Física | `CF` |
| `16` | Cédula Jurídica | `CJ` |
| `17` | DIMEX | `DIMEX` |
| `18` | NITE | `NITE` |
| `19` | Cédula | `CC` |
| `20` | RUC | `RUC` |
| `21` | RUC (Gobierno) | `RUCG` |

### Legalidad

Los valores siguen el orden de la configuración mostrada:

| Valor | Significado |
| --- | --- |
| `1` | No responsable |
| `2` | Régimen simple de tributación |
| `3` | Agente de retención IVA |
| `4` | Autorretenedor |
| `5` | Gran contribuyente |

### Régimen

| Valor | Significado |
| --- | --- |
| `1` | Ninguno |
| `2` | Régimen ordinario |
| `3` | Régimen simple |

### Régimen de impuestos

| Valor | Significado |
| --- | --- |
| `1` | Impuesto sobre las ventas - IVA |
| `2` | No responsable de IVA |

### Impuestos

`tipo_impuesto`:

| Valor | Significado |
| --- | --- |
| `1` | Impuesto / IVA |
| `2` | ICO / impoconsumo |
| `3` | Valor / bolsa |

`clasificacion_tributaria`:

| Valor | Significado |
| --- | --- |
| `1` | Gravado |
| `2` | Exento |
| `3` | Excluido |

### Tipo de documento

Cuando un filtro acepta varios documentos, envía los valores separados por comas.

| Valor | Significado |
| --- | --- |
| `1` | Factura |
| `7` | Compra o gasto |
| `9` | Prefactura o remisión |

### Estado de comanda

| Valor | Significado |
| --- | --- |
| `1` | En espera |
| `2` | En proceso de preparación |
| `3` | Preparada |
| `4` | Entregada |

## Cuando falta información

Si el usuario pide, por ejemplo, una bodega o un centro de costos y no proporciona un ID válido, formula una pregunta concreta:

> ¿Qué `id_bodega` debo utilizar? La consulta no devuelve un catálogo de bodegas. Indícame el ID exacto o confirma el nombre de la bodega para verificar si existe otra forma de obtenerlo.

Si una respuesta contiene un ID que no corresponde al nombre o al tipo de registro esperado, no ejecutes la operación. Informa qué valor llegó, qué se esperaba y solicita aclaración.
