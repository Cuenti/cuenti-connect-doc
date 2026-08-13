---
name: cuenti-mcp
description: "Trigger: Cuenti MCP, productos, terceros, cartera, facturas, inventario. Elige herramientas de Cuenti con los filtros y datos correctos."
license: Apache-2.0
compatibility: "Agent clients with MCP and Agent Skills support"
metadata:
  author: cuenti
version: "1.1"
---

# Cuenti MCP

## Activation Contract

Usa esta skill cuando una persona necesite consultar o modificar información de Cuenti mediante el MCP.

## Conexión MCP

Consulta `references/mcp-guide.md` para la conexión rápida por Streamable HTTP. Las reglas para elegir `type_match_producto` al usar `grabarDocumentoSimple` están en la sección de esa herramienta dentro de `references/endpoints.md`.

## Hard Rules

- Empieza por la necesidad de negocio: productos, terceros, maestros, facturas, cartera o comandas.
- Selecciona la herramienta concreta y busca en `references/endpoints.md` el encabezado `###` que contiene su nombre exacto.
- Lee únicamente esa sección, desde su encabezado hasta el siguiente encabezado `###`; no recorras todo el catálogo si no es necesario.
- Usa el ejemplo de argumentos de esa sección y adapta solo los valores requeridos por la solicitud.
- Contrasta siempre los nombres, tipos y campos con el `inputSchema` que devuelve `tools/list` antes de llamar.
- Pide solo las columnas o grupos necesarios y usa paginación pequeña.
- Mantén las credenciales en la conexión MCP; nunca las incluyas en argumentos o respuestas.
- Antes de modificar datos, consulta el estado actual, explica el cambio y solicita confirmación.
- Ejecuta `actualizarImpuestosLicores` y `guardarTercero` una sola vez. Si el resultado es ambiguo, verifica consultando.

## Decision Gates

| Necesidad | Herramientas principales |
| --- | --- |
| Productos | `consultaProductoPaginadaMCP` |
| Clientes y proveedores | `buscarTercero`, `guardarTercero` |
| Facturas e historiales | `buscarTransacciones`, `buscarProductosComprados`, `buscarDescuentos`, `buscarConsolidado` |
| Cuentas por cobrar o pagar | `buscarCartera`, `buscarResumenTerceros` |
| Cocina y auditoría | `obtenerComandas`, `platosEliminados` |
| Catálogos de configuración | Herramientas `buscar...` de categorías, impuestos, bancos, pagos, consecutivos, sucursales y empleados |

## Execution Steps

1. Identifica qué resultado espera la persona.
2. Elige una herramienta de la tabla anterior o de `tools/list`.
3. Busca y lee la sección exacta de esa herramienta en `references/endpoints.md`.
4. Elige filtros concretos y únicamente las columnas o grupos útiles.
5. Contrasta el ejemplo con el esquema MCP y ejecuta la llamada.
6. Para cambios, muestra exactamente qué se modificará y pide confirmación.
7. Resume el resultado en lenguaje de negocio e indica si ocurrió una modificación.

## Output Contract

Indica la herramienta utilizada, los filtros aplicados, un resumen claro del resultado y si se modificaron datos.

## References

- `references/endpoints.md` — catálogo funcional navegable por herramienta; cada sección contiene filtros, valores, columnas, grupos, ejemplos y respuesta esperada.
- `references/mcp-guide.md` — conexión rápida por Streamable HTTP.
- Los esquemas publicados por el servidor MCP prevalecen si difieren del catálogo instalado.
