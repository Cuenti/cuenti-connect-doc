---
name: cuenti-mcp-stats
description: "Trigger: Cuenti Stats MCP, indicadores, KPIs, ventas, inventario y reportes. Selecciona la herramienta Stats adecuada y respeta sus reglas de fechas y sucursal."
license: Apache-2.0
compatibility: "Agent clients with MCP and Agent Skills support"
metadata:
  author: cuenti
  version: "1.0"
---

# Cuenti Stats MCP

## Activation Contract

Usa esta skill cuando una persona necesite consultar indicadores, KPIs o reportes de Cuenti mediante el servidor Stats MCP.

## Conexión MCP

Consulta `references/mcp-guide.md` para conectar el servidor y `references/tools.md` para elegir la herramienta correcta.

## Hard Rules

- Usa fechas `YYYY-MM-DD` con un rango máximo inclusivo de 31 días calendario.
- No adivines una sucursal. Usa `list_accessible_branches` cuando falte contexto.
- Selecciona la herramienta exacta y valida sus argumentos contra el esquema de `tools/list`.
- Mantén las credenciales en la conexión MCP; nunca las incluyas en argumentos o respuestas.
- No uses una herramienta para inferir un indicador distinto al que documenta su propósito.
- Resume siempre el alcance, la sucursal y el periodo de los resultados.

## Execution Steps

1. Identifica el indicador o reporte que necesita la persona.
2. Consulta `list_accessible_branches` si la sucursal no está confirmada.
3. Busca la herramienta en `references/tools.md`.
4. Valida fechas, argumentos y esquema con `tools/list`.
5. Ejecuta la llamada una sola vez.
6. Explica el resultado conservando su contexto y periodo.

## References

- `references/tools.md` — catálogo funcional de las 22 herramientas públicas de Stats.
- `references/mcp-guide.md` — conexión rápida por Streamable HTTP.
- El esquema publicado por el servidor MCP prevalece si difiere del catálogo instalado.
