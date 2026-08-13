# Guía rápida de Cuenti MCP

Esta guía explica cómo conectar un cliente MCP de forma sencilla y segura.

## Conexión

1. Configura el servidor `https://mcp-api.cuenti.co/mcp` con transporte **Streamable HTTP**.
2. Envía de forma segura el contexto de empresa, sucursal, empleado, zona horaria y autorización.
3. Ejecuta `initialize` y después `tools/list`.
4. Elige la herramienta, valida sus argumentos contra el esquema publicado y realiza la llamada.

Encabezados de contexto:

| Encabezado | Uso |
| --- | --- |
| `X-Auth-Token-empresa` | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Identificador de la sucursal. |
| `X-Id-Empleado` | Empleado que ejecuta la operación. |
| `X-gtm` | Zona horaria, normalmente `GMT-0500`. |
| `Authorization` | Token con el formato `Bearer <token>`. |

Mantén las credenciales en la configuración segura de la conexión MCP. Nunca las incluyas en argumentos, ejemplos o respuestas.
