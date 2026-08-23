---
name: cuenti-mcp-erp
description: "Trigger: Cuenti MCP ERP, productos, terceros, cartera, facturas, inventario. Elige herramientas del ERP con los filtros y datos correctos."
license: Apache-2.0
compatibility: "Agent clients with MCP and Agent Skills support"
metadata:
  author: cuenti
  version: "1.1"
---

# Cuenti MCP ERP

## Activation Contract

Usa esta skill cuando una persona necesite consultar o modificar información del ERP Cuenti mediante el MCP ERP.

## Conexión MCP

Consulta `references/mcp-guide.md` para la conexión por Streamable HTTP y `references/catalogos.md` antes de enviar IDs o enumeraciones. Las reglas para elegir `type_match_producto` al usar `grabarDocumentoSimple` están en la sección de esa herramienta dentro de `references/endpoints.md`.

## Hard Rules

- Empieza por la necesidad de negocio: productos, terceros, maestros, facturas, cartera o comandas.
- Selecciona la herramienta concreta y busca en `references/endpoints.md` el encabezado `###` que contiene su nombre exacto.
- Lee únicamente esa sección, desde su encabezado hasta el siguiente encabezado `###`.
- Usa el ejemplo de argumentos de esa sección y adapta solo los valores requeridos.
- Contrasta siempre nombres, tipos y campos con el `inputSchema` que devuelve `tools/list`.
- No inventes IDs: consulta el catálogo MCP correspondiente o pregunta al usuario.
- Mantén las credenciales en la conexión MCP; nunca las incluyas en argumentos o respuestas.
- Antes de modificar datos, consulta el estado actual, explica el cambio y solicita confirmación.
- Ejecuta `actualizarImpuestosLicores` y `guardarTercero` una sola vez. Si el resultado es ambiguo, verifica consultando.

## Execution Steps

1. Identifica qué resultado espera la persona.
2. Elige una herramienta de `tools/list`.
3. Lee la sección exacta de esa herramienta en `references/endpoints.md`.
4. Elige filtros concretos y únicamente las columnas o grupos útiles.
5. Contrasta el ejemplo con el esquema MCP y ejecuta la llamada.
6. Para cambios, muestra exactamente qué se modificará y pide confirmación.
7. Resume el resultado en lenguaje de negocio e indica si ocurrió una modificación.

## References

- `references/endpoints.md` — catálogo funcional del MCP ERP.
- `references/mcp-guide.md` — conexión rápida por Streamable HTTP.
- `references/catalogos.md` — IDs dinámicos, catálogos y enumeraciones.
- Los esquemas publicados por el servidor MCP prevalecen si difieren del catálogo instalado.
