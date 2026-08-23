# Guía rápida de Cuenti Stats MCP

Esta guía explica cómo conectar un cliente MCP al servidor de indicadores y reportes.

## Conexión

1. Configura el servidor `https://mcp-stats.cuenti.co/mcp` con transporte **Streamable HTTP**.
2. Envía de forma segura `Authorization`, `X-Auth-Token-Empresa` y `X-Auth-User-Id`.
3. Ejecuta `initialize` y después `tools/list`.
4. Elige la herramienta, valida sus argumentos contra el esquema publicado y realiza la llamada.

Encabezados de contexto:

| Encabezado | Uso |
| --- | --- |
| `Authorization` | Token con el formato `Bearer <token>`. |
| `X-Auth-Token-Empresa` | Token de autenticación de la empresa. |
| `X-Auth-User-Id` | Identificador del usuario autenticado. |
| `Content-Type` | `application/json` en las solicitudes al upstream. |

## Reglas de operación

- Usa `YYYY-MM-DD` y periodos de máximo 31 días calendario inclusivos.
- No adivines una sucursal; presenta las sucursales devueltas por `list_accessible_branches`.
- Las herramientas de Stats no usan caché.
- Mantén las credenciales en la configuración segura de la conexión MCP.
