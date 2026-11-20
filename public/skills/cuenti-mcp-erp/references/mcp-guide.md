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

## Crear una comanda con IA

Usa `restaurante-comandas-crear`. Revisa la sucursal, el destino, los productos y sus precios con el usuario. Solo después de su aprobación, llama a la herramienta con argumentos como estos (usa los IDs y precios de tu empresa):

```json
{
  "confirmation": "confirm:restaurante-comandas-crear",
  "numero_mesa": 10,
  "id_sucursal": 1,
  "id_empleado": 1,
  "platos": [
    {
      "id_producto": "burger-1",
      "nombre": "Hamburguesa",
      "precio": 25000,
      "cantidad": 2,
      "nota": "Sin cebolla"
    }
  ]
}
```

Para domicilio o para llevar usa `numero_mesa: null` y `domicilio: 1`. Los argumentos van en la raíz, sin `body`. El MCP genera `gui_pedido` y un `sync_uuid` por plato si no los envías. Si una llamada tiene resultado desconocido, comprueba si la comanda ya existe antes de intentar otro envío; no generes identificadores nuevos para reenviar el mismo pedido.

En REST, `POST /api/v1/restaurante/comandas` recibe `{ "items": [...] }`, con `gui_pedido` compartido y `sync_uuid` distinto en cada plato. No envíes `confirmation` a REST. Consulta [el contrato REST](endpoints.md#restaurante-comandas-crear-crear-comanda-de-restaurante).

## Finanzas y documentos

- Un abono sin `id_comprobante_caja` crea un recibo; con ese campo aplica saldo de un anticipo existente. No ejecutes ambas variantes como si fueran equivalentes.
- Los anticipos y abonos individuales documentados usan `fecha_registro` en `YYYY-MM-DDTHH:mm:ss`, sin zona. Los traslados, pagos agrupados, edición de medios de pago y filtros de consultas acotadas usan milisegundos Unix. Sigue el esquema de cada operación. Los IDs de empleado y sucursal son locales del ERP.
- El REST de crear, listar y anular anticipos, anular abonos y consultar centros de costo usa `{success,data,error,request_id}`. En error, `data=null` y `error={code,message,retryable,field?}`. Conserva el formato de cada herramienta restante; la envoltura MCP es independiente del payload REST.
- Un comprobante enriquecido `null` no revierte un pago confirmado. Consulta su ID sin repetir la escritura; no reintentes automáticamente un resultado desconocido.
- Para anular un documento usa `documentos-anular`, con `id_documento` de `vent_documento` y empleado local. Es una mutación sin cuerpo: el REST público usa POST y responde `ANULADO` o `YA_ESTABA_ANULADO`, no el JSON Java original. No uses la anulación de transacciones para un pedido.
- No se publica modificación de pedidos, asociación posterior de documentos a transacciones ni asociación directa de un anticipo a un documento existente sin transacción. La referencia `lstPagos[].id_comprobante_caja` corresponde a la creación de documentos.
- Para crear una factura de venta referenciada a un pedido usa `documentos-crear` con `body.tipoDocumento=1` y `body.id_documento` del pedido, además del cliente, detalle, consecutivo y demás campos obligatorios. No basta enviar el ID: no copia automáticamente el pedido. La nueva factura devuelve su propio `id_transacion`.
- `emitir_electronicamente`, `bodega_destino` e `id_documento` son enteros opcionales que admiten `null`, sin mínimo; el wrapper no los agrega si se omiten. No conviertas `emitir_electronicamente` a booleano.
- Consulta `organizacion-centros-costo` para obtener `data.items[].id_centro_costo`; su REST es `GET /api/v1/organizacion/centros-costo`, sin cuerpo, filtros ni caché. Para gasto (`tipoDocumento=7`), el documento exige `id_centro_costo` y cada línea usa `id_plan_cuentas`.
- Los errores REST sin sobre estándar conservan `{error,message,request_id,retryable}`. Un rechazo HTTP 422 puede ampliar solo `message`: `El ERP rechazó la operación. codigo_error:1050:Producto de ejemplo sin existencia`. SQL, trazas, credenciales y mensajes inseguros no se exponen. `erp_mutation_outcome_unknown` exige consultar el estado, no repetir la escritura.
- En terceros, `codigo_tributario: 5` significa No aplica ZZZ. Los contactos omitidos se conservan y `[]` no los elimina. Los campos aceptados no garantizan persistencia en Java de los hallazgos aún pendientes.

| Necesidad | Herramienta y límite |
| --- | --- |
| Cambiar banco, medio o fecha de un comprobante | `finanzas-comprobantes-caja-medio-pago` modifica un comprobante activo de la sucursal, sin cambiar valor ni consecutivo. Envía también los valores que quieres conservar de nota, dígitos y voucher. |
| Trasladar entre bancos o cajas | `finanzas-traslados-crear` registra ambos movimientos entre cuentas distintas. No permite anular el traslado. |
| Agrupar pagos o cobros | `finanzas-comprobantes-caja-multiples-crear` emite un comprobante para 2–400 facturas activas del mismo tercero y sucursal. El total debe coincidir con la suma de los abonos. |
| Registrar un anticipo a proveedor | `finanzas-anticipos-proveedores-crear` registra el egreso sin aplicarlo a una factura. |
| Registrar otros ingresos con recibo | `documentos-crear` con `body.tipoDocumento=6`, `id_plan_cuentas` e `impuestos` en cada línea de concepto, incluso si la tarifa es cero. Incluye el cobro en `lstPagos`. |
| Crear o editar productos | `catalogo-productos-crear` y `catalogo-productos-actualizar`. No cambian existencias ni imágenes. |

El catálogo no incluye edición general de documentos ya registrados (por ejemplo corregir el IVA de una compra), anulación de traslados, ejecución de producción o transformaciones, nómina ni contabilidad.

## Consultas acotadas de caja, bancos, kardex y producción

Son consultas POST de solo lectura: **no requieren confirmación** ni habilitan escrituras. Usa IDs reales de la empresa; los ejemplos no prueban disponibilidad en producción.

| Herramienta | Alcance y límites |
| --- | --- |
| `finanzas-comprobantes-caja-busquedas` | Sucursal positiva y fechas obligatorias, ordenadas, máximo 31 días. `es_ingreso=0` o `1`; omitirlo consulta ambas direcciones y entrega todo o error. Filtros locales AND: `id_cliente`, `id_banco`, `id_medio_pago`, `n_caja` (texto), `es_activo`. |
| `finanzas-bancos-movimientos-busquedas` | Banco positivo en la ruta y sucursal positiva. Hasta 31 días calendario inclusivos GMT-0500; expande a días locales completos, sin precisión intradía. No calcula saldos históricos ni identifica exclusivamente transferencias. |
| `inventario-kardex-busquedas` | Producto y sucursal positivos obligatorios; fechas ordenadas, máximo 31 días. Sin modo todos los productos. Conserva el signo de cantidad y el costo histórico del movimiento; no sustituye ese costo por el catálogo actual ni reconstruye saldos. |
| `operativas-ordenes-produccion-busquedas` | Fija `tipo_documento=12`; no lo envíes. Sucursal y fechas obligatorias, máximo 31 días; conserva grupos, detalle y paginación nativa de documentos. **Cobertura parcial:** líneas comerciales, no consumo real de insumos. Sin filtro `estado` ni bodega. |

Las tres primeras aceptan cuerpo omitido o `{}` para la proyección **SAFE completa**, nunca el resultado crudo del ERP. También aceptan `{"grupos":["nombre_permitido"]}`: lista no vacía, sin duplicados, limitada a los grupos de cada contrato. No aceptan columnas, `detalle` ni paginación artificial. Sus campos visibles se enumeran en la referencia generada desde el registro canónico. Las relaciones ausentes conservan `null`.

Sus respuestas REST usan `{success,data:{items:[...]},error,request_id}`, con cache bypass y `Cache-Control: no-store`; los errores usan `data:null` y `error:{code,message,retryable,field?}`. Las fechas de salida se normalizan a epoch-milliseconds. La consulta de producción conserva `documentos` y sus errores planos existentes; exige cuerpo con `grupos` no vacío. No envíes `confirmation` al REST ni lo solicites por tratarse de POST.
