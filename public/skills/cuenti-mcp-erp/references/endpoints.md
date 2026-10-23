# Catálogo funcional de Cuenti MCP ERP

<!-- Generated from contracts/j4/endpoints.json and contracts/mcp/external-tools.json. Do not edit manually. -->

Usa este catálogo para traducir una necesidad de negocio a la herramienta correcta y pedir únicamente la información necesaria.

## Cómo usarlo

- Identifica primero la necesidad y elige una herramienta de la tabla o de `tools/list`.
- Busca el encabezado `###` que contiene el nombre exacto de la herramienta y lee solo esa sección hasta el siguiente encabezado `###`.
- Usa el ejemplo de argumentos como punto de partida y cambia únicamente los datos necesarios.
- Antes de llamar, contrasta los nombres y tipos con el `inputSchema` publicado por el MCP.
- Los **filtros** reducen los resultados. Usa páginas pequeñas y evita consultas sin criterio cuando exista un filtro útil.
- Las **columnas** solo aplican cuando la operación las declara explícitamente; los catálogos maestros usan `grupos` o `{}`.
- Los **grupos** agregan bloques relacionados; cada grupo explica sus campos incluidos.
- `0` suele significar no/inactivo y `1` sí/activo, salvo que la operación indique otro significado.
- Consulta el formato de cada campo: finanzas recibe `YYYY-MM-DDTHH:mm:ss` sin zona; los filtros de restaurante usan milisegundos Unix como `1722470400000`.
- El catálogo contiene 48 rutas ERP y una herramienta externa. Los ejemplos no prueban despliegue en producción.
- Revisa [Finanzas y documentos](mcp-guide.md#finanzas-y-documentos) antes de registrar pagos o anular documentos.

## Herramientas por necesidad

| Necesidad | Herramientas |
| --- | --- |

| Transacciones y documentos | `ventas-facturas-busquedas`, `ventas-planes-separe-busquedas`, `ventas-otros-ingresos-busquedas`, `ventas-compras-gastos-busquedas`, `ventas-remisiones-busquedas`, `documentos-crear`, `transacciones-anular`, `documentos-anular`, `transacciones-notas-crear`, `transacciones-notas-credito-emitir`, `ventas-productos-comprados-busquedas`, `ventas-descuentos-busquedas`, `ventas-consolidados-busquedas`, `operativas-pedidos-busquedas`, `operativas-cotizaciones-busquedas`, `operativas-despachos-busquedas`, `operativas-productos-busquedas`, `operativas-descuentos-busquedas`, `operativas-consolidados-busquedas` |

| Catálogo | `catalogo-productos-busquedas`, `catalogo-categorias-busquedas`, `catalogo-productos-impuestos-licores`, `catalogo-marcas`, `catalogo-marca-por-id` |

| Inventario | `inventario-conteos` |

| Terceros | `terceros-busquedas`, `terceros-crear`, `terceros-actualizar` |

| Impuestos | `tributario-impuestos-busquedas`, `tributario-impuesto-por-id` |

| Finanzas y cartera | `finanzas-bancos-busquedas`, `finanzas-medios-pago-busquedas`, `finanzas-abonos-crear`, `finanzas-anticipos-crear`, `finanzas-anticipos-cliente-sucursal`, `finanzas-anticipos-anular`, `finanzas-abonos-anular`, `finanzas-comprobante-caja-por-id`, `finanzas-cartera-cobrar-busquedas`, `finanzas-cartera-pagar-busquedas`, `finanzas-resumen-cobrar-busquedas`, `finanzas-resumen-pagar-busquedas` |

| Organización | `organizacion-sucursales-busquedas`, `organizacion-empleados-busquedas` |

| Facturación | `facturacion-consecutivos-busquedas` |

| Restaurante | `restaurante-comandas-busquedas`, `restaurante-platos-eliminados-busquedas`, `restaurante-mesas-ocupadas`, `restaurante-comandas-crear` |

## Transacciones y documentos

### `ventas-facturas-busquedas`: Buscar facturas

**Para qué sirve:** Buscar facturas. Su resultado principal es `transacciones`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/facturas/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `n_transacion` | No | número entero |
| `n_factura` | No | texto |
| `prefijo` | No | texto |
| `numeracion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `es_ingreso` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `deuda_desde` | No | número |
| `deuda_hasta` | No | número |
| `saldo_desde` | No | número |
| `saldo_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `impuestos`.
- `estado`.
- `qr`.
- `nota`.
- `documento`.
- `moneda`.
- `estado_electronico`.
- `pagos`.
- `retenciones`.
- `notas_credito`.
- `facturacion_electronica`.
- `consecutivo`.
- `impresion`.
- `cartera_cliente`.
- `empresa`.
- `sucursal_configuracion`.
- `taller`.
- `acta_entrega`.
- `ruta_despacho`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "impuestos",
      "estado",
      "qr",
      "nota",
      "documento",
      "moneda",
      "estado_electronico",
      "pagos",
      "retenciones",
      "notas_credito",
      "facturacion_electronica",
      "consecutivo",
      "impresion",
      "cartera_cliente",
      "empresa",
      "sucursal_configuracion",
      "taller",
      "acta_entrega",
      "ruta_despacho",
      "comentarios",
      "adjuntos"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }; Transaccion.comentarios?: Comentario[]; Transaccion.adjuntos?: Adjunto[]; Transaccion.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "transacciones": [
    {
      "codigos": {
        "id_transacion": 1,
        "n_transacion": 1,
        "n_factura": "1",
        "prefijo": "DOC",
        "numeracion": 1,
        "tipo_documento": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0,
        "total_costo": 7000,
        "total_utilidad": 3000,
        "total_abono": 11900,
        "saldo_pendiente": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo",
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "telefonos": "0000000000",
        "correos": "cliente@example.invalid"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_factura": 1735689600000,
        "fecha_registro": 1735689600000,
        "fecha_vencimiento": 1738281600000
      },
      "ruta_despacho": {
        "id_ruta": 1,
        "nombre": "Ruta ejemplo"
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "factura-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/factura-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          },
          "impuestos": {
            "total_impuesto": 1900
          },
          "descuento": {
            "descuento": 0
          }
        }
      ]
    }
  ]
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- Los filtros total, subtotal, deuda, saldo y descuento aceptan límites desde/hasta decimales.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- La identificación del padre se devuelve dentro de codigos; transacion no es un grupo válido.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas; Factura con comentarios y archivos.

### `ventas-planes-separe-busquedas`: Buscar plan separe

**Para qué sirve:** Buscar plan separe. Su resultado principal es `transacciones`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/planes-separe/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `n_transacion` | No | número entero |
| `n_factura` | No | texto |
| `prefijo` | No | texto |
| `numeracion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `es_ingreso` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `deuda_desde` | No | número |
| `deuda_hasta` | No | número |
| `saldo_desde` | No | número |
| `saldo_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `impuestos`.
- `estado`.
- `qr`.
- `nota`.
- `documento`.
- `moneda`.
- `estado_electronico`.
- `pagos`.
- `retenciones`.
- `notas_credito`.
- `facturacion_electronica`.
- `consecutivo`.
- `impresion`.
- `cartera_cliente`.
- `empresa`.
- `sucursal_configuracion`.
- `taller`.
- `acta_entrega`.
- `ruta_despacho`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "impuestos",
      "estado",
      "qr",
      "nota",
      "documento",
      "moneda",
      "estado_electronico",
      "pagos",
      "retenciones",
      "notas_credito",
      "facturacion_electronica",
      "consecutivo",
      "impresion",
      "cartera_cliente",
      "empresa",
      "sucursal_configuracion",
      "taller",
      "acta_entrega",
      "ruta_despacho",
      "comentarios",
      "adjuntos"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }; Transaccion.comentarios?: Comentario[]; Transaccion.adjuntos?: Adjunto[]; Transaccion.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "transacciones": [
    {
      "codigos": {
        "id_transacion": 1,
        "n_transacion": 1,
        "n_factura": "1",
        "prefijo": "DOC",
        "numeracion": 1,
        "tipo_documento": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0,
        "total_costo": 7000,
        "total_utilidad": 3000,
        "total_abono": 11900,
        "saldo_pendiente": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo",
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "telefonos": "0000000000",
        "correos": "cliente@example.invalid"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_factura": 1735689600000,
        "fecha_registro": 1735689600000,
        "fecha_vencimiento": 1738281600000
      },
      "ruta_despacho": {
        "id_ruta": 1,
        "nombre": "Ruta ejemplo"
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "factura-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/factura-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          },
          "impuestos": {
            "total_impuesto": 1900
          },
          "descuento": {
            "descuento": 0
          }
        }
      ]
    }
  ]
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- Los filtros total, subtotal, deuda, saldo y descuento aceptan límites desde/hasta decimales.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- La identificación del padre se devuelve dentro de codigos; transacion no es un grupo válido.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas; Factura con comentarios y archivos.

### `ventas-otros-ingresos-busquedas`: Buscar otros ingresos

**Para qué sirve:** Buscar otros ingresos. Su resultado principal es `transacciones`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/otros-ingresos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `n_transacion` | No | número entero |
| `n_factura` | No | texto |
| `prefijo` | No | texto |
| `numeracion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `es_ingreso` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `deuda_desde` | No | número |
| `deuda_hasta` | No | número |
| `saldo_desde` | No | número |
| `saldo_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `impuestos`.
- `estado`.
- `qr`.
- `nota`.
- `documento`.
- `moneda`.
- `estado_electronico`.
- `pagos`.
- `retenciones`.
- `notas_credito`.
- `facturacion_electronica`.
- `consecutivo`.
- `impresion`.
- `cartera_cliente`.
- `empresa`.
- `sucursal_configuracion`.
- `taller`.
- `acta_entrega`.
- `ruta_despacho`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "impuestos",
      "estado",
      "qr",
      "nota",
      "documento",
      "moneda",
      "estado_electronico",
      "pagos",
      "retenciones",
      "notas_credito",
      "facturacion_electronica",
      "consecutivo",
      "impresion",
      "cartera_cliente",
      "empresa",
      "sucursal_configuracion",
      "taller",
      "acta_entrega",
      "ruta_despacho",
      "comentarios",
      "adjuntos"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }; Transaccion.comentarios?: Comentario[]; Transaccion.adjuntos?: Adjunto[]; Transaccion.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "transacciones": [
    {
      "codigos": {
        "id_transacion": 1,
        "n_transacion": 1,
        "n_factura": "1",
        "prefijo": "DOC",
        "numeracion": 1,
        "tipo_documento": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0,
        "total_costo": 7000,
        "total_utilidad": 3000,
        "total_abono": 11900,
        "saldo_pendiente": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo",
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "telefonos": "0000000000",
        "correos": "cliente@example.invalid"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_factura": 1735689600000,
        "fecha_registro": 1735689600000,
        "fecha_vencimiento": 1738281600000
      },
      "ruta_despacho": {
        "id_ruta": 1,
        "nombre": "Ruta ejemplo"
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "factura-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/factura-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          },
          "impuestos": {
            "total_impuesto": 1900
          },
          "descuento": {
            "descuento": 0
          }
        }
      ]
    }
  ]
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- Los filtros total, subtotal, deuda, saldo y descuento aceptan límites desde/hasta decimales.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- La identificación del padre se devuelve dentro de codigos; transacion no es un grupo válido.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas; Factura con comentarios y archivos.

### `ventas-compras-gastos-busquedas`: Buscar compra/gasto

**Para qué sirve:** Buscar compra/gasto. Su resultado principal es `transacciones`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/compras-gastos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `n_transacion` | No | número entero |
| `n_factura` | No | texto |
| `prefijo` | No | texto |
| `numeracion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `es_ingreso` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `deuda_desde` | No | número |
| `deuda_hasta` | No | número |
| `saldo_desde` | No | número |
| `saldo_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `impuestos`.
- `estado`.
- `qr`.
- `nota`.
- `documento`.
- `moneda`.
- `estado_electronico`.
- `pagos`.
- `retenciones`.
- `notas_credito`.
- `facturacion_electronica`.
- `consecutivo`.
- `impresion`.
- `cartera_cliente`.
- `empresa`.
- `sucursal_configuracion`.
- `taller`.
- `acta_entrega`.
- `ruta_despacho`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "impuestos",
      "estado",
      "qr",
      "nota",
      "documento",
      "moneda",
      "estado_electronico",
      "pagos",
      "retenciones",
      "notas_credito",
      "facturacion_electronica",
      "consecutivo",
      "impresion",
      "cartera_cliente",
      "empresa",
      "sucursal_configuracion",
      "taller",
      "acta_entrega",
      "ruta_despacho",
      "comentarios",
      "adjuntos"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }; Transaccion.comentarios?: Comentario[]; Transaccion.adjuntos?: Adjunto[]; Transaccion.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "transacciones": [
    {
      "codigos": {
        "id_transacion": 1,
        "n_transacion": 1,
        "n_factura": "1",
        "prefijo": "DOC",
        "numeracion": 1,
        "tipo_documento": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0,
        "total_costo": 7000,
        "total_utilidad": 3000,
        "total_abono": 11900,
        "saldo_pendiente": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo",
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "telefonos": "0000000000",
        "correos": "cliente@example.invalid"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_factura": 1735689600000,
        "fecha_registro": 1735689600000,
        "fecha_vencimiento": 1738281600000
      },
      "ruta_despacho": {
        "id_ruta": 1,
        "nombre": "Ruta ejemplo"
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "factura-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/factura-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          },
          "impuestos": {
            "total_impuesto": 1900
          },
          "descuento": {
            "descuento": 0
          }
        }
      ]
    }
  ]
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- Los filtros total, subtotal, deuda, saldo y descuento aceptan límites desde/hasta decimales.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- La identificación del padre se devuelve dentro de codigos; transacion no es un grupo válido.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas; Factura con comentarios y archivos.

### `ventas-remisiones-busquedas`: Buscar remisiones

**Para qué sirve:** Buscar remisiones. Su resultado principal es `transacciones`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/remisiones/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `n_transacion` | No | número entero |
| `n_factura` | No | texto |
| `prefijo` | No | texto |
| `numeracion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `es_ingreso` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `deuda_desde` | No | número |
| `deuda_hasta` | No | número |
| `saldo_desde` | No | número |
| `saldo_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `impuestos`.
- `estado`.
- `qr`.
- `nota`.
- `documento`.
- `moneda`.
- `estado_electronico`.
- `pagos`.
- `retenciones`.
- `notas_credito`.
- `facturacion_electronica`.
- `consecutivo`.
- `impresion`.
- `cartera_cliente`.
- `empresa`.
- `sucursal_configuracion`.
- `taller`.
- `acta_entrega`.
- `ruta_despacho`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "impuestos",
      "estado",
      "qr",
      "nota",
      "documento",
      "moneda",
      "estado_electronico",
      "pagos",
      "retenciones",
      "notas_credito",
      "facturacion_electronica",
      "consecutivo",
      "impresion",
      "cartera_cliente",
      "empresa",
      "sucursal_configuracion",
      "taller",
      "acta_entrega",
      "ruta_despacho",
      "comentarios",
      "adjuntos"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }; Transaccion.comentarios?: Comentario[]; Transaccion.adjuntos?: Adjunto[]; Transaccion.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "transacciones": [
    {
      "codigos": {
        "id_transacion": 1,
        "n_transacion": 1,
        "n_factura": "1",
        "prefijo": "DOC",
        "numeracion": 1,
        "tipo_documento": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0,
        "total_costo": 7000,
        "total_utilidad": 3000,
        "total_abono": 11900,
        "saldo_pendiente": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo",
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "telefonos": "0000000000",
        "correos": "cliente@example.invalid"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_factura": 1735689600000,
        "fecha_registro": 1735689600000,
        "fecha_vencimiento": 1738281600000
      },
      "ruta_despacho": {
        "id_ruta": 1,
        "nombre": "Ruta ejemplo"
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "factura-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/factura-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          },
          "impuestos": {
            "total_impuesto": 1900
          },
          "descuento": {
            "descuento": 0
          }
        }
      ]
    }
  ]
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- Los filtros total, subtotal, deuda, saldo y descuento aceptan límites desde/hasta decimales.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- La identificación del padre se devuelve dentro de codigos; transacion no es un grupo válido.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas; Factura con comentarios y archivos.

### `documentos-crear`: Crear documento

**Para qué sirve:** Crea el documento indicado por tipoDocumento, incluyendo transacciones y documentos comerciales con sus productos, cliente y forma de pago.

**Método:** `POST`.

**Ruta:** `/api/v1/documentos`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `tipoDocumento` | Sí | Tipo de documento; consulta el catálogo de valores admitidos antes de crear la operación. Tipo: entero.; no admite null |
| `type_match_producto` | Sí | Tipo: entero.; valor habitual: `1`; valores: `1`, `2`, `3`; no admite null |
| `id_consecutivo` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `codigo_unico` | Sí | Conserva ceros iniciales y no se normaliza. Tipo: texto.; no admite null; patrón: `^[0-9]{1,50}$` |
| `nota` | Sí | Tipo: texto.; no admite null |
| `observacion` | Sí | Tipo: texto.; no admite null |
| `id_sucursal` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_bodega` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_vendedor` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `fecha_registro` | No | Tipo: milisegundos desde epoch.; no admite null |
| `fecha_vencimiento` | No | Tipo: milisegundos desde epoch.; no admite null |
| `id_centro_costo` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `objClienteMini` | Sí | Tipo: objeto.; no admite null |
| `objClienteMini.id_cliente` | Sí | Tipo: entero.; no admite null |
| `objClienteMini.nombre_cliente` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.identificacion` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.telefono1` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.telefono2` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.email1` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.direccion` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.id_tipo_persona` | Sí | Tipo: entero.; no admite null |
| `objClienteMini.es_cliente` | Sí | Tipo: entero.; no admite null |
| `objClienteMini.es_proveedor` | Sí | Tipo: entero.; no admite null |
| `objClienteMini.departamento` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.pais` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.ciudad` | Sí | Tipo: texto.; no admite null |
| `objClienteMini.zona` | Sí | Tipo: texto.; no admite null |
| `objDetalle` | Sí | Tipo: arreglo.; mínimo de elementos: `1`; no admite null |
| `objDetalle[].cantidad` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `objDetalle[].descripcion` | Sí | Tipo: texto.; no admite null |
| `objDetalle[].total` | Sí | Total de la línea; Cuenti calcula el valor unitario. Tipo: número.; mínimo: `0`; no admite null |
| `objDetalle[].cambiar_precio_compra` | Sí | Tipo: booleano.; no admite null |
| `objDetalle[].id_producto` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalle[].code` | No | Tipo: texto.; no admite null |
| `objDetalle[].id_plan_cuentas` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalle[].impuestos` | No | Tipo: objeto.; no admite null |
| `objDetalle[].impuestos.id_impuesto` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalle[].impuestos.total_impuesto_agregado_1` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `objDetalle[].impuestos.total_impuesto_agregado_2` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `lstPagos` | Sí | Tipo: arreglo.; no admite null |
| `lstPagos[].id_comprobante_caja` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `lstPagos[].id_medio_pago` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `lstPagos[].id_banco` | Sí | Tipo: entero.; mínimo: `0`; no admite null |
| `lstPagos[].valor` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `lstPagos[].boucher` | Sí | Tipo: texto.; no admite null |
| `lstPagos[].digitos` | Sí | Tipo: texto.; no admite null |
| `lstPagos[].devuelta` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `lstPagos[].dinero_entregado` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `lstPagos[].nota` | Sí | Tipo: texto.; no admite null |
| `impuestos` | No | Tipo: objeto.; no admite null |
| `impuestos.id_impuesto` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `impuestos.total_impuesto_agregado_1` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `impuestos.total_impuesto_agregado_2` | Sí | Tipo: número.; mínimo: `0`; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "tipoDocumento": 1,
    "type_match_producto": 1,
    "id_consecutivo": 3,
    "codigo_unico": "001",
    "nota": "",
    "observacion": "",
    "id_sucursal": 1,
    "id_bodega": 1,
    "id_vendedor": 1,
    "id_empleado": 1,
    "objClienteMini": {
      "id_cliente": 1179,
      "nombre_cliente": "Cliente de ejemplo",
      "identificacion": "",
      "telefono1": "",
      "telefono2": "",
      "email1": "",
      "direccion": "",
      "id_tipo_persona": 1,
      "es_cliente": 1,
      "es_proveedor": 0,
      "departamento": "",
      "pais": "",
      "ciudad": "",
      "zona": ""
    },
    "objDetalle": [
      {
        "cantidad": 2,
        "descripcion": "Producto",
        "total": 20000,
        "cambiar_precio_compra": false,
        "id_producto": 25
      }
    ],
    "lstPagos": []
  }
}
```

**Respuesta esperada:** Mensaje { type: integer, message: string, retorno: string, id_transacion: integer, url_interna: string, url_externa: string }.

**Ejemplo de respuesta:**

```json
{
  "type": 1,
  "message": "guardar",
  "retorno": "resultado-ejemplo",
  "id_transacion": 511903,
  "url_interna": "https://ejemplo.invalid/documento",
  "url_externa": "https://ejemplo.invalid/documento"
}
```

**Errores y límites**

- codigo_unico debe ser un string de 1 a 50 dígitos y conserva ceros iniciales.
- No mezcle detalles de inventario y gasto en el mismo documento.
- retorno es opaco y no debe analizarse.
- No se reintentan automáticamente documentos sin idempotencia comprobada.

**Notas**

- lstPagos vacío representa una operación a crédito.
- Los campos sin información de objClienteMini se envían como string vacío.
- La respuesta exitosa incluye siempre id_transacion, url_interna y url_externa.

- El detalle admite campos adicionales. `lstPagos[].id_comprobante_caja` es una referencia opcional al crear el documento; no publica una asociación posterior de pedidos existentes.

### `transacciones-anular`: Anular transacción

**Para qué sirve:** Anula transacciones existentes y revierte inventario y pagos según las reglas del ERP.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/anulaciones`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_transacion` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `nota` | Sí | Tipo: texto.; no admite null; patrón: `\S` |
| `observacion` | No | Tipo: texto.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_transacion": 544182,
    "id_empleado": 1,
    "nota": "Motivo de la anulación",
    "observacion": "Detalle interno opcional"
  }
}
```

**Respuesta esperada:** ResultadoAnulacion.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "status": "ANULADO"
}
```

**Errores y límites**

- Los errores de negocio se devuelven como erp_mutation_rejected sin detalles internos.
- Un resultado de transporte desconocido no debe repetirse automáticamente.

**Notas**

- Anula transacciones existentes y revierte inventario y pagos según las reglas del ERP.
- Solo type=1 confirma la anulación y permite invalidar caché.
- No hay reintentos automáticos.

### `documentos-anular`: Anular documento logístico

**Para qué sirve:** La ruta pública usa POST aunque Java ejecuta un GET con efectos secundarios.

**Método:** `POST`.

**Ruta:** `/api/v1/documentos/{id_documento}/anulaciones/{id_empleado}`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Parámetros de ruta**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_documento` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |

**Cuerpo:** sin cuerpo.

**Ejemplo de argumentos:**

```json
{
  "id_documento": 12345,
  "id_empleado": 1
}
```

**Respuesta esperada:** ResultadoAnulacion.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "status": "ANULADO"
}
```

**Errores y límites**

- Actas activas, errores de inventario, documentos inexistentes o tokens inválidos rechazan la operación.
- No se devuelven excepciones ni mensajes técnicos del ERP.

**Notas**

- La ruta pública usa POST aunque Java ejecuta un GET con efectos secundarios.
- type=1 devuelve ANULADO; type=0 con código exacto 1017 devuelve YA_ESTABA_ANULADO. Ambos invalidan caché.
- Los demás type=0 no invalidan caché y no se reintentan automáticamente.

### `transacciones-notas-crear`: Crear nota crédito o débito

**Para qué sirve:** es_nota_credito=1 crea crédito; 0 crea débito.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/notas`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_transacion` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `es_nota_credito` | Sí | Tipo: entero.; valores: `0`, `1`; no admite null |
| `valor` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_cliente` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `id_sucursal` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `nota` | Sí | Tipo: texto.; no admite null; patrón: `\S` |
| `madificoSaldo` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `retornarDinero` | No | Tipo: booleano.; no admite null |
| `objDetalleNota` | Sí | Tipo: arreglo.; no admite null |
| `objDetalleNota[].id_detalle_transacion` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalleNota[].id_producto` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalleNota[].id_producto_sucursal` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `objDetalleNota[].cantidad` | Sí | Tipo: número.; no admite null |
| `objDetalleNota[].precio_venta` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `objDetalleNota[].total` | Sí | Tipo: número.; mínimo: `0`; no admite null |
| `objDetalleNota[].descripcion` | No | Tipo: texto.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_transacion": 544182,
    "es_nota_credito": 1,
    "valor": 50000,
    "id_empleado": 1,
    "id_cliente": 1,
    "id_sucursal": 1,
    "nota": "Ajuste por nota crédito",
    "madificoSaldo": 1,
    "retornarDinero": false,
    "objDetalleNota": []
  }
}
```

**Respuesta esperada:** tipoMensajes.

**Ejemplo de respuesta:**

```json
{
  "type": 1,
  "message": "save",
  "retorno": "15894"
}
```

**Errores y límites**

- type=0 rechaza la creación sin invalidar caché.
- Un resultado desconocido no debe repetirse automáticamente.

**Notas**

- es_nota_credito=1 crea crédito; 0 crea débito.
- id_cliente, id_sucursal, madificoSaldo y retornarDinero son opcionales; Java obtiene la sucursal de la transacción padre.
- Conserva la grafía nativa madificoSaldo: 1 afecta el saldo pendiente; 0 no lo modifica.
- retornarDinero=true solicita devolución física en caja según reglas del ERP.
- objDetalleNota es obligatorio y admite [] para ajustes exclusivamente financieros; nunca envíe null.
- retorno contiene id_nota. Crear la nota y emitirla electrónicamente son operaciones separadas.

### `transacciones-notas-credito-emitir`: Emitir nota crédito electrónica

**Para qué sirve:** Una sola ruta pública POST admite emitir_nc_sin_fe booleano; si se omite, vale false.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/notas-credito/{id_nota}/emision`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Parámetros de ruta**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_nota` | Sí | Tipo: entero.; mínimo: `1`; no admite null |

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `emitir_nc_sin_fe` | No | Tipo: booleano.; no admite null |

**Cuerpo:** opcional.

**Ejemplo de argumentos:**

```json
{
  "id_nota": 15894,
  "body": {
    "emitir_nc_sin_fe": false
  }
}
```

**Respuesta esperada:** tipoMensajes.

**Ejemplo de respuesta:**

```json
{
  "type": 1,
  "message": "save",
  "retorno": "ok"
}
```

**Errores y límites**

- Un rechazo DIAN con type=0 no es éxito aunque message=save.
- No se repite automáticamente una emisión cuyo resultado no se pudo confirmar.

**Notas**

- Una sola ruta pública POST admite emitir_nc_sin_fe booleano; si se omite, vale false.
- false usa la factura electrónica original; true agrega /true al GET nativo para emitir sin factura electrónica previa.
- La bandera se consume en el wrapper: Java recibe un GET sin cuerpo.
- Conserva id_nota si la emisión falla; no recrees la nota automáticamente.

### `ventas-productos-comprados-busquedas`: Buscar productos comprados

**Para qué sirve:** Buscar productos comprados. Su resultado principal es `productos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/productos-comprados/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_cliente` | Sí | número entero |
| `id_sucursal` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `es_ingreso` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `producto`, `cantidades`, `totales`, `costos`, `fechas`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "id_cliente": 1179,
  "tipo_documento": "1,9",
  "es_ingreso": 1,
  "body": {
    "grupos": [
      "producto",
      "cantidades",
      "totales",
      "costos",
      "fechas"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, productos: ProductoComprado[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "productos": [
    {
      "producto": {
        "id_producto": 25,
        "sku": "SKU-001",
        "nombre_producto": "Producto ejemplo"
      },
      "cantidades": {
        "cantidad": 1
      },
      "totales": {
        "subtotal": 10000,
        "total_neto": 11900
      },
      "costos": {
        "costo_unitario": 7000
      },
      "fechas": {
        "fecha_registro": 1735689600000
      }
    }
  ]
}
```

- Los resultados se consolidan por id_producto.
- Las transacciones anuladas se excluyen de forma predeterminada.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- id_cliente es obligatorio.
- grupos no debe estar vacío, debe contener valores únicos y limitarse al catálogo.

**Peticiones habituales:** Productos comprados por cliente.

### `ventas-descuentos-busquedas`: Buscar descuentos

**Para qué sirve:** Buscar descuentos. Su resultado principal es `descuentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/descuentos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `es_ingreso` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `transaccion`, `cliente`, `empleado`, `vendedor`, `totales`, `producto`, `cantidades`, `precios`, `descuento`.

**Regla de selección:**
- Si `grupos` contiene `producto`, `cantidades`, `precios`, `descuento`, usa únicamente grupos de detalle; no mezcles `empleado` o `vendedor`.
- Si no contiene esos grupos, usa únicamente grupos de cabecera.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "es_ingreso": 1,
  "body": {
    "grupos": [
      "transaccion",
      "cliente",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, descuentos: Descuento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "descuentos": [
    {
      "transaccion": {
        "id_transacion": 1,
        "n_factura": "DOC-001"
      },
      "cliente": {
        "id_cliente": 1,
        "nombre_cliente": "Cliente ejemplo"
      },
      "producto": {
        "id_producto": 25,
        "nombre": "Producto ejemplo"
      },
      "descuento": {
        "descuento": 1000,
        "porcentaje_descuento": 10
      },
      "totales": {
        "total_neto": 9000
      }
    }
  ]
}
```

- Las transacciones anuladas se excluyen de forma predeterminada.
- La proyección se determina por los grupos solicitados.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- Los grupos de detalle requieren producto, cantidades, precios o descuento.

**Peticiones habituales:** Descuentos de factura; Descuentos de producto.

### `ventas-consolidados-busquedas`: Buscar historial consolidado

**Para qué sirve:** Buscar historial consolidado. Su resultado principal es `consolidado`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/consolidados/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `agrupar_por` | No | `cliente`, `empleado`, `vendedor`; valor habitual `cliente` |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `es_ingreso` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `agrupacion`, `cantidad`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "agrupar_por": "cliente",
  "es_ingreso": 1,
  "body": {
    "grupos": [
      "agrupacion",
      "cantidad",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, consolidado: FilaConsolidada[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "consolidado": [
    {
      "agrupacion": {
        "id": 1,
        "nombre": "Cliente ejemplo"
      },
      "cantidad": {
        "cantidad": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0
      }
    }
  ]
}
```

- Las transacciones anuladas se excluyen de forma predeterminada, salvo que se proporcione es_nula=1.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- agrupar_por debe ser cliente, empleado o vendedor.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Por cliente; Por empleado; Por vendedor.

### `operativas-pedidos-busquedas`: Buscar pedidos

**Para qué sirve:** Buscar pedidos. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/pedidos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_documento` | No | número entero; mínimo `1` |
| `n_documento` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `id_ruta_despacho` | No | número entero |
| `id_transacion` | No | número entero |
| `id_canal` | No | número entero |
| `es_facturado` | No | `0`, `1` |
| `es_facturado_manual` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `bodegas`.
- `ruta_despacho`.
- `logistica`.
- `estado`.
- `documento`.
- `nota`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "es_facturado": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "bodegas",
      "ruta_despacho",
      "logistica",
      "estado",
      "documento",
      "nota"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }; Documento.comentarios?: Comentario[]; Documento.adjuntos?: Adjunto[]; Documento.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "documentos": [
    {
      "codigos": {
        "id_documento": 1,
        "n_documento": "DOC-001",
        "tipo_documento": 4
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_documento": 1735689600000,
        "fecha_registro": 1735689600000
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "pedido-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/pedido-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          }
        }
      ]
    }
  ]
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Los filtros total, subtotal y descuento aceptan límites desde/hasta decimales.
- Las respuestas no exponen credenciales ni claves internas.
- La identificación del padre se devuelve dentro de codigos; documento es el grupo de documentos, no un alias de transacion.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas; Documento con comentarios y archivos; Documento completo por ID.

### `operativas-cotizaciones-busquedas`: Buscar cotizaciones

**Para qué sirve:** Buscar cotizaciones. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/cotizaciones/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_documento` | No | número entero; mínimo `1` |
| `n_documento` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `id_ruta_despacho` | No | número entero |
| `id_transacion` | No | número entero |
| `id_canal` | No | número entero |
| `es_facturado` | No | `0`, `1` |
| `es_facturado_manual` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `bodegas`.
- `ruta_despacho`.
- `logistica`.
- `estado`.
- `documento`.
- `nota`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "es_facturado": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "bodegas",
      "ruta_despacho",
      "logistica",
      "estado",
      "documento",
      "nota"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }; Documento.comentarios?: Comentario[]; Documento.adjuntos?: Adjunto[]; Documento.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "documentos": [
    {
      "codigos": {
        "id_documento": 1,
        "n_documento": "DOC-001",
        "tipo_documento": 4
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_documento": 1735689600000,
        "fecha_registro": 1735689600000
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "pedido-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/pedido-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          }
        }
      ]
    }
  ]
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Los filtros total, subtotal y descuento aceptan límites desde/hasta decimales.
- Las respuestas no exponen credenciales ni claves internas.
- La identificación del padre se devuelve dentro de codigos; documento es el grupo de documentos, no un alias de transacion.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas; Documento con comentarios y archivos; Documento completo por ID.

### `operativas-despachos-busquedas`: Buscar despachos

**Para qué sirve:** Buscar despachos. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/despachos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_documento` | No | número entero; mínimo `1` |
| `n_documento` | No | número entero |
| `id_cliente` | No | número entero |
| `id_empleado` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `id_ruta_despacho` | No | número entero |
| `id_transacion` | No | número entero |
| `id_canal` | No | número entero |
| `es_facturado` | No | `0`, `1` |
| `es_facturado_manual` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |
| `descuento_desde` | No | número |
| `descuento_hasta` | No | número |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`.
- `fechas`.
- `sucursal`.
- `cliente`.
- `empleado`.
- `vendedor`.
- `totales`.
- `bodegas`.
- `ruta_despacho`.
- `logistica`.
- `estado`.
- `documento`.
- `nota`.
- `comentarios`: Comentarios asociados al documento; se entregan como una lista embebida de cabecera. Incluye `id_comentario`, `comentario`, `id_empleado`, `empleado`, `leido`, `fecha_registro`.
  - `id_comentario`: Identificador del comentario asociado al documento.
  - `comentario`: Texto del comentario asociado al documento.
  - `id_empleado`: Identificador interno del empleado.
  - `empleado`: Empleado asociado al comentario o a la operación.
  - `leido`: Indica si el comentario fue marcado como leído.
  - `fecha_registro`: Fecha de creación del tercero.
- `adjuntos`: Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida. Incluye `id_adjunto`, `nombre_real`, `tipo`, `etiqueta`, `ruta`, `fecha_registro`. Alias: `archivos`.
  - `id_adjunto`: Identificador del archivo adjunto asociado al documento.
  - `nombre_real`: Nombre real del archivo adjunto.
  - `tipo`: Tipo MIME o clasificación del archivo adjunto.
  - `etiqueta`: Etiqueta visible del archivo adjunto.
  - `ruta`: Ruta o URL del archivo adjunto.
  - `fecha_registro`: Fecha de creación del tercero.
- `archivos`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `producto`, `cantidades`, `precios`, `impuestos`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "es_facturado": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "sucursal",
      "cliente",
      "empleado",
      "vendedor",
      "totales",
      "bodegas",
      "ruta_despacho",
      "logistica",
      "estado",
      "documento",
      "nota"
    ],
    "detalle": [
      "producto",
      "cantidades",
      "precios",
      "impuestos",
      "descuento",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }; Documento.comentarios?: Comentario[]; Documento.adjuntos?: Adjunto[]; Documento.archivos?: Archivo[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "documentos": [
    {
      "codigos": {
        "id_documento": 1,
        "n_documento": "DOC-001",
        "tipo_documento": 4
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0
      },
      "cliente": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "fechas": {
        "fecha_documento": 1735689600000,
        "fecha_registro": 1735689600000
      },
      "comentarios": [
        {
          "id_comentario": 1,
          "comentario": "Comentario ficticio de integración",
          "id_empleado": 1,
          "empleado": "Empleado ejemplo",
          "leido": 1,
          "fecha_registro": 1735689600000
        }
      ],
      "adjuntos": [
        {
          "id_adjunto": 1,
          "nombre_real": "pedido-ejemplo.pdf",
          "tipo": "application/pdf",
          "etiqueta": "Documento",
          "ruta": "https://example.invalid/archivos/pedido-ejemplo.pdf",
          "fecha_registro": 1735689600000
        }
      ],
      "detalle": [
        {
          "producto": {
            "id_producto": 25,
            "sku": "SKU-001",
            "nombre": "Producto ejemplo"
          },
          "cantidades": {
            "cantidad": 1
          },
          "precios": {
            "precio_unitario": 10000
          },
          "totales": {
            "subtotal": 10000,
            "total_neto": 11900
          }
        }
      ]
    }
  ]
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Los filtros total, subtotal y descuento aceptan límites desde/hasta decimales.
- Las respuestas no exponen credenciales ni claves internas.
- La identificación del padre se devuelve dentro de codigos; documento es el grupo de documentos, no un alias de transacion.
- comentarios, adjuntos y archivos son grupos de cabecera opcionales y se cargan bajo demanda; archivos conserva ese nombre en la respuesta y, si se solicitan ambos, adjuntos tiene precedencia.
- Los ejemplos usan valores ficticios y URLs example.invalid.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas; Documento con comentarios y archivos; Documento completo por ID.

### `operativas-productos-busquedas`: Buscar productos de documentos comerciales

**Para qué sirve:** Buscar productos de documentos comerciales. Su resultado principal es `productos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/productos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_cliente` | No | número entero; mínimo `1` |
| `es_devolucion` | No | `0`, `1` |
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `producto`, `cantidades`, `totales`, `costos`, `fechas`.

**Ejemplo de argumentos:**

```json
{
  "id_cliente": 1179,
  "body": {
    "grupos": [
      "producto",
      "cantidades",
      "totales",
      "costos",
      "fechas"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, productos: ProductoDocumento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "productos": [
    {
      "producto": {
        "id_producto": 25,
        "sku": "SKU-001",
        "nombre_producto": "Producto ejemplo"
      },
      "cantidades": {
        "cantidad": 1
      },
      "totales": {
        "subtotal": 10000,
        "total_neto": 11900
      },
      "fechas": {
        "fecha_registro": 1735689600000
      }
    }
  ]
}
```

- Los productos se agrupan por id_producto y respetan la paginación.
- No se permite mezclar políticas de buscarProductosComprados.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- Debe especificar id_cliente o id_vendedor.
- Los filtros de fecha son inclusivos y usan epoch-milliseconds.

**Peticiones habituales:** Productos por cliente.

### `operativas-descuentos-busquedas`: Buscar descuentos de documentos comerciales

**Para qué sirve:** Buscar descuentos de documentos comerciales. Su resultado principal es `descuentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/descuentos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_documento` | No | número entero; mínimo `1` |
| `es_devolucion` | No | `0`, `1` |
| `id_cliente` | No | número entero; mínimo `1` |
| `id_empleado` | No | número entero; mínimo `1` |
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `documento`, `cliente`, `empleado`, `vendedor`, `totales`, `producto`, `cantidades`, `precios`, `descuento`.

**Regla de selección:**
- Si `grupos` contiene `producto`, `cantidades`, `precios`, `descuento`, usa únicamente grupos de detalle; no mezcles `empleado` o `vendedor`.
- Si no contiene esos grupos, usa únicamente grupos de cabecera.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "grupos": [
      "documento",
      "cliente",
      "empleado",
      "vendedor",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, descuentos: DescuentoDocumento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "descuentos": [
    {
      "documento": {
        "id_documento": 1,
        "n_documento": "DOC-001"
      },
      "cliente": {
        "id_cliente": 1,
        "nombre_cliente": "Cliente ejemplo"
      },
      "producto": {
        "id_producto": 25,
        "nombre": "Producto ejemplo"
      },
      "descuento": {
        "descuento": 1000
      },
      "totales": {
        "total_neto": 9000
      }
    }
  ]
}
```

- Los grupos producto, cantidades, precios o descuento solicitan el modo detalle.
- Los resultados solo incluyen documentos con descuentos.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- Los filtros de fecha son inclusivos y usan epoch-milliseconds.

**Peticiones habituales:** Descuentos por documento (cabecera); Descuentos por producto (detalle).

### `operativas-consolidados-busquedas`: Consolidar documentos comerciales

**Para qué sirve:** Consolidar documentos comerciales. Su resultado principal es `consolidado`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/consolidados/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `agrupar_por` | No | `cliente`, `empleado`, `vendedor`, `sucursal`; valor habitual `cliente` |
| `es_devolucion` | No | `0`, `1` |
| `id_cliente` | No | número entero; mínimo `1` |
| `id_empleado` | No | número entero; mínimo `1` |
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `total_desde` | No | número |
| `total_hasta` | No | número |
| `subtotal_desde` | No | número |
| `subtotal_hasta` | No | número |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `agrupacion`, `cantidad`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "agrupar_por": "cliente",
  "body": {
    "grupos": [
      "agrupacion",
      "cantidad",
      "totales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, consolidado: ConsolidadoDocumento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "consolidado": [
    {
      "agrupacion": {
        "id": 1,
        "nombre": "Cliente ejemplo"
      },
      "cantidad": {
        "cantidad": 1
      },
      "totales": {
        "subtotal": 10000,
        "impuesto": 1900,
        "total_neto": 11900,
        "descuento": 0
      }
    }
  ]
}
```

- El consolidado agrupa documentos por la dimensión seleccionada.
- Los rangos de fecha incluyen ambos extremos y usan epoch-milliseconds.
- Los filtros total y subtotal aceptan límites desde/hasta decimales.
- agrupar_por debe ser cliente, empleado, vendedor o sucursal.
- Los grupos deben ser únicos y no vacíos.

**Peticiones habituales:** Consolidado por cliente.

## Catálogo

### `catalogo-productos-busquedas`: Buscar productos del catálogo

**Para qué sirve:** Buscar productos del catálogo. Su resultado principal es `productos`.

**Método:** `POST`.

**Ruta:** `/api/v1/catalogo/productos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `id_producto` | No | número entero; mínimo `1` |
| `sku` | No | texto; coincidencia exacta |
| `codigo_barras` | No | texto; coincidencia exacta |
| `nombre_producto` | No | texto; coincidencia parcial |
| `id_categoria` | No | número entero; mínimo `1` |
| `nombre_categoria` | No | texto; coincidencia parcial |
| `id_marca` | No | número entero; mínimo `1` |
| `nombre_marca` | No | texto; coincidencia parcial |
| `es_ingrediente` | No | `0`, `1` |
| `es_servicio` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `mostrar_tienda` | No | `0`, `1` |
| `con_existencias` | No | `0`, `1` |
| `id_proveedor` | No | número entero |
| `nit_proveedor` | No | texto; coincidencia exacta o patrón LIKE con % |
| `nombre_proveedor` | No | texto; coincidencia parcial |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `producto`, `sucursal`, `precios`, `inventario`, `categoria`, `marca`, `impuestos`, `medida`, `imagen`, `configuracion`, `composicion`, `empaque`, `presentaciones`, `proveedor`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "con_existencias": 1,
  "body": {
    "grupos": [
      "producto",
      "sucursal",
      "precios",
      "inventario",
      "categoria",
      "marca",
      "impuestos",
      "medida",
      "imagen",
      "configuracion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, productos: Producto[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "productos": [
    {
      "producto": {
        "id_producto": 25,
        "id_tipo_producto": 1,
        "nombre": "Producto ejemplo",
        "sku": "SKU-001",
        "codigo_barras": "000000000001",
        "nota": "Descripción de ejemplo",
        "es_servicio": 0,
        "es_ingrediente": 0,
        "mostrar_tienda": 1,
        "alias": "Producto",
        "metadata": "{}"
      },
      "sucursal": {
        "id_producto_sucursal": 1,
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal",
        "ubicacion": "Ubicación ejemplo",
        "es_activo": 1
      },
      "precios": {
        "precio_venta": 10000,
        "precio_compra": 7000,
        "costo": 7000,
        "costo_fijo": 7000,
        "precio_venta_minimo": 9000,
        "precio_venta_online": 10000,
        "precio_promocion_sito": 9500,
        "precio_promocion_online": 9500,
        "descuento_maximo": 10
      },
      "inventario": {
        "existencias": 10,
        "stock_minimo": 2,
        "vende_sin_existencia": 0,
        "maneja_lote": 0,
        "maneja_seriales": 0
      },
      "categoria": {
        "id_categoria": 1,
        "nombre_categoria": "Categoría ejemplo"
      },
      "marca": {
        "id_marca": 1,
        "nombre_marca": "Marca ejemplo"
      },
      "impuestos": {
        "id_impuesto": 1,
        "nombre_impuesto": "Impuesto ejemplo",
        "valor_impuesto": 19,
        "tipo_impuesto": "porcentaje",
        "clasificacion_tributaria": "gravado",
        "total_estampilla": 0,
        "total_impoconsumo": 0
      },
      "medida": {
        "id_tipo_medida": 1,
        "nombre_medida": "Unidad",
        "tipo_medida": "UND"
      },
      "imagen": {
        "id_imagen": 1,
        "ext1": "jpg",
        "ext2": "webp",
        "url_imagen": "https://example.invalid/producto-200.jpg",
        "url_imagen_400": "https://example.invalid/producto-400.jpg"
      },
      "configuracion": {
        "invima": "REGISTRO-EJEMPLO",
        "cum": null,
        "cups": null,
        "codigo_producto_dian": "00000000",
        "tiempo_preparacion": 0,
        "ncm": "0000.00.00",
        "fecha_registro": 1735689600000
      },
      "composicion": [
        {
          "id_producto": 26,
          "nombre": "Componente ejemplo",
          "id_tipo_producto": 1,
          "unidades": 2,
          "es_activo": 1,
          "validar_inventario": 1,
          "existencias": 10
        }
      ],
      "empaque": {
        "cantidad_por_paquete": 6,
        "cantidad_medida_paquete": 1,
        "id_unidad_medida_paquete": 1,
        "unidad_medida_paquete": "Unidad",
        "equivalencia_compra": 6,
        "sku_proveedor": "PROV-001",
        "total_paquete": 60,
        "total_paquete_unidad": "60 Unidad"
      },
      "presentaciones": [
        {
          "equivalencia": 6,
          "existencias_disponibles": 60
        }
      ],
      "proveedor": {
        "id_proveedor": 7,
        "nit": "PROVEEDOR-EJEMPLO",
        "nombre": "Proveedor ejemplo"
      }
    }
  ]
}
```

- El body acepta columnas o grupos de catálogo; el orden solicitado se conserva.
- Los valores vacíos de filtros de texto se ignoran.
- nit_proveedor usa igualdad salvo que el valor incluya %, caso en el que se envía como patrón LIKE.
- composicion se carga bajo demanda, evita ciclos y anida productos compuestos hasta cinco niveles; presentaciones agrega existencias_disponibles.
- Los filtros y columnas desconocidos se rechazan.
- Los valores de paginación deben permanecer entre 0 y 1000 registros por página.

**Peticiones habituales:** Productos activos con inventario.

### `catalogo-categorias-busquedas`: Buscar categorías

**Para qué sirve:** Buscar categorías. Su resultado principal es `categorias`.

**Método:** `POST`.

**Ruta:** `/api/v1/catalogo/categorias/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_categoria` | No | número entero; mínimo `1` |
| `nombre_categoria` | No | texto; coincidencia parcial |
| `id_categoria_padre` | No | número entero; mínimo `1` |
| `es_visible_tienda` | No | `0`, `1` |
| `mostrar_tienda_linea` | No | `0`, `1` |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `categoria`, `tienda`, `imagen`, `sucursales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "categoria",
      "tienda",
      "imagen",
      "sucursales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, categorias: Categoria[] }; Categoria.sucursales: JsonValue | string | null; Categoria.subcategorias: Categoria[].

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "categorias": [
    {
      "categoria": {
        "id_categoria": 1,
        "nombre_categoria": "Categoría ejemplo",
        "alias": "Categoría",
        "codigo_dian": "CAT-001",
        "id_categoria_padre": 0,
        "es_activo": 1,
        "fecha_registro": 1735689600000
      },
      "tienda": {
        "visible_tienda": 1,
        "mostrar_tienda_linea": 1,
        "mostrar_catalogo_linea": 1,
        "metadata": "{}"
      },
      "imagen": {
        "id_imagen": 1,
        "formato": "png",
        "url": "https://example.invalid/categoria.png"
      },
      "sucursales": {
        "sucursales": [
          1
        ],
        "alerta_vencimiento_lotes": 0,
        "visible_produccion": 0
      }
    }
  ]
}
```

- Las categorías raíz se paginan y subcategorias siempre conserva su estructura recursiva.
- sucursales se devuelve como arreglo u objeto cuando contiene JSON válido, tanto en categorías raíz como en cada nivel de subcategorias; un valor histórico vacío o malformado se conserva como string y null permanece null.
- Una categoría cuyo padre no está disponible con el filtro de estado se devuelve como raíz.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Árbol de categorías activas.

### `catalogo-productos-impuestos-licores`: Actualizar impuestos de licores

**Para qué sirve:** Actualizar impuestos de licores.

**Método:** `PATCH`.

**Ruta:** `/api/v1/catalogo/productos/impuestos-licores`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

Envía una lista con entre 1 y 1000 elementos.

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `id_producto` | Sí | número entero; mínimo `1`; no puede repetirse en la misma solicitud | Producto positivo y único que se actualizará dentro de la solicitud. |
| `id_impuesto` | No | número entero; mínimo `1` | Nuevo impuesto positivo asociado al producto en la sucursal. |
| `total_estampilla` | No | número; mínimo `0` | Valor no negativo de estampilla que se almacenará. |
| `total_impoconsumo` | No | número; mínimo `0` | Valor no negativo de impoconsumo que se almacenará. |

- Cada elemento debe incluir al menos un campo opcional para actualizar.

**Ejemplo de argumentos:**

```json
{
  "body": [
    {
      "id_producto": 25,
      "id_impuesto": 3
    }
  ]
}
```

**Respuesta esperada:** Mensaje { message: string, type: integer, retorno?: string }.

**Éxito semántico:** la respuesta debe contener `type` = `1`.

**Ejemplo de respuesta:**

```json
{
  "message": "guardar",
  "type": 1,
  "retorno": "1"
}
```

- La actualización es transaccional y habilita la configuración de venta y compra de licores de la sucursal.
- Los reintentos automáticos están prohibidos sin idempotencia comprobada.
- Los ID de producto deben ser positivos y únicos dentro de la solicitud.
- Deben existir la sucursal, los productos, las relaciones entre sucursal y producto, y los ID de impuestos.
- Los valores monetarios no pueden ser negativos.

**Peticiones habituales:** Actualización parcial de impuestos.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.
Después incluye `confirmation=confirm:catalogo-productos-impuestos-licores` en los argumentos.

### `catalogo-marcas`: Consultar marcas activas

**Para qué sirve:** Consultar marcas activas.

**Método:** `GET`.

**Ruta:** `/api/v1/catalogo/marcas`.

**Tipo:** Consulta.

**Filtros:** no requiere filtros adicionales.

**Respuesta esperada:** Marca[].

**Ejemplo de respuesta:**

```json
[
  {
    "precio_unidad": -1,
    "id_marca": 2,
    "nombre_marca": "Marca de ejemplo",
    "fecha_registro": 1735689600000,
    "es_activo": 1,
    "error": ""
  }
]
```

- precio_unidad se devuelve como valor numérico; su regla funcional no se interpreta en este contrato.

**Peticiones habituales:** Marcas activas.

### `catalogo-marca-por-id`: Consultar marca por ID

**Para qué sirve:** Consultar marca por ID.

**Método:** `GET`.

**Ruta:** `/api/v1/catalogo/marcas/{id_marca}`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_marca` | Sí | número entero; mínimo `1` |

**Ejemplo de argumentos:**

```json
{
  "id_marca": 2
}
```

**Respuesta esperada:** Marca[].

**Ejemplo de respuesta:**

```json
[
  {
    "precio_unidad": -1,
    "id_marca": 2,
    "nombre_marca": "Marca de ejemplo",
    "fecha_registro": 1735689600000,
    "es_activo": 1,
    "error": ""
  }
]
```

- precio_unidad se devuelve como valor numérico; su regla funcional no se interpreta en este contrato.
- id_marca debe ser mayor que cero.

**Peticiones habituales:** Marca por ID.

## Inventario

### `inventario-conteos`: Registrar conteo de inventario

**Para qué sirve:** Registrar conteo de inventario.

**Método:** `POST`.

**Ruta:** `/api/v1/inventario/conteos`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

Envía una lista con entre 1 y 1000 elementos.

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `nombre` | Sí | texto | Nombre o concepto visible del conteo. |
| `nota` | Sí | texto | Observación asociada al conteo. |
| `id_concepto` | Sí | `-1`; valor habitual `-1` | Concepto del movimiento; debe ser -1. |
| `es_entrada` | Sí | `1`; valor habitual `1` | Sentido del movimiento; debe ser 1. |
| `cantidad` | Sí | número; mínimo `0` | Cantidad contada para el producto. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal donde se registra el conteo. |
| `id_bodega` | Sí | número entero; mínimo `1` | Bodega del conteo; debe coincidir con la sucursal. |
| `id_producto` | Sí | número entero; mínimo `1` | Producto contado. |
| `id_empleado` | Sí | número entero; mínimo `1` | Empleado que registra el conteo. |
| `fecha_registro` | Sí | fecha y hora en milisegundos Unix | Fecha del conteo en milisegundos desde epoch. |
| `id_centro_costo` | No | número entero; mínimo `1` | Centro de costo opcional del movimiento. |

- id_bodega debe ser igual a id_sucursal.
- id_concepto debe ser -1 y es_entrada debe ser 1.
- fecha_registro usa milisegundos desde la época Unix.

**Ejemplo de argumentos:**

```json
{
  "body": [
    {
      "nombre": "Conteo físico",
      "nota": "",
      "id_concepto": -1,
      "es_entrada": 1,
      "cantidad": 1,
      "id_sucursal": 1,
      "id_bodega": 1,
      "id_producto": 25,
      "id_empleado": 1,
      "fecha_registro": 1735689600000
    }
  ]
}
```

**Respuesta esperada:** Mensaje { message: string, type: integer, retorno?: string }.

**Éxito semántico:** la respuesta debe contener `type` = `1` y `message` = `"save"`.

**Ejemplo de respuesta:**

```json
{
  "message": "guardar",
  "type": 1,
  "retorno": ""
}
```

- Registra un conteo de inventario por producto y sucursal.
- El header X-Id-Empleado no sustituye el campo id_empleado dentro de cada elemento del body.
- La operación no se almacena en caché y solo invalida productos e inventario cuando la respuesta contiene type=1 y message=save.
- El cuerpo debe ser un arreglo no vacío.
- Cada movimiento debe incluir id_empleado con un valor entero mayor o igual a 1.
- id_bodega debe coincidir con id_sucursal.
- La respuesta type=0 indica que el ERP rechazó el movimiento y no invalida la caché.
- No se reintentan automáticamente escrituras sin idempotencia comprobada.

**Peticiones habituales:** Conteo de un producto.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.
Después incluye `confirmation=confirm:inventario-conteos` en los argumentos.

## Terceros

### `terceros-busquedas`: Buscar terceros

**Para qué sirve:** Buscar terceros. Su resultado principal es `clientes`.

**Método:** `POST`.

**Ruta:** `/api/v1/terceros/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | Sí | número entero; mínimo `1`; máximo `1000` |
| `nombre` | No | texto; coincidencia parcial |
| `nit` | No | texto; coincidencia exacta |
| `exacto` | No | texto |
| `telefono` | No | texto; coincidencia parcial en tres campos de teléfono |
| `correo` | No | texto; coincidencia parcial en dos campos de correo |
| `tipo_tercero` | No | `1` (cliente), `2` (proveedor), `3` (ambos) |
| `es_activo` | No | `0`, `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `tercero`, `contacto`, `sucursal`, `cartera_cliente`, `tributaria`, `configuracion`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "tipo_tercero": 1,
  "es_activo": 1,
  "body": {
    "grupos": [
      "tercero",
      "contacto",
      "sucursal",
      "cartera_cliente",
      "tributaria",
      "configuracion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, clientes: Cliente[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "clientes": [
    {
      "tercero": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "tipo_identificacion": {
          "id": 1,
          "nombre": "Tipo de documento",
          "pais": "País ejemplo"
        },
        "tipo_persona": {
          "id": 1,
          "nombre": "Persona ejemplo"
        },
        "nombre_cliente": "Cliente ejemplo",
        "primer_nombre": "Nombre",
        "segundo_nombre": null,
        "primer_apellido": "Apellido",
        "segundo_apellido": null,
        "alias": "Cliente",
        "fecha_nacimiento": null,
        "sexo": "N/A",
        "estado_civil": null,
        "estrato_social": null,
        "es_cliente": 1,
        "es_proveedor": 0,
        "es_consumidor_final": 0,
        "es_activo": 1,
        "fecha_registro": 1735689600000,
        "fecha_actualizacion": 1735689600000
      },
      "contacto": {
        "telefonos": [
          "0000000000"
        ],
        "correos": [
          "cliente@example.invalid"
        ],
        "direccion": "Dirección ejemplo",
        "ciudad": "Ciudad ejemplo",
        "departamento": "Departamento ejemplo",
        "pais": "País ejemplo",
        "zona": "Zona ejemplo",
        "contacto": "Contacto ejemplo",
        "sitio_web": "https://example.invalid",
        "facebook": null,
        "twitter": null,
        "instagram": null,
        "snapchat": null
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal",
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo",
        "id_lista_precios": 1,
        "nombre_lista_precios": "Lista general",
        "id_ruta_despacho": 1,
        "nombre_ruta_despacho": "Ruta ejemplo",
        "id_centro_costo": 1
      },
      "cartera_cliente": {
        "permite_cartera": 1,
        "cupo_cartera": 1000000,
        "dias_vencimiento_cartera_cliente": 30,
        "permite_cartera_vencida": 0,
        "permite_saldo_cartera": 1,
        "saldo_bono": 0,
        "puntos_acumulados": 0,
        "genera_bonos": 0,
        "envioSmsCartera": 0,
        "envioSmsProducto": 0,
        "medio_pago": 1
      },
      "tributaria": {
        "regimen": 1,
        "regimenImpuesto": 1,
        "legalidad": 1,
        "tipoOperacion": "10",
        "id_tipo_retencion_ventas": 1,
        "id_tipo_retencion_compra": 1,
        "id_clase_cliente": 1,
        "id_tipo_cliente": 1
      },
      "configuracion": {
        "codigo_interno": "CLI-001",
        "numero_matricula": "MATRICULA-EJEMPLO",
        "cliente_predeterminado": 0,
        "solo_remision2": 0,
        "codigo_turismo": null,
        "fecha_vencimiento_codigo_turismo": null,
        "nota": "Nota de ejemplo",
        "horario": "Horario de ejemplo",
        "id_empresa_portal": 1,
        "id_usuario_portal": 1,
        "tiene_documentos_asociados": 0
      }
    }
  ]
}
```

- La respuesta se publica en la colección clientes y conserva los bloques funcionales del ERP.
- No incluya NIT, teléfonos, correos ni nombres en las etiquetas de métricas de caché.
- nit usa coincidencia por prefijo de forma predeterminada, igualdad con exacto=1 o exacto=true, y LIKE cuando el valor incluye %.
- cantidad_registros es obligatorio según el contrato actual del servidor.
- grupos no debe estar vacío y debe contener valores únicos.
- Se rechazan los grupos desconocidos.

**Peticiones habituales:** Clientes.

### `terceros-crear`: Crear tercero

**Para qué sirve:** Crea un cliente o proveedor nuevo, o actualiza los datos de uno existente.

**Método:** `POST`.

**Ruta:** `/api/v1/terceros`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `nombre_cliente` | Sí | Según el esquema publicado por tools/list. |
| `id_tipo_persona` | Sí | Según el esquema publicado por tools/list. |
| `identificacion` | Sí | Según el esquema publicado por tools/list. |
| `id_empresa_portal` | No | Según el esquema publicado por tools/list. |
| `id_usuario_portal` | No | Según el esquema publicado por tools/list. |
| `primer_nombre` | No | Según el esquema publicado por tools/list. |
| `segundo_nombre` | No | Según el esquema publicado por tools/list. |
| `primer_apellido` | No | Según el esquema publicado por tools/list. |
| `segundo_apellido` | No | Según el esquema publicado por tools/list. |
| `direccion` | No | Según el esquema publicado por tools/list. |
| `sitio_web` | No | Según el esquema publicado por tools/list. |
| `facebook` | No | Según el esquema publicado por tools/list. |
| `twitter` | No | Según el esquema publicado por tools/list. |
| `instagram` | No | Según el esquema publicado por tools/list. |
| `snapchat` | No | Según el esquema publicado por tools/list. |
| `puntos_acumulados` | No | Según el esquema publicado por tools/list. |
| `nota` | No | Según el esquema publicado por tools/list. |
| `es_activo` | No | Según el esquema publicado por tools/list. |
| `fecha_registro` | No | Según el esquema publicado por tools/list. |
| `id_lista_precios` | No | Según el esquema publicado por tools/list. |
| `id_ruta_despacho` | No | Según el esquema publicado por tools/list. |
| `es_cliente` | Sí | Según el esquema publicado por tools/list. |
| `es_proveedor` | No | Según el esquema publicado por tools/list. |
| `ciudad` | No | Según el esquema publicado por tools/list. |
| `zona` | No | Según el esquema publicado por tools/list. |
| `contacto` | No | Según el esquema publicado por tools/list. |
| `codigo_interno` | No | Según el esquema publicado por tools/list. |
| `numero_matricula` | No | Según el esquema publicado por tools/list. |
| `id_estado_civil` | No | Según el esquema publicado por tools/list. |
| `id_estrato_social` | No | Según el esquema publicado por tools/list. |
| `id_clase_cliente` | No | Según el esquema publicado por tools/list. |
| `id_tipo_cliente` | No | Según el esquema publicado por tools/list. |
| `fecha_nacimiento` | No | Según el esquema publicado por tools/list. |
| `sexo` | No | Según el esquema publicado por tools/list. |
| `saldo_bono` | No | Según el esquema publicado por tools/list. |
| `permite_cartera_vencida` | No | Según el esquema publicado por tools/list. |
| `id_centro_costo` | No | Según el esquema publicado por tools/list. |
| `permite_saldo_cartera` | No | Según el esquema publicado por tools/list. |
| `cupo_cartera` | No | Según el esquema publicado por tools/list. |
| `permite_cartera` | No | Según el esquema publicado por tools/list. |
| `id_tipo_retencion_ventas` | No | Según el esquema publicado por tools/list. |
| `id_tipo_retencion_compra` | No | Según el esquema publicado por tools/list. |
| `id_sucursal` | No | Según el esquema publicado por tools/list. |
| `id_vendedor` | No | Según el esquema publicado por tools/list. |
| `envioSmsCartera` | No | Según el esquema publicado por tools/list. |
| `envioSmsProducto` | No | Según el esquema publicado por tools/list. |
| `pais` | No | Según el esquema publicado por tools/list. |
| `departamento` | No | Según el esquema publicado por tools/list. |
| `regimen` | No | Según el esquema publicado por tools/list. |
| `id_tipo_identificacion` | No | Según el esquema publicado por tools/list. |
| `medio_pago` | No | Según el esquema publicado por tools/list. |
| `tipoOperacion` | No | Según el esquema publicado por tools/list. |
| `cliente_predeterminado` | No | Según el esquema publicado por tools/list. |
| `legalidad` | No | Según el esquema publicado por tools/list. |
| `regimenImpuesto` | No | Según el esquema publicado por tools/list. |
| `fecha_vencimiento_codigo_turismo` | No | Según el esquema publicado por tools/list. |
| `codigo_turismo` | No | Según el esquema publicado por tools/list. |
| `alias` | No | Según el esquema publicado por tools/list. |
| `horario` | No | Según el esquema publicado por tools/list. |
| `dias_vencimiento_cartera_cliente` | No | Según el esquema publicado por tools/list. |
| `es_consumidor_final` | No | Según el esquema publicado por tools/list. |
| `genera_bonos` | No | Según el esquema publicado por tools/list. |
| `solo_remision2` | No | Según el esquema publicado por tools/list. |
| `tiene_documentos_asocisados` | No | Según el esquema publicado por tools/list. |
| `telefonos` | Sí | Según el esquema publicado por tools/list. |
| `correos` | Sí | Según el esquema publicado por tools/list. |
| `codigo_tributario` | No | Tipo: entero.; valores: `1`, `2`, `4`, `5`; no admite null |
| `cucon` | No | Tipo: texto.; no admite null |
| `es_declarante` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `aplico_retencion_venta` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `aplico_retencion_compra` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `solo_remision3` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `mostrar_precio_venta_orden_compra` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `contactos` | No | Tipo: arreglo.; no admite null |
| `lstContactoCliente` | No | Tipo: arreglo.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "nombre_cliente": "Tercero de ejemplo",
    "identificacion": "<id-documento>",
    "id_tipo_persona": 1,
    "es_cliente": 1,
    "es_proveedor": 0,
    "telefonos": [
      "<teléfono>"
    ],
    "correos": [
      "<correo>"
    ]
  }
}
```

**Respuesta esperada:** Mensaje { message: string, type: integer, retorno?: string }.

**Ejemplo de respuesta:**

```json
{
  "message": "save",
  "type": 1,
  "retorno": "<id_generado>"
}
```

**Errores y límites**

- Las operaciones de creación requieren identificación, tipo de persona, condición de cliente o proveedor, un teléfono y un correo.
- Se rechazan los campos desconocidos del cuerpo y las actualizaciones parciales vacías.

**Notas**

- codigo_tributario acepta 1, 2, 4 o 5; cucon es texto y los flags ext aceptan 0 o 1.
- contactos es alias de lstContactoCliente. Los contactos omitidos se conservan; [] no elimina contactos existentes.
- La respuesta pública siempre contiene el id y nunca el JSON completo del cliente. La conversión de fechas asume UTC como zona fija de la JVM del ERP.
- No exponga clave_portal ni valores personales en registros, fragmentos de código, claves de caché o métricas.
- Los reintentos automáticos están prohibidos sin idempotencia comprobada.

- `codigo_tributario: 5` significa No aplica ZZZ. Contactos omitidos se conservan; `[]` no elimina contactos. La aceptación de campos no garantiza persistencia de los hallazgos Java pendientes.

### `terceros-actualizar`: Actualizar tercero

**Para qué sirve:** Crea un cliente o proveedor nuevo, o actualiza los datos de uno existente.

**Método:** `PUT`.

**Ruta:** `/api/v1/terceros/{id_tercero}`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Parámetros de ruta**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_tercero` | Sí | Tipo: entero.; mínimo: `1`; no admite null |

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `nombre_cliente` | Sí | Según el esquema publicado por tools/list. |
| `id_tipo_persona` | Sí | Según el esquema publicado por tools/list. |
| `identificacion` | Sí | Según el esquema publicado por tools/list. |
| `id_empresa_portal` | No | Según el esquema publicado por tools/list. |
| `id_usuario_portal` | No | Según el esquema publicado por tools/list. |
| `primer_nombre` | No | Según el esquema publicado por tools/list. |
| `segundo_nombre` | No | Según el esquema publicado por tools/list. |
| `primer_apellido` | No | Según el esquema publicado por tools/list. |
| `segundo_apellido` | No | Según el esquema publicado por tools/list. |
| `direccion` | No | Según el esquema publicado por tools/list. |
| `sitio_web` | No | Según el esquema publicado por tools/list. |
| `facebook` | No | Según el esquema publicado por tools/list. |
| `twitter` | No | Según el esquema publicado por tools/list. |
| `instagram` | No | Según el esquema publicado por tools/list. |
| `snapchat` | No | Según el esquema publicado por tools/list. |
| `puntos_acumulados` | No | Según el esquema publicado por tools/list. |
| `nota` | No | Según el esquema publicado por tools/list. |
| `es_activo` | No | Según el esquema publicado por tools/list. |
| `fecha_registro` | No | Según el esquema publicado por tools/list. |
| `id_lista_precios` | No | Según el esquema publicado por tools/list. |
| `id_ruta_despacho` | No | Según el esquema publicado por tools/list. |
| `es_cliente` | Sí | Según el esquema publicado por tools/list. |
| `es_proveedor` | No | Según el esquema publicado por tools/list. |
| `ciudad` | No | Según el esquema publicado por tools/list. |
| `zona` | No | Según el esquema publicado por tools/list. |
| `contacto` | No | Según el esquema publicado por tools/list. |
| `codigo_interno` | No | Según el esquema publicado por tools/list. |
| `numero_matricula` | No | Según el esquema publicado por tools/list. |
| `id_estado_civil` | No | Según el esquema publicado por tools/list. |
| `id_estrato_social` | No | Según el esquema publicado por tools/list. |
| `id_clase_cliente` | No | Según el esquema publicado por tools/list. |
| `id_tipo_cliente` | No | Según el esquema publicado por tools/list. |
| `fecha_nacimiento` | No | Según el esquema publicado por tools/list. |
| `sexo` | No | Según el esquema publicado por tools/list. |
| `saldo_bono` | No | Según el esquema publicado por tools/list. |
| `permite_cartera_vencida` | No | Según el esquema publicado por tools/list. |
| `id_centro_costo` | No | Según el esquema publicado por tools/list. |
| `permite_saldo_cartera` | No | Según el esquema publicado por tools/list. |
| `cupo_cartera` | No | Según el esquema publicado por tools/list. |
| `permite_cartera` | No | Según el esquema publicado por tools/list. |
| `id_tipo_retencion_ventas` | No | Según el esquema publicado por tools/list. |
| `id_tipo_retencion_compra` | No | Según el esquema publicado por tools/list. |
| `id_sucursal` | No | Según el esquema publicado por tools/list. |
| `id_vendedor` | No | Según el esquema publicado por tools/list. |
| `envioSmsCartera` | No | Según el esquema publicado por tools/list. |
| `envioSmsProducto` | No | Según el esquema publicado por tools/list. |
| `pais` | No | Según el esquema publicado por tools/list. |
| `departamento` | No | Según el esquema publicado por tools/list. |
| `regimen` | No | Según el esquema publicado por tools/list. |
| `id_tipo_identificacion` | No | Según el esquema publicado por tools/list. |
| `medio_pago` | No | Según el esquema publicado por tools/list. |
| `tipoOperacion` | No | Según el esquema publicado por tools/list. |
| `cliente_predeterminado` | No | Según el esquema publicado por tools/list. |
| `legalidad` | No | Según el esquema publicado por tools/list. |
| `regimenImpuesto` | No | Según el esquema publicado por tools/list. |
| `fecha_vencimiento_codigo_turismo` | No | Según el esquema publicado por tools/list. |
| `codigo_turismo` | No | Según el esquema publicado por tools/list. |
| `alias` | No | Según el esquema publicado por tools/list. |
| `horario` | No | Según el esquema publicado por tools/list. |
| `dias_vencimiento_cartera_cliente` | No | Según el esquema publicado por tools/list. |
| `es_consumidor_final` | No | Según el esquema publicado por tools/list. |
| `genera_bonos` | No | Según el esquema publicado por tools/list. |
| `solo_remision2` | No | Según el esquema publicado por tools/list. |
| `tiene_documentos_asocisados` | No | Según el esquema publicado por tools/list. |
| `telefonos` | Sí | Según el esquema publicado por tools/list. |
| `correos` | Sí | Según el esquema publicado por tools/list. |
| `codigo_tributario` | No | Tipo: entero.; valores: `1`, `2`, `4`, `5`; no admite null |
| `cucon` | No | Tipo: texto.; no admite null |
| `es_declarante` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `aplico_retencion_venta` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `aplico_retencion_compra` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `solo_remision3` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `mostrar_precio_venta_orden_compra` | No | Tipo: entero.; valores: `0`, `1`; no admite null |
| `contactos` | No | Tipo: arreglo.; no admite null |
| `lstContactoCliente` | No | Tipo: arreglo.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "id_tercero": 1,
  "body": {
    "nombre_cliente": "Tercero de ejemplo",
    "identificacion": "<id-documento>",
    "id_tipo_persona": 1,
    "es_cliente": 1,
    "es_proveedor": 0,
    "telefonos": [
      "<teléfono>"
    ],
    "correos": [
      "<correo>"
    ]
  }
}
```

**Respuesta esperada:** Mensaje { message: string, type: integer, retorno?: string }.

**Ejemplo de respuesta:**

```json
{
  "message": "save",
  "type": 1,
  "retorno": "<id_generado>"
}
```

**Errores y límites**

- Las operaciones de creación requieren identificación, tipo de persona, condición de cliente o proveedor, un teléfono y un correo.
- Se rechazan los campos desconocidos del cuerpo y las actualizaciones parciales vacías.

**Notas**

- codigo_tributario acepta 1, 2, 4 o 5; cucon es texto y los flags ext aceptan 0 o 1.
- contactos es alias de lstContactoCliente. Los contactos omitidos se conservan; [] no elimina contactos existentes.
- La respuesta pública siempre contiene el id y nunca el JSON completo del cliente. La conversión de fechas asume UTC como zona fija de la JVM del ERP.
- No exponga clave_portal ni valores personales en registros, fragmentos de código, claves de caché o métricas.
- Los reintentos automáticos están prohibidos sin idempotencia comprobada.

- `codigo_tributario: 5` significa No aplica ZZZ. Contactos omitidos se conservan; `[]` no elimina contactos. La aceptación de campos no garantiza persistencia de los hallazgos Java pendientes.

## Impuestos

### `tributario-impuestos-busquedas`: Buscar impuestos

**Para qué sirve:** Buscar impuestos. Su resultado principal es `impuestos`.

**Método:** `POST`.

**Ruta:** `/api/v1/tributario/impuestos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_impuesto` | No | número entero; mínimo `1` |
| `nombre_impuesto` | No | texto; coincidencia parcial |
| `tipo_impuesto` | No | número entero |
| `clasificacion_tributaria` | No | número entero |
| `codigo` | No | texto; coincidencia exacta |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `impuesto`, `contabilidad`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "impuesto",
      "contabilidad"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, impuestos: object[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "impuestos": [
    {
      "impuesto": {
        "id_impuesto": 1,
        "nombre_impuesto": "Impuesto ejemplo",
        "valor_impuesto": 19,
        "tipo_impuesto": "01",
        "clasificacion_tributaria": "Gravado",
        "codigo": "IMP-001",
        "codigo_tipo_impuesto": "01",
        "nombre_codigo_impuesto": "Impuesto ejemplo",
        "pais": "País ejemplo",
        "es_activo": 1,
        "fecha_registro": 1735689600000
      },
      "contabilidad": {
        "id_plan_cuentas_venta": 1,
        "id_plan_cuentas_pasivo": 2,
        "id_plan_cuentas_activo": 3,
        "id_plan_cuentas_compra": 4,
        "id_plan_cuenta_imp_venta_devolucion": 5,
        "id_plan_cuenta_imp_compa_devolucion": 6,
        "id_plan_cuenta_imp_gasto_devolucion": 7,
        "id_plan_cuentas_gasto": 8,
        "id_plan_cuenta_compra_item": 9
      }
    }
  ]
}
```

- Consulta de datos maestros; no se devuelve un total global de páginas.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Impuestos activos.

### `tributario-impuesto-por-id`: Consultar impuesto por ID

**Para qué sirve:** Consultar impuesto por ID.

**Método:** `GET`.

**Ruta:** `/api/v1/tributario/impuestos/{id_impuesto}`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_impuesto` | Sí | número entero; mínimo `1` |

**Ejemplo de argumentos:**

```json
{
  "id_impuesto": 3
}
```

**Respuesta esperada:** Impuesto[].

**Ejemplo de respuesta:**

```json
[
  {
    "id_impuesto": 3,
    "nombre_impuesto": "IVA",
    "valor_impuesto": 19,
    "tipo_impuesto": "porcentaje",
    "clasificacion_tributaria": "gravado"
  }
]
```

- Consulta de datos maestros por identificador; la respuesta es un arreglo.
- id_impuesto debe ser mayor que cero.

**Peticiones habituales:** Impuesto por ID.

## Finanzas y cartera

### `finanzas-bancos-busquedas`: Buscar bancos

**Para qué sirve:** Buscar bancos. Su resultado principal es `bancos`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/bancos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_banco` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `nombre` | No | texto; coincidencia parcial |
| `numero_cuenta` | No | texto; coincidencia parcial |
| `codigo` | No | texto; coincidencia exacta |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `banco`, `sucursal`, `contabilidad`, `configuracion`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "banco",
      "sucursal",
      "contabilidad",
      "configuracion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, bancos: Banco[] }; Banco.config: JsonValue | string | null.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "bancos": [
    {
      "banco": {
        "id_banco": 1,
        "nombre": "Cuenta ejemplo",
        "numero_cuenta": "CUENTA-EJEMPLO",
        "saldo": 100000,
        "descripcion": "Cuenta de ejemplo",
        "es_activo": 1
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal"
      },
      "contabilidad": {
        "id_plan_cuenta": 1,
        "codigo": "11000001"
      },
      "configuracion": {
        "config": "{}"
      }
    }
  ]
}
```

- config se devuelve como arreglo u objeto cuando contiene JSON valido; un valor historico vacio o malformado se conserva como string y null permanece null.
- numero_cuenta y saldo pueden ser datos empresariales sensibles; evite incluirlos en registros y etiquetas de metricas.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Bancos activos.

### `finanzas-medios-pago-busquedas`: Buscar medios de pago

**Para qué sirve:** Buscar medios de pago. Su resultado principal es `medios_pago`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/medios-pago/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_medio_pago` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `nombre_medio_pago` | No | texto; coincidencia parcial |
| `codigo` | No | texto; coincidencia exacta |
| `codigo_pago_fisco` | No | texto; coincidencia exacta |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `medio_pago`, `sucursal`, `configuracion`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "medio_pago",
      "sucursal",
      "configuracion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, medios_pago: MedioPago[] }; MedioPago.config: JsonValue | string | null.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "medios_pago": [
    {
      "medio_pago": {
        "id_medio_pago": 1,
        "nombre_medio_pago": "Medio de pago ejemplo",
        "nota": "Nota de ejemplo",
        "codigo": "MP-001",
        "comision": 0,
        "codigo_pago_fisco": "01",
        "es_activo": 1
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal"
      },
      "configuracion": {
        "config": "{}"
      }
    }
  ]
}
```

- config se devuelve como arreglo u objeto cuando contiene JSON valido; un valor historico vacio o malformado se conserva como string y null permanece null.
- No se asumen propiedades internas adicionales para config.
- Consulta de datos maestros; la cache esta aislada por empresa.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Medios de pago activos con configuracion.

### `finanzas-abonos-crear`: Registrar abono y consultar comprobante

**Para qué sirve:** Aplica un pago a una transacción existente y devuelve el comprobante de caja generado.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/abonos`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_transacion` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_comprobante_caja` | No | Tipo: entero.; mínimo: `1`; no admite null |
| `id_sucursal` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `valor` | Sí | Tipo: número.; no admite null |
| `id_medio_pago` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `fecha_registro` | Sí | Tipo: fecha y hora local (YYYY-MM-DDTHH:mm:ss, sin zona horaria ni epoch).; no admite null |
| `id_banco` | Sí | Tipo: entero.; mínimo: `0`; no admite null |
| `nota` | No | Tipo: texto.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_transacion": 54321,
    "id_sucursal": 1,
    "valor": 50000,
    "id_medio_pago": 1,
    "id_empleado": 1,
    "fecha_registro": "2026-10-05T13:30:00",
    "id_banco": 1,
    "nota": "Abono remisión"
  }
}
```

**Respuesta esperada:** ComprobanteCaja[]; si la consulta falla, Mensaje { type: 1, message: string, retorno: string } confirma el pago y conserva el ID del comprobante..

**Ejemplo de respuesta:**

```json
[
  {
    "id_comprobante_caja": 1542,
    "n_caja": "RV105",
    "valor": 50000,
    "es_activo": 1,
    "fecha_registro": "2026-10-05 13:30:00.0",
    "id_medio_pago": 1,
    "nombre_medio_pago": "Efectivo",
    "id_banco": 1,
    "nombre_banco": "Caja General"
  }
]
```

**Errores y límites**

- El ERP rechaza valores superiores a la deuda, transacciones sin deuda y comprobantes duplicados; el wrapper devuelve erp_mutation_rejected sin detalles internos.
- Si no se puede confirmar la escritura, no repita el POST automáticamente.

**Notas**

- id_transacion es el ID interno de la transacción, no necesariamente el número visible de la remisión.
- id_sucursal es obligatorio dentro del body; el header X-Auth-Token-sucursal no lo sustituye.
- Un abono parcial conserva el saldo pendiente; el pago total depende de la deuda validada por Java.
- La consulta del comprobante conserva la autorización y los headers de empresa, sucursal, empleado y zona horaria; no usa cache.
- Si el comprobante no está disponible, el pago sigue confirmado. Consulte posteriormente el comprobante con el ID de retorno, sin repetir el abono.
- Los IDs de efectivo, caja y empleado corresponden a los catálogos de la empresa; los valores del ejemplo no son universales.

### `finanzas-anticipos-crear`: Registrar anticipo de cliente

**Para qué sirve:** Registra un anticipo recibido del cliente, no un abono vinculado a id_documento.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/anticipos`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_cliente` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_sucursal` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_medio_pago` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_banco` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `valor` | Sí | Tipo: número.; no admite null |
| `es_ingreso` | Sí | Tipo: entero.; valores: `1`; no admite null |
| `nota` | Sí | Tipo: texto.; no admite null; patrón: `\S` |
| `fecha_registro` | Sí | Tipo: fecha y hora local (YYYY-MM-DDTHH:mm:ss, sin zona horaria ni epoch).; no admite null |
| `id_centro_costo` | No | Tipo: entero.; mínimo: `1`; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_cliente": 1234,
    "id_sucursal": 1,
    "id_empleado": 7,
    "id_medio_pago": 1,
    "id_banco": 1,
    "valor": 50000,
    "es_ingreso": 1,
    "nota": "Anticipo de pedido",
    "fecha_registro": "2026-10-19T10:00:00"
  }
}
```

**Respuesta esperada:** { success: boolean, data: object|null, error: object|null, request_id: string }.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "id_comprobante_caja": 15420,
    "comprobante": {
      "id_comprobante_caja": 15420,
      "valor": 50000,
      "id_cliente": 1234,
      "id_sucursal": 1,
      "es_activo": 1
    }
  },
  "error": null,
  "request_id": "0123456789abcdef0123456789abcdef"
}
```

**Errores y límites**

- Los rechazos y errores técnicos usan errores controlados sin detalles internos.
- No se debe repetir una escritura cuyo resultado sea desconocido o ya confirmado.

**Notas**

- Registra un anticipo recibido del cliente, no un abono vinculado a id_documento.
- id_empleado es el ID local del empleado, no id_usuario_portal.
- Tras confirmar el anticipo se consulta su comprobante con las mismas credenciales, sin cache.
- El comprobante puede recuperarse por ID sin repetir el POST.

### `finanzas-anticipos-cliente-sucursal`: Consultar anticipos activos de un cliente y sucursal

**Para qué sirve:** Consulta fresca de anticipos recibidos y activos del cliente y sucursal.

**Método:** `GET`.

**Ruta:** `/api/v1/finanzas/anticipos/clientes/{id_cliente}/sucursales/{id_sucursal}`.

**Tipo:** Consulta.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Parámetros de ruta**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_cliente` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_sucursal` | Sí | Tipo: entero.; mínimo: `1`; no admite null |

**Cuerpo:** sin cuerpo.

**Ejemplo de argumentos:**

```json
{
  "id_cliente": 1234,
  "id_sucursal": 1
}
```

**Respuesta esperada:** { success: boolean, data: { items: AnticipoCliente[] }|null, error: object|null, request_id: string }.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_comprobante_caja": 15420,
        "valor": 50000,
        "valorPagado": null,
        "id_cliente": 1234,
        "id_sucursal": 1,
        "es_activo": 1
      }
    ]
  },
  "error": null,
  "request_id": "0123456789abcdef0123456789abcdef"
}
```

**Errores y límites**

- Los errores técnicos se devuelven como erp_query_failed sin detalles internos.

**Notas**

- Consulta fresca de anticipos recibidos y activos del cliente y sucursal.
- Saldo disponible = valor - COALESCE(valorPagado, 0). La lista no filtra automáticamente todos los saldos agotados.
- No agrega un grupo pagos a la búsqueda de pedidos.

### `finanzas-anticipos-anular`: Anular anticipo de cliente

**Para qué sirve:** Anulación completa del anticipo conforme a las reglas del ERP, incluidos sus cruces existentes.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/anticipos/anulaciones`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_comprobante_caja` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `valor` | Sí | Tipo: número.; no admite null |
| `nota` | Sí | Tipo: texto.; no admite null; patrón: `\S` |
| `fecha_registro` | Sí | Tipo: fecha y hora local (YYYY-MM-DDTHH:mm:ss, sin zona horaria ni epoch).; no admite null |
| `observacion` | No | Tipo: texto.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_comprobante_caja": 15420,
    "id_empleado": 7,
    "valor": 50000,
    "nota": "Anticipo registrado por error",
    "fecha_registro": "2026-10-19T10:00:00"
  }
}
```

**Respuesta esperada:** { success: boolean, data: object|null, error: object|null, request_id: string }.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "id_comprobante_caja": 15420,
    "status": "ANULADO"
  },
  "error": null,
  "request_id": "0123456789abcdef0123456789abcdef"
}
```

**Errores y límites**

- Un anticipo inexistente o ya anulado se devuelve como rechazo controlado, no como una nueva anulación exitosa.

**Notas**

- Anulación completa del anticipo conforme a las reglas del ERP, incluidos sus cruces existentes.
- No crea un nuevo recibo de contrapartida ni expone la opción nativa de retorno a otro banco.
- data.id_comprobante_caja identifica el comprobante solicitado y status=ANULADO confirma la anulación; no se consulta otro recibo.

### `finanzas-abonos-anular`: Anular completamente un abono

**Para qué sirve:** Anular completamente un abono

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/abonos/anulaciones`.

**Tipo:** Mutación: confirma antes de ejecutarla y no reintentes automáticamente.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Campos del cuerpo**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_comprobante_caja` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `id_empleado` | Sí | Tipo: entero.; mínimo: `1`; no admite null |
| `valor` | Sí | Tipo: número.; no admite null |
| `nota` | Sí | Tipo: texto.; no admite null; patrón: `\S` |
| `fecha_registro` | Sí | Tipo: fecha y hora local (YYYY-MM-DDTHH:mm:ss, sin zona horaria ni epoch).; no admite null |
| `observacion` | No | Tipo: texto.; no admite null |

**Cuerpo:** obligatorio.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_comprobante_caja": 1542,
    "id_empleado": 7,
    "valor": 50000,
    "nota": "Abono registrado por error",
    "fecha_registro": "2026-10-19T10:00:00"
  }
}
```

**Respuesta esperada:** { success: boolean, data: object|null, error: object|null, request_id: string }.

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "id_comprobante_caja": 1542,
    "status": "ANULADO"
  },
  "error": null,
  "request_id": "0123456789abcdef0123456789abcdef"
}
```

**Errores y límites**

- Un comprobante inexistente o ya anulado es un rechazo controlado.
- El selector de cruces es interno y no puede suministrarse desde la API pública.

**Notas**

- No permite elegir cruces parciales ni enviar arreglos vacíos al DAO.
- data.id_comprobante_caja conserva el ID solicitado, nunca el retorno nativo que puede ser cero o un valor financiero.

### `finanzas-comprobante-caja-por-id`: Consultar comprobante de caja por ID

**Para qué sirve:** Consulta el comprobante generado por un abono, dentro de la empresa autenticada.

**Método:** `GET`.

**Ruta:** `/api/v1/finanzas/comprobantes-caja/{id_comprobante_caja}`.

**Tipo:** Consulta.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `X-Auth-Token-sucursal` | Sí | Identificador de la sucursal afectada. |
| `X-Id-Empleado` | Sí | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (id_usuario_portal). |
| `X-gtm` | Sí | Zona horaria fija usada para interpretar fechas. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Parámetros de ruta**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_comprobante_caja` | Sí | Tipo: entero.; mínimo: `1`; no admite null |

**Cuerpo:** sin cuerpo.

**Ejemplo de argumentos:**

```json
{
  "id_comprobante_caja": 1542
}
```

**Respuesta esperada:** ComprobanteCaja[].

**Ejemplo de respuesta:**

```json
[
  {
    "id_comprobante_caja": 1542,
    "n_caja": "RV105",
    "valor": 50000,
    "es_activo": 1,
    "fecha_registro": "2026-10-05 13:30:00.0",
    "id_medio_pago": 1,
    "nombre_medio_pago": "Efectivo",
    "id_banco": 1,
    "nombre_banco": "Caja General"
  }
]
```

**Errores y límites**

- Los errores técnicos se devuelven como erp_query_failed sin detalles internos.

**Notas**

- Retorna [] si el ID no existe o no pertenece a la empresa autenticada.
- La consulta es de solo lectura y no se almacena en cache.

### `finanzas-cartera-cobrar-busquedas`: Buscar cuentas por cobrar

**Para qué sirve:** Buscar cuentas por cobrar. Su resultado principal es `cartera`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/cartera/cuentas-por-cobrar/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `vencida` | No | `0`, `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `transaccion`, `fechas`, `sucursal`, `tercero`, `vendedor`, `saldo`, `estado`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "body": {
    "grupos": [
      "transaccion",
      "fechas",
      "sucursal",
      "tercero",
      "vendedor",
      "saldo",
      "estado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, totales: { total_deuda: number, total_abono: number, total_pendiente: number }, cartera: DocumentoCartera[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "totales": {
    "total_deuda": 100,
    "total_abono": 20,
    "total_pendiente": 80
  },
  "cartera": [
    {
      "transaccion": {
        "id_transacion": 1,
        "n_factura": 1,
        "prefijo": "DOC"
      },
      "saldo": {
        "total_factura": 100,
        "total_abono": 20,
        "saldo_pendiente": 80
      },
      "tercero": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "estado": {
        "estado_cartera": "Pendiente",
        "dias_vencidos": 0
      }
    }
  ]
}
```

- Los totales globales abarcan todos los registros filtrados, independientemente de la página actual.
- Se excluyen los documentos anulados, inactivos, con saldos no positivos, de clientes internos y de clientes predeterminados.
- Las respuestas financieras no deben usar la directiva stale-if-error sin una decisión explícita.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Cuentas por cobrar; Cuentas por pagar; Cuentas por cobrar vencidas.

### `finanzas-cartera-pagar-busquedas`: Buscar cuentas por pagar

**Para qué sirve:** Buscar cuentas por pagar. Su resultado principal es `cartera`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/cartera/cuentas-por-pagar/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `vencida` | No | `0`, `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `transaccion`, `fechas`, `sucursal`, `tercero`, `vendedor`, `saldo`, `estado`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "body": {
    "grupos": [
      "transaccion",
      "fechas",
      "sucursal",
      "tercero",
      "vendedor",
      "saldo",
      "estado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, totales: { total_deuda: number, total_abono: number, total_pendiente: number }, cartera: DocumentoCartera[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "totales": {
    "total_deuda": 100,
    "total_abono": 20,
    "total_pendiente": 80
  },
  "cartera": [
    {
      "transaccion": {
        "id_transacion": 1,
        "n_factura": 1,
        "prefijo": "DOC"
      },
      "saldo": {
        "total_factura": 100,
        "total_abono": 20,
        "saldo_pendiente": 80
      },
      "tercero": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "vendedor": {
        "id_vendedor": 1,
        "nombre_vendedor": "Vendedor ejemplo"
      },
      "estado": {
        "estado_cartera": "Pendiente",
        "dias_vencidos": 0
      }
    }
  ]
}
```

- Los totales globales abarcan todos los registros filtrados, independientemente de la página actual.
- Se excluyen los documentos anulados, inactivos, con saldos no positivos, de clientes internos y de clientes predeterminados.
- Las respuestas financieras no deben usar la directiva stale-if-error sin una decisión explícita.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Cuentas por cobrar; Cuentas por pagar; Cuentas por cobrar vencidas.

### `finanzas-resumen-cobrar-busquedas`: Buscar resumen de cuentas por cobrar

**Para qué sirve:** Buscar resumen de cuentas por cobrar. Su resultado principal es `resumen_terceros`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/cartera/cuentas-por-cobrar/resumenes-por-tercero/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `vencida` | No | `0`, `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `tercero`, `documentos`, `saldo`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "body": {
    "grupos": [
      "tercero",
      "documentos",
      "saldo"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, resumen_terceros: SaldoTercero[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "resumen_terceros": [
    {
      "tercero": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "documentos": {
        "total_documentos": 1
      },
      "saldo": {
        "total_deuda": 100,
        "total_abono": 20,
        "saldo_pendiente": 80
      }
    }
  ]
}
```

- Los saldos se calculan como SUM(total_deuda) - SUM(total_abono) sobre el mismo conjunto filtrado.
- Las cuentas por cobrar y por pagar nunca se mezclan.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Resumen de cuentas por cobrar; Resumen de cuentas por pagar.

### `finanzas-resumen-pagar-busquedas`: Buscar resumen de cuentas por pagar

**Para qué sirve:** Buscar resumen de cuentas por pagar. Su resultado principal es `resumen_terceros`.

**Método:** `POST`.

**Ruta:** `/api/v1/finanzas/cartera/cuentas-por-pagar/resumenes-por-tercero/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_transacion` | No | número entero |
| `id_cliente` | No | número entero |
| `id_vendedor` | No | número entero |
| `id_sucursal` | No | número entero |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `vencida` | No | `0`, `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `tercero`, `documentos`, `saldo`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "body": {
    "grupos": [
      "tercero",
      "documentos",
      "saldo"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, resumen_terceros: SaldoTercero[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "resumen_terceros": [
    {
      "tercero": {
        "id_cliente": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_cliente": "Cliente ejemplo"
      },
      "documentos": {
        "total_documentos": 1
      },
      "saldo": {
        "total_deuda": 100,
        "total_abono": 20,
        "saldo_pendiente": 80
      }
    }
  ]
}
```

- Los saldos se calculan como SUM(total_deuda) - SUM(total_abono) sobre el mismo conjunto filtrado.
- Las cuentas por cobrar y por pagar nunca se mezclan.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Resumen de cuentas por cobrar; Resumen de cuentas por pagar.

## Organización

### `organizacion-sucursales-busquedas`: Buscar sucursales

**Para qué sirve:** Buscar sucursales. Su resultado principal es `sucursales`.

**Método:** `POST`.

**Ruta:** `/api/v1/organizacion/sucursales/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `nombre_sucursal` | No | texto; coincidencia parcial |
| `codigo_sucursal` | No | texto; coincidencia exacta |
| `es_bodega` | No | `0`, `1` |
| `id_padre` | No | número entero; mínimo `1` |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `sucursal`, `pos`, `politicas_precios`, `licores`, `moneda`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "sucursal",
      "pos",
      "politicas_precios",
      "licores",
      "moneda"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, sucursales: object[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "sucursales": [
    {
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal",
        "nota": "Nota de ejemplo",
        "codigo_sucursal": "SUC-001",
        "es_bodega": 0,
        "id_padre": 0,
        "es_activo": 1,
        "fecha_registro": 1735689600000
      },
      "pos": {
        "vender_con_impuestos": 1,
        "numero_mesas": 0,
        "digitos_decimales": 2,
        "reondeoTotales": 1
      },
      "politicas_precios": {
        "modificicar_precio_minimos_otras_sucursales": 0,
        "modificicar_descuento_maximo_otras_sucursales": 0,
        "actualizarPrecioVentaSucursales": 1,
        "actualizarPrecioCostoSucursales": 1
      },
      "licores": {
        "activar_venta_compra_licores": 0,
        "vender_ip_estampilla": 0
      },
      "moneda": {
        "id_moneda": 1,
        "simbolo_moneda": "$"
      }
    }
  ]
}
```

- Los nombres reondeoTotales, modificicar_precio_minimos_otras_sucursales y modificicar_descuento_maximo_otras_sucursales se conservan literalmente por compatibilidad con la base de datos.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- Los resultados de sucursales permanecen aislados por empresa.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Sucursales activas con configuracion comercial.

### `organizacion-empleados-busquedas`: Buscar empleados

**Para qué sirve:** Buscar empleados. Su resultado principal es `empleados`.

**Método:** `POST`.

**Ruta:** `/api/v1/organizacion/empleados/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_empleado` | No | número entero; mínimo `1` |
| `identificacion` | No | texto |
| `nombre` | No | texto; coincidencia parcial |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_usuario` | No | número entero |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

Para `grupos`:
- `empleado`: Empleado asociado al comentario o a la operación. Incluye `id_empleado`, `identificacion`, `nombre_completo`, `codigo_empleado`, `tipo_usuario`, `es_activo`, `fecha_registro`, `id_usuario_portal`.
  - `id_empleado`: Identificador interno del empleado.
  - `identificacion`: Documento de identificación del empleado.
  - `nombre_completo`: Nombre completo para visualización.
  - `codigo_empleado`: Código interno del empleado.
  - `tipo_usuario`: Rol o tipo de usuario; validar catálogo de seguridad.
  - `es_activo`: Estado operativo.
  - `fecha_registro`: Momento de creación.
  - `id_usuario_portal`: Usuario de portal vinculado.
- `sucursal`: Sucursal donde se originó o aplica la operación. Incluye `id_sucursal`, `nombre_sucursal`, `id_bodega`, `nombre_bodega`, `sucursales_adicionales`, `vendedor_multi_sucursal`, `solo_bodegas_sucursal`.
  - `id_sucursal`: Sucursal principal.
  - `nombre_sucursal`: Nombre visible de la sucursal.
  - `id_bodega`: Bodega predeterminada.
  - `nombre_bodega`: Campo `nombre_bodega`; confirma su significado funcional antes de interpretarlo.
  - `sucursales_adicionales`: Campo `sucursales_adicionales`; confirma su significado funcional antes de interpretarlo.
  - `vendedor_multi_sucursal`: Habilita operación comercial en varias sucursales.
  - `solo_bodegas_sucursal`: Restringe las bodegas a las de su sucursal.
- `consecutivo`: Configuración de numeración usada por el documento. Incluye `id_consecutivo`, `nombre_consecutivo`, `prefijo_consecutivo`.
  - `id_consecutivo`: Consecutivo predeterminado.
  - `nombre_consecutivo`: Campo `nombre_consecutivo`; confirma su significado funcional antes de interpretarlo.
  - `prefijo_consecutivo`: Campo `prefijo_consecutivo`; confirma su significado funcional antes de interpretarlo.
- `precios`: Precios base, de venta y ajustes comerciales. Incluye `id_lista_precios`, `nombre_lista_precios`.
  - `id_lista_precios`: Lista de precios predeterminada.
  - `nombre_lista_precios`: Campo `nombre_lista_precios`; confirma su significado funcional antes de interpretarlo.
- `comision`: Comisión asignada al empleado. Incluye `comision`, `tipo_comision`, `comision_antes_iva`.
  - `comision`: Comisión asignada al empleado.
  - `tipo_comision`: Forma de cálculo de la comisión.
  - `comision_antes_iva`: Indica si la comisión se calcula antes del IVA.
- `permisos_caja`: Reglas de apertura, cierre y operación de la caja del empleado. Incluye `modePosDefecto`, `cierra_caja`, `obligar_apertura_caja`, `cerrar_session_cierre`, `ventas_solo_credito`.
  - `modePosDefecto`: Modo POS predeterminado.
  - `cierra_caja`: Autoriza o configura el cierre de caja.
  - `obligar_apertura_caja`: Exige apertura de caja antes de operar.
  - `cerrar_session_cierre`: Controla el cierre de sesión durante un cierre.
  - `ventas_solo_credito`: Restringe ventas a modalidad crédito.
- `restaurante`: Permisos y configuración del empleado para mesas. Incluye `mostrar_mesa`.
  - `mostrar_mesa`: Habilita la visualización o selección de mesas.
- `roles`: Indicadores de rol y capacidades operativas del empleado. Incluye `es_contador`, `es_tienda`, `sincroniazar_datos`.
  - `es_contador`: Marca al empleado como contador.
  - `es_tienda`: Clasifica al usuario para operación de tienda.
  - `sincroniazar_datos`: Control de sincronización.
- `horario`: Horario asociado al tercero; la estructura depende del dato almacenado. Incluye `horario_ingreso_cuenti`, `horario_salida_cuenti`, `config_horario`.
  - `horario_ingreso_cuenti`: Campo `horario_ingreso_cuenti`; confirma su significado funcional antes de interpretarlo.
  - `horario_salida_cuenti`: Campo `horario_salida_cuenti`; confirma su significado funcional antes de interpretarlo.
  - `config_horario`: Campo `config_horario`; confirma su significado funcional antes de interpretarlo.
- `app_movil`: Permisos de acceso del empleado a las aplicaciones móviles. Incluye `puede_ingresar_app_nube`, `pueden_ingresar_app_local`.
  - `puede_ingresar_app_nube`: Campo `puede_ingresar_app_nube`; confirma su significado funcional antes de interpretarlo.
  - `pueden_ingresar_app_local`: Campo `pueden_ingresar_app_local`; confirma su significado funcional antes de interpretarlo.
- `ventas_ext`: Configuración extendida para la operación de ventas. Incluye `mostrar_vendedor_ventas`, `vendedor_multi_sucursal_ext`, `impresora_factura`.
  - `mostrar_vendedor_ventas`: Campo `mostrar_vendedor_ventas`; confirma su significado funcional antes de interpretarlo.
  - `vendedor_multi_sucursal_ext`: Campo `vendedor_multi_sucursal_ext`; confirma su significado funcional antes de interpretarlo.
  - `impresora_factura`: Campo `impresora_factura`; confirma su significado funcional antes de interpretarlo.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "grupos": [
      "empleado",
      "sucursal",
      "consecutivo",
      "precios",
      "comision",
      "permisos_caja",
      "restaurante",
      "roles",
      "horario",
      "app_movil",
      "ventas_ext"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, empleados: Empleado[] }; Empleado.sucursal_adicional: JsonValue | string | null.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "empleados": [
    {
      "empleado": {
        "id_empleado": 1,
        "identificacion": "DOCUMENTO-EJEMPLO",
        "nombre_completo": "Empleado ejemplo",
        "codigo_empleado": "EMP-001",
        "tipo_usuario": 1,
        "es_activo": 1,
        "fecha_registro": 1735689600000,
        "id_usuario_portal": 1
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal",
        "id_bodega": 1,
        "nombre_bodega": "Bodega principal",
        "sucursales_adicionales": [
          1
        ],
        "vendedor_multi_sucursal": 0,
        "solo_bodegas_sucursal": 1
      },
      "consecutivo": {
        "id_consecutivo": 1,
        "nombre_consecutivo": "Consecutivo ejemplo",
        "prefijo_consecutivo": "DOC"
      },
      "precios": {
        "id_lista_precios": 1,
        "nombre_lista_precios": "Lista general"
      },
      "comision": {
        "comision": 2,
        "tipo_comision": 1,
        "comision_antes_iva": 0
      },
      "permisos_caja": {
        "modePosDefecto": 1,
        "cierra_caja": 1,
        "obligar_apertura_caja": 1,
        "cerrar_session_cierre": 0,
        "ventas_solo_credito": 0
      },
      "restaurante": {
        "mostrar_mesa": 0
      },
      "roles": {
        "es_contador": 0,
        "es_tienda": 1,
        "sincroniazar_datos": 1
      },
      "horario": {
        "horario_ingreso_cuenti": 1735689600000,
        "horario_salida_cuenti": 1735722000000,
        "config_horario": "{}"
      },
      "app_movil": {
        "puede_ingresar_app_nube": 1,
        "pueden_ingresar_app_local": 1
      },
      "ventas_ext": {
        "mostrar_vendedor_ventas": 1,
        "vendedor_multi_sucursal_ext": 0,
        "impresora_factura": "Impresora ejemplo"
      }
    }
  ]
}
```

- nombre aplica una búsqueda parcial (LIKE %...%).
- id_sucursal es opcional; si se omite, se usa X-Auth-Token-sucursal.
- sucursal_adicional se devuelve como arreglo u objeto cuando contiene JSON válido; un valor histórico vacío o malformado se conserva como string y null permanece null.
- No se asumen propiedades internas adicionales para este campo.
- Los nombres y valores de identificación de empleados no deben convertirse en etiquetas de métricas ni aparecer como texto sin procesar en claves de caché.
- segunda_clave y clave_caja están deshabilitados en el backend y no son columnas consultables.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Empleados activos.

## Facturación

### `facturacion-consecutivos-busquedas`: Buscar consecutivos de documentos

**Para qué sirve:** Buscar consecutivos de documentos. Su resultado principal es `consecutivos`.

**Método:** `POST`.

**Ruta:** `/api/v1/facturacion/consecutivos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_consecutivo` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `nombre_consecutivo` | No | texto; coincidencia parcial |
| `prefijo` | No | texto; coincidencia exacta |
| `resolucion` | No | texto; coincidencia parcial |
| `tipo_consecutivo` | No | número entero |
| `es_factura_electronica` | No | `0`, `1` |
| `es_activo` | No | `0`, `1`; valor habitual `1` |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `consecutivo`, `factura_electronica`, `rangos`, `sucursal`, `configuracion`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "body": {
    "grupos": [
      "consecutivo",
      "factura_electronica",
      "rangos",
      "sucursal",
      "configuracion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, consecutivos: object[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 1,
  "consecutivos": [
    {
      "consecutivo": {
        "id_consecutivo": 1,
        "nombre_consecutivo": "Consecutivo ejemplo",
        "prefijo": "DOC",
        "numero": 1,
        "resolucion": "RESOLUCION-EJEMPLO",
        "tipo_consecutivo": 1,
        "es_activo": 1,
        "fecha_registro": 1735689600000
      },
      "factura_electronica": {
        "es_factura_electronica": 1,
        "technicalKey2": "CLAVE-EJEMPLO",
        "facturaOnline": 1,
        "es_contingencia": 0
      },
      "rangos": {
        "inicia": 1,
        "finaliza": 1000,
        "fecha_vencimiento": 1767225600000,
        "alertar_numero": 900,
        "nRelleno": 4,
        "es_tirilla_pos": 0
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal",
        "predeterminado": 1
      },
      "configuracion": {
        "multi_moneda": 0
      }
    }
  ]
}
```

- Este punto de acceso consulta la configuracion de consecutivos; no reserva ni incrementa numeros.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- technicalKey2, registrarEmpleados e id_empleado se omiten porque la auditoria del ERP los marco como columnas no disponibles; los grupos factura_electronica y configuracion del backend actual requieren validacion antes de usarse.
- segunda_clave y clave_caja estan deshabilitados en el backend y no son columnas consultables.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Consecutivos activos.

## Restaurante

### `restaurante-comandas-busquedas`: Obtener comandas de cocina

**Para qué sirve:** Consulta las comandas que están siendo atendidas por la cocina.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas/busquedas`.

**Tipo:** Consulta.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | Tipo: entero.; mínimo: `0`; valor habitual: `0`; no admite null |
| `cantidad_registros` | No | Tipo: entero.; mínimo: `1`; máximo: `1000`; valor habitual: `30`; no admite null |
| `id_sucursal` | No | Tipo: entero.; mínimo: `1`; valor habitual: `1`; no admite null |
| `id_transacion` | No | Tipo: entero.; no admite null |
| `numero_mesa` | No | Tipo: entero.; no admite null |
| `estado` | No | Tipo: entero.; no admite null |
| `id_cocina` | No | Tipo: entero.; no admite null |
| `id_empleado` | No | Tipo: entero.; no admite null |
| `fecha_desde` | No | Tipo: milisegundos desde epoch.; no admite null |
| `fecha_hasta` | No | Tipo: milisegundos desde epoch.; no admite null |

**Cuerpo:** opcional.

**Bloques de información que puedes pedir**

- `codigos`: Identificadores y números que permiten localizar el registro. Incluye `id_transacion_mesa`, `id_transacion`.
- `sucursal`: Sucursal donde se originó o aplica la operación. Incluye `id_sucursal`.
- `mesa`: Identificación de la mesa y datos de sus comensales. Incluye `numero_mesa`, `nombre_mesa`, `comensales`, `turno`.
- `producto`: Identificación, descripción y presentación del producto. Incluye `id_producto`, `nombre`, `cantidad`, `precio`, `nota`, `formato_presentacion`, `configuracion_plato`.
- `empleado`: Empleado que registró o gestionó la operación. Incluye `id_empleado`, `nombre_empleado`.
- `fecha`: Fecha de registro del evento operativo. Incluye `fecha_registro`.
- `estado`: Indicadores del estado operativo, financiero o documental. Incluye `estado`, `es_activo`, `id_cocina`.
- `preparacion`: Tiempos y estación de preparación de la comanda. Incluye `tiempo_preparacion_producto`, `tiempo_preparacion_plato`, `tiempo_entrega`.
- `pedido`: Referencias del pedido en línea y sus órdenes. Incluye `es_pedido_linea`, `id_pedido_linea`, `numero_orden`, `numero_orden2`.
- `impresion`: Configuración de plantillas, contenido y opciones de impresión. Incluye `impreso`, `imprimio_prefactura`, `marca`, `observacion`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "id_sucursal": 1,
  "body": {
    "grupos": [
      "codigos",
      "sucursal",
      "mesa",
      "producto",
      "empleado",
      "fecha",
      "estado",
      "preparacion",
      "pedido",
      "impresion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, comandas: ComandaCocina[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "comandas": [
    {
      "codigos": {
        "id_transacion_mesa": 1,
        "id_transacion": 1
      },
      "sucursal": {
        "id_sucursal": 1
      },
      "mesa": {
        "numero_mesa": 1,
        "nombre_mesa": "Mesa ejemplo",
        "comensales": 2,
        "turno": 1
      },
      "producto": {
        "id_producto": 25,
        "nombre": "Producto ejemplo",
        "cantidad": 1,
        "precio": 10000,
        "nota": "Sin modificaciones",
        "formato_presentacion": "Unidad",
        "configuracion_plato": "{}"
      },
      "empleado": {
        "id_empleado": 1,
        "nombre_empleado": "Empleado ejemplo"
      },
      "fecha": {
        "fecha_registro": 1735689600000
      },
      "estado": {
        "estado": 1,
        "es_activo": 1,
        "id_cocina": 1
      },
      "preparacion": {
        "tiempo_preparacion_producto": 10,
        "tiempo_preparacion_plato": 15,
        "tiempo_entrega": 20
      },
      "pedido": {
        "es_pedido_linea": 0,
        "id_pedido_linea": null,
        "numero_orden": 1,
        "numero_orden2": 1
      },
      "impresion": {
        "impreso": 0,
        "imprimio_prefactura": 0,
        "marca": "",
        "observacion": ""
      }
    }
  ]
}
```

**Errores y límites**

- id_sucursal debe ser positivo; si se omite se utiliza 1.
- Si se envía grupos, debe contener valores únicos del catálogo y no estar vacío.

**Notas**

- Consulta table-transactions-sync; no se envía a Java.
- El cuerpo vacío o {} solicita todos los grupos. Los filtros de fecha son epoch-ms.
- No requiere headers de empleado, sucursal ni zona horaria; la sucursal se selecciona en query.

### `restaurante-platos-eliminados-busquedas`: Buscar platos eliminados

**Para qué sirve:** Consulta el historial de productos retirados de las mesas.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas/platos-eliminados/busquedas`.

**Tipo:** Consulta.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Content-Type` | Sí | Tipo de contenido del cuerpo JSON. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | Tipo: entero.; mínimo: `0`; valor habitual: `0`; no admite null |
| `cantidad_registros` | No | Tipo: entero.; mínimo: `1`; máximo: `1000`; valor habitual: `30`; no admite null |
| `id_sucursal` | No | Tipo: entero.; mínimo: `1`; valor habitual: `1`; no admite null |
| `id_empleado` | No | Tipo: entero.; no admite null |
| `mesa` | No | Tipo: entero.; no admite null |
| `fecha_desde` | No | Tipo: milisegundos desde epoch.; no admite null |
| `fecha_hasta` | No | Tipo: milisegundos desde epoch.; no admite null |

**Cuerpo:** opcional.

**Bloques de información que puedes pedir**

- `codigos`: Identificadores y números que permiten localizar el registro. Incluye `id_auditoria`.
- `fecha`: Fecha de registro del evento operativo. Incluye `fecha_registro`.
- `sucursal`: Sucursal donde se originó o aplica la operación. Incluye `id_sucursal`, `nombre_sucursal`.
- `empleado`: Empleado que registró o gestionó la operación. Incluye `id_empleado`, `nombre_empleado`.
- `producto`: Identificación, descripción y presentación del producto. Incluye `nombre_producto`, `cantidad`.
- `mesa`: Identificación de la mesa y datos de sus comensales. Incluye `mesa`, `nombre_mesa`.
- `eliminacion`: Motivo y datos registrados al eliminar el plato. Incluye `nota`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "id_sucursal": 1,
  "body": {
    "grupos": [
      "codigos",
      "fecha",
      "sucursal",
      "empleado",
      "producto",
      "mesa",
      "eliminacion"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, platos_eliminados: AuditoriaPlatoEliminado[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "platos_eliminados": [
    {
      "codigos": {
        "id_auditoria": 1
      },
      "fecha": {
        "fecha_registro": 1735689600000
      },
      "sucursal": {
        "id_sucursal": 1,
        "nombre_sucursal": "Sucursal principal"
      },
      "empleado": {
        "id_empleado": 1,
        "nombre_empleado": "Empleado ejemplo"
      },
      "producto": {
        "nombre_producto": "Producto ejemplo",
        "cantidad": 1
      },
      "mesa": {
        "mesa": 1,
        "nombre_mesa": "Mesa ejemplo"
      },
      "eliminacion": {
        "nota": "Motivo de ejemplo"
      }
    }
  ]
}
```

**Errores y límites**

- id_sucursal debe ser positivo; si se omite se utiliza 1.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.
- grupos no debe estar vacío y debe contener valores únicos.

**Notas**

- Consulta table-transactions-sync; no se envía a Java.
- El cuerpo vacío o {} solicita todos los grupos. El grupo de eliminación se llama eliminacion.
- No requiere headers de empleado, sucursal ni zona horaria; la sucursal se selecciona en query.

### `restaurante-mesas-ocupadas`: Consultar mesas ocupadas

**Para qué sirve:** Lista las mesas con comandas abiertas de una sucursal.

**Método:** `GET`.

**Ruta:** `/api/v1/restaurante/mesas-ocupadas`.

**Tipo:** Consulta.

**Encabezados del REST público**

| Encabezado | Obligatorio | Uso |
| --- | --- | --- |
| `Authorization` | Sí | Token de acceso con un único prefijo Bearer. |
| `X-Auth-Token-empresa` | Sí | Identificador de la empresa. |

En MCP, las credenciales pertenecen al contexto seguro de conexión, no a los argumentos.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_sucursal` | No | Tipo: entero.; mínimo: `1`; valor habitual: `1`; no admite null |

**Cuerpo:** sin cuerpo.

**Ejemplo de argumentos:**

```json
{
  "id_sucursal": 1
}
```

**Respuesta esperada:** JSON de mesas ocupadas agrupadas, sin transformación.

**Ejemplo de respuesta:**

```json
[]
```

**Errores y límites**

- id_sucursal debe ser positivo; si se omite se utiliza 1.

**Notas**

- Consulta table-transactions-sync sin cache para obtener el estado actual de las mesas.
- Incluye cantidad de platos, total de cuenta y mesero según la respuesta del servicio.

### `restaurante-comandas-crear`: Crear comanda de restaurante

**Para qué sirve:** Registra una comanda en la API central de sincronización para cocina y POS.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas` a través del gateway Cuenti.

**Tipo:** Mutación idempotente; requiere confirmación explícita.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `confirmation` | No | string; valor habitual `confirm:restaurante-comandas-crear` | Inclúyelo únicamente después de la aprobación explícita del usuario. |
| `numero_mesa` | No | entero o null; valor habitual `null para domicilio o para llevar` | Mesa física del restaurante. Si es null, domicilio se normaliza a 1. |
| `domicilio` | No | entero 0 o 1; valor habitual `0` | Indica si el pedido es de domicilio. La API usa 0 si se omite. |
| `id_sucursal` | No | entero positivo; valor habitual `1` | Sucursal o restaurante que origina la comanda. La API usa 1 si se omite. |
| `id_empleado` | No | entero positivo; valor habitual `1` | Empleado o agente responsable, si el flujo lo conoce. |
| `comensales` | No | entero positivo; valor habitual `1` | Cantidad de personas en la mesa. |
| `gui_pedido` | No | UUID; valor habitual `se genera si falta` | Identificador de la orden que agrupa sus platos. |
| `platos` | Sí | lista de objetos; valor habitual `mínimo 1 elemento` | Platos recibidos del cliente con sus datos de negocio. |

**Respuesta esperada:** Confirmación con `inserted_count`.

**Contrato REST mínimo:**

Los clientes REST deben enviar únicamente los datos de negocio, incluidos `gui_pedido` y `sync_uuid`. La API completa los campos técnicos, de auditoría y compatibilidad; el MCP genera los UUIDs si recibe una entrada sin ellos.

**Ejemplo REST:**

```json
{
  "items": [
    {
      "sync_uuid": "6a5e5f6a-1d5c-4f43-bf55-0c8f94c00b01",
      "gui_pedido": "e4c6a3e8-7d8b-4c2e-8c3b-3e0b5a7c6d11",
      "numero_mesa": 10,
      "id_producto": "burger-1",
      "nombre": "Hamburguesa",
      "precio": 25000,
      "cantidad": 1,
      "nota": "Sin cebolla"
    }
  ]
}
```

**Respuesta REST:** { inserted_count: integer }

**Campos que autocompleta la API:**

| Campo | Valor predeterminado | Significado |
| --- | --- | --- |
| `estado` | 1 | Estado inicial. |
| `es_activo` | 1 | Activo por defecto. |
| `impreso` | 1 | Compatibilidad con impresión local. |
| `tiempo_preparacion_plato` | -1 | Valor técnico de compatibilidad. |
| `tiempo_entrega` | -1 | Valor técnico de compatibilidad. |
| `tiempo_preparacion_producto` | 0 | Valor técnico de compatibilidad. |
| `id_transacion_mesa` | 0 | Compatibilidad con SQLite local. |
| `es_mysql` | 0 | Compatibilidad histórica. |
| `es_nube` | 0 | Compatibilidad histórica. |
| `id_lista_precio_global` | -1 | Sin lista especial. |
| `id_lista_precio` | -1 | Sin lista especial. |
| `gtm` | GMT-0500 | Zona horaria del registro. |
| `fecha_registro` | timestamp actual en milisegundos | Fecha de registro asignada por la API. |
| `pago_realizado` | 0 | El pedido nace como no pagado. |
| `domicilio` | 0 | Valor predeterminado para consumo en local. |
| `comensales` | 1 | Valor predeterminado. |
| `id_empleado` | 1 | Valor predeterminado. |
| `id_empleado_fijo` | 1 | Valor técnico predeterminado. |
| `id_empleado_comanda` | 1 | Valor técnico predeterminado. |
| `id_sucursal` | 1 | Valor predeterminado. |
| `marca` | idEmpresa-idSucursal-guiPedido | Marca interna generada por la API. |

- Los clientes REST deben enviar únicamente los datos de negocio del ejemplo mínimo; no deben construir campos técnicos o de compatibilidad.
- `sync_uuid` identifica cada plato y `gui_pedido` agrupa los platos de una misma orden. Los clientes REST deben enviarlos; MCP los genera si faltan.
- Para domicilio o para llevar, envía `numero_mesa: null` y `domicilio: 1`.
- Los datos comerciales del plato se confían al cliente de sincronización y no se consultan contra el ERP.
- No repitas manualmente la tool si la respuesta es incierta; la operación conserva sus UUIDs durante el reintento.
- La ruta pública se alcanza a través de NGINX y se traduce internamente al servicio de sincronización.
- La operación no utiliza cache porque modifica datos.

**Antes de ejecutarla:** explica el destino y pide confirmación. Después incluye `confirmation=confirm:restaurante-comandas-crear` en los argumentos.
