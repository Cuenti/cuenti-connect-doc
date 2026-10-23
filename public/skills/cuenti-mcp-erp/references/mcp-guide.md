# Guía rápida de Cuenti MCP ERP

Esta guía explica cómo conectar un cliente MCP al servidor ERP de forma sencilla y segura.

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
| `X-Id-Empleado` | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (`id_usuario_portal`). |
| `X-gtm` | Zona horaria, normalmente `GMT-0500`. |
| `Authorization` | Token con el formato `Bearer <token>`. |

Mantén las credenciales en la configuración segura de la conexión MCP. Nunca las incluyas en argumentos, ejemplos o respuestas.

## Finanzas y documentos

- Un abono sin `id_comprobante_caja` crea un recibo; con ese campo aplica saldo de un anticipo existente. No ejecutes ambas variantes como si fueran equivalentes.
- `fecha_registro` financiera usa `YYYY-MM-DDTHH:mm:ss`, sin zona ni epoch; los filtros de fecha de restaurante usan milisegundos Unix. Los IDs de empleado y sucursal son locales del ERP.
- Solo crear, listar y anular anticipos y anular abonos usan `{success,data,error,request_id}`. Conserva el formato de cada herramienta restante.
- Un comprobante enriquecido `null` no revierte un pago confirmado. Consulta su ID sin repetir la escritura; no reintentes automáticamente un resultado desconocido.
- Para anular un documento usa `documentos-anular`, con `id_documento` de `vent_documento` y empleado local. Es una mutación sin cuerpo: el REST público usa POST y responde `ANULADO` o `YA_ESTABA_ANULADO`, no el JSON Java original. No uses la anulación de transacciones para un pedido.
- No se publica modificación de pedidos, asociación posterior de documentos a transacciones ni asociación directa de un anticipo a un documento existente sin transacción. La referencia `lstPagos[].id_comprobante_caja` corresponde a la creación de documentos.
- En terceros, `codigo_tributario: 5` significa No aplica ZZZ. Los contactos omitidos se conservan y `[]` no los elimina. Los campos aceptados no garantizan persistencia en Java de los hallazgos aún pendientes.
