# Catálogo funcional de Cuenti Stats MCP

<!-- Generated from contracts/stats/endpoints.json. Do not edit manually. -->

Usa este catálogo para elegir la herramienta de indicadores o reportes adecuada.

## Reglas globales

- Usa fechas `YYYY-MM-DD` y un rango máximo inclusivo de 31 días calendario.
- No adivines la sucursal; consulta `list_accessible_branches` cuando falte contexto.
- El servidor Stats no utiliza caché para estas consultas.
- Contrasta siempre los argumentos con el esquema publicado por `tools/list`.

## Herramientas por categoría

| Categoría | Herramientas |
| --- | --- |
| Descubrimiento de sucursales | `list_accessible_branches` |
| Indicadores de ventas | `get_average_ticket`, `get_sales_summary`, `get_total_sales_per_period` |
| Indicadores de producto | `get_average_price_per_product`, `get_net_output_by_product` |
| Mezcla de ventas | `get_category_sales_percentage`, `get_product_sales_percentage` |
| Análisis de productos | `get_product_abc_analysis`, `get_dish_toppings_usage` |
| Indicadores empresariales | `get_key_performance_indicators` |
| Reportes de productos | `get_top_ten_products` |
| Reportes de facturas | `get_invoice_detail_with_proportional_allocations`, `get_invoice_items_by_environment` |
| Reportes de ambientes | `get_environment_product_summary` |
| Reportes de inventario | `get_inventory_control_policies`, `get_inventory_mismatches` |
| Reportes de propinas | `get_tip_distribution_by_environment`, `get_tip_distribution_by_product` |
| Análisis temporal | `get_hot_cold_hours` |
| Mermas | `list_shrinkage_concepts`, `generate_shrinkage_report` |

## Descubrimiento de sucursales

### `list_accessible_branches`: Listar sucursales disponibles

**Para qué sirve:** Lista las sucursales disponibles para la empresa y el usuario autenticados.

**Tipo:** Consulta.

**Método:** `GET`.

**Cuándo usarla:** Usar cuando la sucursal solicitada no esté indicada, sea ambigua o deba seleccionarse antes de generar un reporte.

**No la uses para:**

- No seleccionar la primera sucursal sin confirmación del usuario.
- No inferir valores de indicadores a partir de los metadatos de la sucursal.

**Prerequisitos:**

- Reenviar Authorization, X-Auth-Token-Empresa, X-Auth-User-Id y Content-Type: application/json.

**Argumentos:** No requiere argumentos.

**Respuesta:** La colección de sucursales disponibles devuelta por la API de Stats.

**Interpretación:**

- Presentar los IDs y nombres de las sucursales para que el usuario seleccione explícitamente.
- Aplicar la selección automática solo cuando exista exactamente una sucursal activa disponible.

## Indicadores de ventas

### `get_average_ticket`: Obtener ticket promedio

**Para qué sirve:** Calcula el ticket promedio de ventas de la empresa durante un rango de fechas calendario.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar cuando el usuario solicite el valor promedio de una transacción o el tamaño promedio del ticket.

**No la uses para:**

- No usar para calcular el precio promedio de un producto.
- No inferir un resultado de una ubicación específica a partir de este indicador con alcance empresarial.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Resultado del ticket promedio devuelto para la empresa y el rango de fechas.

**Interpretación:**

- Informar el alcance empresarial y el rango de fechas junto con el promedio devuelto.
- No confundir el ticket promedio con el precio promedio de un producto.

### `get_sales_summary`: Obtener resumen de ventas

**Para qué sirve:** Ejecuta el flujo de creación y selección del resumen de ventas con alcance empresarial.

**Tipo:** Flujo.

**Método:** flujo interno del servidor MCP.

**Cuándo usarla:** Usar cuando se solicite el resumen de ventas de la empresa.

**No la uses para:**

- No exponer create-sales-summary ni select-sales-summary como herramientas independientes.
- No omitir el paso de selección después de la creación.

**Prerequisitos:**

- Reenviar el contexto autenticado de la empresa y del usuario.

**Argumentos:** No requiere argumentos.

**Respuesta:** Resumen de ventas con alcance empresarial devuelto por el flujo de creación y selección.

**Interpretación:**

- La respuesta seleccionada al final es el resultado del flujo con alcance empresarial.
- La creación siempre se ejecuta antes de la selección.

### `get_total_sales_per_period`: Obtener ventas totales por periodo

**Para qué sirve:** Devuelve las ventas totales de la empresa durante un periodo calendario.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para consultas directas sobre ventas totales.

**No la uses para:**

- No usar para porcentajes por producto o categoría.
- No inferir un resultado de una ubicación específica a partir de este indicador con alcance empresarial.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Resultado de ventas totales para la empresa y el periodo.

**Interpretación:**

- Informar el alcance empresarial y el rango de fechas junto con el total.
- Usar la moneda y la agregación devueltas por la API.

## Indicadores de producto

### `get_average_price_per_product`: Obtener precio promedio por producto

**Para qué sirve:** Calcula el precio promedio de venta por producto para la empresa durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para comparar los precios realizados de los productos durante el rango seleccionado.

**No la uses para:**

- No usar para calcular el valor promedio de una transacción.
- No inventar productos que no estén en la respuesta.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Precios promedio por producto devueltos para la empresa y el rango de fechas.

**Interpretación:**

- Mantener separados los precios por producto de los promedios por ticket.
- Conservar el contexto de producto y moneda entregado por la API.

### `get_net_output_by_product`: Obtener producción neta por producto

**Para qué sirve:** Reporta la producción neta de cada producto de la empresa durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar cuando el usuario solicite la producción neta por producto.

**No la uses para:**

- No equiparar la producción neta con las ventas brutas.
- No inferir un resultado de una ubicación específica a partir de este indicador con alcance empresarial.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Valores de producción neta por producto y contexto del periodo empresarial devueltos por la API.

**Interpretación:**

- Usar la definición de producción neta entregada por la API.
- Separar las filas de productos de los totales agregados.

## Mezcla de ventas

### `get_category_sales_percentage`: Obtener porcentajes de ventas por categoría

**Para qué sirve:** Calcula el porcentaje que aporta cada categoría a las ventas de la empresa durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar la mezcla de categorías y la composición de las ventas.

**No la uses para:**

- No interpretar los porcentajes como participación del inventario.
- No comparar rangos de fechas que no estén alineados.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Porcentajes por categoría y contexto del total de ventas de la empresa para el rango de fechas.

**Interpretación:**

- Los porcentajes representan el aporte al total de ventas devuelto.
- Informar el redondeo tal como lo entrega la API.

### `get_product_sales_percentage`: Obtener porcentajes de ventas por producto

**Para qué sirve:** Calcula el porcentaje que aporta cada producto a las ventas de la empresa durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar la mezcla y concentración de las ventas por producto.

**No la uses para:**

- No usar para calcular la participación del producto en el inventario.
- No inferir la rentabilidad del producto a partir del porcentaje por sí solo.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Porcentajes por producto y contexto del total de ventas de la empresa para el rango de fechas.

**Interpretación:**

- Los porcentajes son relativos al total de ventas devuelto.
- Conservar las etiquetas de los productos tal como las entrega la API.

## Análisis de productos

### `get_product_abc_analysis`: Obtener análisis ABC de productos

**Para qué sirve:** Clasifica los productos de la empresa mediante el análisis ABC de Pareto de la API durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para priorizar productos y segmentarlos según su aporte.

**No la uses para:**

- No tratar las clases ABC como estados del inventario.
- No reemplazar la clasificación de la API por umbrales inventados.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Clasificaciones ABC y métricas de aporte devueltas para la empresa y el rango de fechas.

**Interpretación:**

- Explicar las clases con la respuesta de la API en lugar de inventar umbrales.
- Mantener visible el periodo seleccionado.

### `get_dish_toppings_usage`: Obtener uso de complementos por plato

**Para qué sirve:** Reporta el uso de complementos por plato para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para consultar el uso de complementos y la composición de los platos.

**No la uses para:**

- No inferir requisitos de recetas que no hayan sido devueltos.
- No modificar el inventario a partir de este reporte.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Métricas de uso de platos y complementos devueltas por la API.

**Interpretación:**

- Usar los nombres de platos y complementos devueltos.
- Distinguir los conteos de uso de las cantidades vendidas.

## Indicadores empresariales

### `get_key_performance_indicators`: Obtener indicadores clave de desempeño

**Para qué sirve:** Devuelve los indicadores clave de desempeño de la API para la empresa durante un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para una visión general de indicadores cuando el usuario no haya solicitado una métrica especializada.

**No la uses para:**

- No reemplazar un reporte especializado cuando el usuario lo mencione.
- No interpretar este resultado con alcance empresarial como una comparación entre ubicaciones específicas.

**Prerequisitos:**

- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Respuesta:** Colección de indicadores con alcance empresarial devuelta por la API de Stats.

**Interpretación:**

- Explicar cada indicador usando la etiqueta y el valor devueltos.
- No inventar definiciones de indicadores faltantes.

## Reportes de productos

### `get_top_ten_products`: Obtener los diez productos principales

**Para qué sirve:** Devuelve la lista de los diez productos principales de la API usando el cuerpo de solicitud vacío requerido.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para consultas sobre los productos principales cuando sea suficiente el resultado fijo de diez productos de la API.

**No la uses para:**

- No agregar campos de sucursal o fecha al cuerpo de la solicitud.
- No presentar el ranking como si admitiera un tamaño personalizado.

**Prerequisitos:**

- Reenviar los encabezados de autenticación requeridos y enviar el cuerpo de solicitud vacío.

**Argumentos:** No requiere argumentos.

**Respuesta:** Los diez productos principales y sus métricas devueltos por la API de Stats.

**Interpretación:**

- La API controla el ranking de los diez productos principales.
- Conservar el orden y las métricas devueltas.

## Reportes de facturas

### `get_invoice_detail_with_proportional_allocations`: Obtener detalle de factura con asignaciones proporcionales

**Para qué sirve:** Devuelve el detalle de las facturas con las asignaciones proporcionales de la API para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar cuando se solicite el detalle por factura y sus valores asignados.

**No la uses para:**

- No redistribuir los valores localmente.
- No omitir la sucursal seleccionada ni el alcance del periodo.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Detalle de facturas y valores de asignación proporcional devueltos por la API.

**Interpretación:**

- Usar los valores de asignación tal como los entrega la API.
- Mantener el contexto de factura y periodo asociado al detalle.

### `get_invoice_items_by_environment`: Obtener artículos de factura por ambiente

**Para qué sirve:** Devuelve los artículos de factura agrupados por ambiente para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar artículos de factura por ambiente.

**No la uses para:**

- No combinar manualmente las filas de ambientes.
- No consultar sin seleccionar una sucursal.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Artículos de factura agrupados por ambiente tal como los devuelve la API.

**Interpretación:**

- Conservar la agrupación por ambiente de la API.
- Separar la cantidad de artículos de los conteos y valores de las facturas.

## Reportes de ambientes

### `get_environment_product_summary`: Obtener resumen de productos por ambiente

**Para qué sirve:** Resume los productos por ambiente para una sucursal y un rango de fechas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar productos por ambiente.

**No la uses para:**

- No combinar ambientes sin evidencia de la API.
- No usar para descubrir sucursales.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Resumen de ambiente y productos devuelto por la API de Stats.

**Interpretación:**

- Conservar los límites entre ambientes.
- Explicar los valores usando las etiquetas de producto y ambiente devueltas.

## Reportes de inventario

### `get_inventory_control_policies`: Obtener políticas de control de inventario

**Para qué sirve:** Devuelve información sobre las políticas de control de inventario para la sucursal y el periodo seleccionados.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar cuando el usuario pregunte por las políticas de control de inventario en la API de Stats.

**No la uses para:**

- No inventar valores de políticas.
- No aplicar en una sucursal la política de otra.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Datos de políticas de control de inventario devueltos por la API.

**Interpretación:**

- Informar los nombres y valores de las políticas exactamente como fueron devueltos.
- Distinguir la configuración de políticas de los resultados del inventario.

### `get_inventory_mismatches`: Obtener diferencias de inventario

**Para qué sirve:** Reporta las diferencias de inventario para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar discrepancias entre el inventario esperado y el reportado.

**No la uses para:**

- No modificar el inventario a partir de este reporte de solo lectura.
- No calificar una diferencia como fraude sin evidencia.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Registros de diferencias de inventario y valores comparativos devueltos por la API.

**Interpretación:**

- Explicar por separado los valores esperados y reales.
- Conservar el alcance de producto y periodo en cada conclusión.

## Reportes de propinas

### `get_tip_distribution_by_environment`: Obtener distribución de propinas por ambiente

**Para qué sirve:** Reporta la distribución de propinas agrupada por ambiente para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para consultar la distribución de propinas por ambiente.

**No la uses para:**

- No redistribuir las propinas localmente.
- No inferir una asignación a empleados que la API no haya devuelto.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Distribución de propinas por ambiente devuelta por la API.

**Interpretación:**

- Usar las etiquetas de ambiente y los totales devueltos.
- Mantener separados los valores de propinas y de ventas.

### `get_tip_distribution_by_product`: Obtener distribución de propinas por producto

**Para qué sirve:** Reporta la distribución de propinas agrupada por producto para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para consultar la distribución de propinas por producto.

**No la uses para:**

- No asignar propinas a productos más allá de lo indicado en la respuesta.
- No confundir las propinas con los ingresos de los productos.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Distribución de propinas por producto devuelta por la API.

**Interpretación:**

- Conservar la agrupación por producto y las unidades devueltas.
- Explicar si los valores son totales o porcentajes según la respuesta.

## Análisis temporal

### `get_hot_cold_hours`: Obtener horas de mayor y menor actividad

**Para qué sirve:** Identifica las horas de mayor y menor actividad de ventas para una sucursal y un periodo.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar la demanda por hora y los horarios de operación.

**No la uses para:**

- No inferir necesidades de personal como una directriz.
- No comparar zonas horarias sin el contexto de la API.

**Prerequisitos:**

- Confirmar la sucursal.
- Usar startDate y endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Análisis de horas de mayor y menor actividad devuelto por la API.

**Interpretación:**

- Explicar las horas de mayor y menor actividad usando la clasificación devuelta por la API.
- Mantener diferenciados los días y las horas del negocio.

## Mermas

### `list_shrinkage_concepts`: Listar conceptos de mermas

**Para qué sirve:** Lista los conceptos de mermas disponibles para el flujo posterior de mermas.

**Tipo:** Consulta.

**Método:** `POST`.

**Cuándo usarla:** Usar antes de generate_shrinkage_report para obtener nombres y selecciones de conceptos válidos.

**No la uses para:**

- No inventar conceptos de mermas.
- No ejecutar el reporte de mermas sin usar la selección de conceptos disponibles.

**Prerequisitos:**

- Reenviar los encabezados de autenticación requeridos.
- Enviar exactamente el cuerpo JSON vacío.

**Argumentos:** No requiere argumentos.

**Respuesta:** Conceptos de mermas devueltos por la API para su selección.

**Interpretación:**

- Usar los nombres de conceptos devueltos como fuente para seleccionar las mermas.
- No aplicar cálculos físicos a los conceptos antes de seleccionarlos.

### `generate_shrinkage_report`: Generar reporte de mermas

**Para qué sirve:** Genera un reporte de mermas después de listar y seleccionar los conceptos.

**Tipo:** Flujo.

**Método:** `POST`.

**Cuándo usarla:** Usar para analizar mermas con conceptos seleccionados y un rango de fechas de una sucursal.

**No la uses para:**

- No omitir conceptos.
- No enviar calculo_fisico para conceptos distintos de Entrada o Salida después de normalizarlos.

**Prerequisitos:**

- Ejecutar primero list_shrinkage_concepts.
- Seleccionar los conceptos devueltos.
- Confirmar la sucursal y usar startDate/endDate dentro de un máximo inclusivo de 31 días calendario.

**Argumentos**

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `branchId` | integer | Sí | ID de la sucursal seleccionada por el usuario. |
| `startDate` | date (YYYY-MM-DD) | Sí | Fecha calendario inicial, incluida en el rango. |
| `endDate` | date (YYYY-MM-DD) | Sí | Fecha calendario final, incluida en el rango. |
| `conceptos` | array | Sí | Conceptos seleccionados desde list_shrinkage_concepts; cada uno conserva el nombre devuelto. |

**Rango de fechas:** `startDate` y `endDate`; máximo de 31 días calendario inclusivos.

**Sucursal:** requiere `branchId` y la resuelve el servidor antes de consultar el upstream.

**Respuesta:** Reporte de mermas devuelto para los conceptos, la sucursal y el periodo seleccionados.

**Interpretación:**

- Para cada concepto seleccionado, normalizar mayúsculas, minúsculas y espacios de su nombre.
- Establecer calculo_fisico=true solo cuando el nombre normalizado comience por Entrada o Salida; omitirlo en los demás casos.
