# Catálogo funcional de Cuenti MCP

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
- Las fechas en milisegundos Unix son números como `1722470400000`.

## Herramientas por necesidad

| Necesidad | Herramientas |
| --- | --- |
| Transacciones | `ventas-facturas-busquedas`, `ventas-planes-separe-busquedas`, `ventas-otros-ingresos-busquedas`, `ventas-compras-gastos-busquedas`, `ventas-remisiones-busquedas`, `ventas-facturas`, `ventas-compras-gastos`, `ventas-remisiones`, `ventas-productos-comprados-busquedas`, `ventas-descuentos-busquedas`, `ventas-consolidados-busquedas` |
| Otros documentos | `operativas-pedidos-busquedas`, `operativas-cotizaciones-busquedas`, `operativas-despachos-busquedas`, `operativas-productos-busquedas`, `operativas-descuentos-busquedas`, `operativas-consolidados-busquedas` |
| Catálogo | `catalogo-productos-busquedas`, `catalogo-categorias-busquedas`, `catalogo-productos-impuestos-licores`, `catalogo-marcas`, `catalogo-marca-por-id` |
| Inventario | `inventario-conteos` |
| Terceros | `terceros-busquedas`, `terceros-crear`, `terceros-actualizar` |
| Impuestos | `tributario-impuestos-busquedas`, `tributario-impuesto-por-id` |
| Finanzas y cartera | `finanzas-bancos-busquedas`, `finanzas-medios-pago-busquedas`, `finanzas-cartera-cobrar-busquedas`, `finanzas-cartera-pagar-busquedas`, `finanzas-resumen-cobrar-busquedas`, `finanzas-resumen-pagar-busquedas` |
| Organización | `organizacion-sucursales-busquedas`, `organizacion-empleados-busquedas` |
| Facturación | `facturacion-consecutivos-busquedas` |
| Restaurante | `restaurante-comandas-busquedas`, `restaurante-platos-eliminados-busquedas` |
| Restaurante | `restaurante-comandas-crear` |

## Transacciones

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
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`, `ruta_despacho`.
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
      "ruta_despacho"
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

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }.

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
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

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
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`, `ruta_despacho`.
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
      "ruta_despacho"
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

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }.

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
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

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
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`, `ruta_despacho`.
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
      "ruta_despacho"
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

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }.

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
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

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
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`, `ruta_despacho`.
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
      "ruta_despacho"
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

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }.

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
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

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
| `es_nula` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`, `ruta_despacho`.
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
      "ruta_despacho"
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

**Respuesta esperada:** { pagina: integer, transacciones: Transaccion[] }.

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
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-facturas`: Crear factura

**Para qué sirve:** Crear factura.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/facturas`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `type_match_producto` | Sí | `1`, `2`, `3`; valor habitual `1` | 1 ID de producto, 2 SKU, 3 código de barras. |
| `id_consecutivo` | Sí | número entero; mínimo `1` | Consecutivo con el que se registra el documento. |
| `codigo_unico` | Sí | texto; Conserva ceros iniciales y no se normaliza. | Código numérico de 1 a 50 dígitos, sin normalizar. |
| `nota` | Sí | texto | Nota general del documento. |
| `observacion` | Sí | texto | Observación general del documento. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal del documento. |
| `id_bodega` | Sí | número entero; mínimo `1` | Bodega; debe coincidir con id_sucursal. |
| `id_vendedor` | Sí | número entero; mínimo `1` | Vendedor asociado al documento. |
| `id_empleado` | Sí | número entero; mínimo `1` | Empleado que registra el documento. |
| `fecha_registro` | No | fecha y hora en milisegundos Unix | Fecha de creación del tercero. |
| `fecha_vencimiento` | No | fecha y hora en milisegundos Unix | Fecha límite de pago o vencimiento de la autorización. |
| `id_centro_costo` | No | número entero; mínimo `1` | Centro de costo predeterminado para operaciones del tercero. |
| `objClienteMini` | Sí | object | Datos mínimos obligatorios del tercero. |
| `objDetalle` | Sí | array | Líneas del documento; total es el total de cada línea. |
| `lstPagos` | Sí | array | Pagos del documento; arreglo vacío indica crédito. |
| `impuestos` | No | object | Impuestos de la línea; si se incluye debe ser completo. |

- Una solicitud contiene un solo documento.
- route-fixed-selector 1 es factura, 7 es compra o gasto y 9 es remisión o prefactura.
- objDetalle.total es el total de la línea; Cuenti registra internamente el precio unitario.
- cambiar_precio_compra=true actualiza el costo unitario y false conserva el costo actual.
- type_match_producto=1 usa id_producto, 2 usa code como SKU y 3 usa code como código de barras.
- Para gasto, route-fixed-selector=7, type_match_producto usa 1 por defecto, cada detalle usa id_plan_cuentas y el documento exige id_centro_costo.

**Ejemplo de argumentos:**

```json
{
  "body": {
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
        "cantidad": 1,
        "descripcion": "Producto",
        "total": 10000,
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

- lstPagos vacío representa una operación a crédito.
- Los campos sin información de objClienteMini se envían como string vacío.
- La respuesta exitosa incluye siempre id_transacion, url_interna y url_externa.
- codigo_unico debe ser un string de 1 a 50 dígitos y conserva ceros iniciales.
- No mezcle detalles de inventario y gasto en el mismo documento.
- retorno es opaco y no debe analizarse.
- No se reintentan automáticamente documentos sin idempotencia comprobada.

**Peticiones habituales:** Factura de inventario.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

### `ventas-compras-gastos`: Crear compra/gasto

**Para qué sirve:** Crear compra/gasto.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/compras-gastos`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `type_match_producto` | Sí | `1`, `2`, `3`; valor habitual `1` | 1 ID de producto, 2 SKU, 3 código de barras. |
| `id_consecutivo` | Sí | número entero; mínimo `1` | Consecutivo con el que se registra el documento. |
| `codigo_unico` | Sí | texto; Conserva ceros iniciales y no se normaliza. | Código numérico de 1 a 50 dígitos, sin normalizar. |
| `nota` | Sí | texto | Nota general del documento. |
| `observacion` | Sí | texto | Observación general del documento. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal del documento. |
| `id_bodega` | Sí | número entero; mínimo `1` | Bodega; debe coincidir con id_sucursal. |
| `id_vendedor` | Sí | número entero; mínimo `1` | Vendedor asociado al documento. |
| `id_empleado` | Sí | número entero; mínimo `1` | Empleado que registra el documento. |
| `fecha_registro` | No | fecha y hora en milisegundos Unix | Fecha de creación del tercero. |
| `fecha_vencimiento` | No | fecha y hora en milisegundos Unix | Fecha límite de pago o vencimiento de la autorización. |
| `id_centro_costo` | No | número entero; mínimo `1` | Centro de costo predeterminado para operaciones del tercero. |
| `objClienteMini` | Sí | object | Datos mínimos obligatorios del tercero. |
| `objDetalle` | Sí | array | Líneas del documento; total es el total de cada línea. |
| `lstPagos` | Sí | array | Pagos del documento; arreglo vacío indica crédito. |
| `impuestos` | No | object | Impuestos de la línea; si se incluye debe ser completo. |

- Una solicitud contiene un solo documento.
- route-fixed-selector 1 es factura, 7 es compra o gasto y 9 es remisión o prefactura.
- objDetalle.total es el total de la línea; Cuenti registra internamente el precio unitario.
- cambiar_precio_compra=true actualiza el costo unitario y false conserva el costo actual.
- type_match_producto=1 usa id_producto, 2 usa code como SKU y 3 usa code como código de barras.
- Para gasto, route-fixed-selector=7, type_match_producto usa 1 por defecto, cada detalle usa id_plan_cuentas y el documento exige id_centro_costo.

**Ejemplo de argumentos:**

```json
{
  "body": {
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
        "cantidad": 1,
        "descripcion": "Producto",
        "total": 10000,
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

- lstPagos vacío representa una operación a crédito.
- Los campos sin información de objClienteMini se envían como string vacío.
- La respuesta exitosa incluye siempre id_transacion, url_interna y url_externa.
- codigo_unico debe ser un string de 1 a 50 dígitos y conserva ceros iniciales.
- No mezcle detalles de inventario y gasto en el mismo documento.
- retorno es opaco y no debe analizarse.
- No se reintentan automáticamente documentos sin idempotencia comprobada.

**Peticiones habituales:** Factura de inventario.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

### `ventas-remisiones`: Crear remisión

**Para qué sirve:** Crear remisión.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/remisiones`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `type_match_producto` | Sí | `1`, `2`, `3`; valor habitual `1` | 1 ID de producto, 2 SKU, 3 código de barras. |
| `id_consecutivo` | Sí | número entero; mínimo `1` | Consecutivo con el que se registra el documento. |
| `codigo_unico` | Sí | texto; Conserva ceros iniciales y no se normaliza. | Código numérico de 1 a 50 dígitos, sin normalizar. |
| `nota` | Sí | texto | Nota general del documento. |
| `observacion` | Sí | texto | Observación general del documento. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal del documento. |
| `id_bodega` | Sí | número entero; mínimo `1` | Bodega; debe coincidir con id_sucursal. |
| `id_vendedor` | Sí | número entero; mínimo `1` | Vendedor asociado al documento. |
| `id_empleado` | Sí | número entero; mínimo `1` | Empleado que registra el documento. |
| `fecha_registro` | No | fecha y hora en milisegundos Unix | Fecha de creación del tercero. |
| `fecha_vencimiento` | No | fecha y hora en milisegundos Unix | Fecha límite de pago o vencimiento de la autorización. |
| `id_centro_costo` | No | número entero; mínimo `1` | Centro de costo predeterminado para operaciones del tercero. |
| `objClienteMini` | Sí | object | Datos mínimos obligatorios del tercero. |
| `objDetalle` | Sí | array | Líneas del documento; total es el total de cada línea. |
| `lstPagos` | Sí | array | Pagos del documento; arreglo vacío indica crédito. |
| `impuestos` | No | object | Impuestos de la línea; si se incluye debe ser completo. |

- Una solicitud contiene un solo documento.
- route-fixed-selector 1 es factura, 7 es compra o gasto y 9 es remisión o prefactura.
- objDetalle.total es el total de la línea; Cuenti registra internamente el precio unitario.
- cambiar_precio_compra=true actualiza el costo unitario y false conserva el costo actual.
- type_match_producto=1 usa id_producto, 2 usa code como SKU y 3 usa code como código de barras.
- Para gasto, route-fixed-selector=7, type_match_producto usa 1 por defecto, cada detalle usa id_plan_cuentas y el documento exige id_centro_costo.

**Ejemplo de argumentos:**

```json
{
  "body": {
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
        "cantidad": 1,
        "descripcion": "Producto",
        "total": 10000,
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

- lstPagos vacío representa una operación a crédito.
- Los campos sin información de objClienteMini se envían como string vacío.
- La respuesta exitosa incluye siempre id_transacion, url_interna y url_externa.
- codigo_unico debe ser un string de 1 a 50 dígitos y conserva ceros iniciales.
- No mezcle detalles de inventario y gasto en el mismo documento.
- retorno es opaco y no debe analizarse.
- No se reintentan automáticamente documentos sin idempotencia comprobada.

**Peticiones habituales:** Factura de inventario.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

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
- agrupar_por debe ser cliente, empleado o vendedor.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Por cliente; Por empleado; Por vendedor.

## Otros documentos

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
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `bodegas`, `ruta_despacho`, `logistica`, `estado`, `documento`, `nota`.
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

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

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
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

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
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `bodegas`, `ruta_despacho`, `logistica`, `estado`, `documento`, `nota`.
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

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

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
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

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
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `pago_realizado` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_documento_hasta` | No | fecha y hora en milisegundos Unix |
| `ultimo_id` | No | número entero |
| `ultima_fecha` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `bodegas`, `ruta_despacho`, `logistica`, `estado`, `documento`, `nota`.
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

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

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
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

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
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

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
| `id_cliente` | No | número entero; mínimo `1` |
| `id_empleado` | No | número entero; mínimo `1` |
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

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
| `id_cliente` | No | número entero; mínimo `1` |
| `id_empleado` | No | número entero; mínimo `1` |
| `id_vendedor` | No | número entero; mínimo `1` |
| `id_sucursal` | No | número entero; mínimo `1` |
| `tipo_documento` | No | lista de números separados por comas |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

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

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `producto`, `sucursal`, `precios`, `inventario`, `categoria`, `marca`, `impuestos`, `medida`, `imagen`, `configuracion`.

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
      }
    }
  ]
}
```

- El body acepta columnas o grupos de catálogo; el orden solicitado se conserva.
- Los valores vacíos de filtros de texto se ignoran.
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
- route-fixed-selector debe ser 1.

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
- cantidad_registros es obligatorio según el contrato actual del servidor.
- grupos no debe estar vacío y debe contener valores únicos.
- Se rechazan los grupos desconocidos.

**Peticiones habituales:** Clientes.

### `terceros-crear`: Crear tercero

**Para qué sirve:** Crear tercero.

**Método:** `POST`.

**Ruta:** `/api/v1/terceros`.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Significado |
| --- | --- |
| `nombre_cliente` | Nombre completo o razón social del tercero. |
| `id_tipo_persona` | Clasificación de persona requerida en creación. |
| `identificacion` | Documento requerido en creación. |
| `id_empresa_portal` | Empresa del portal vinculada al tercero. |
| `id_usuario_portal` | Usuario del portal vinculado al tercero. |
| `primer_nombre` | Primer nombre de una persona natural. |
| `segundo_nombre` | Segundo nombre de una persona natural. |
| `primer_apellido` | Primer apellido de una persona natural. |
| `segundo_apellido` | Segundo apellido de una persona natural. |
| `direccion` | Dirección principal del tercero. |
| `sitio_web` | Sitio web registrado. |
| `facebook` | Perfil o referencia de Facebook. |
| `twitter` | Perfil o referencia de X/Twitter. |
| `instagram` | Perfil o referencia de Instagram. |
| `snapchat` | Perfil o referencia de Snapchat. |
| `puntos_acumulados` | Puntos acumulados en programas de fidelización. |
| `nota` | Observaciones internas sobre el tercero. |
| `es_activo` | Estado operativo del tercero. |
| `fecha_registro` | Fecha de registro enviada como entero en milisegundos desde epoch. |
| `id_lista_precios` | Lista de precios asignada al tercero. |
| `id_ruta_despacho` | Ruta de despacho asociada. |
| `es_cliente` | Indica que el tercero puede comprar a la empresa. |
| `es_proveedor` | Indica que el tercero puede suministrar a la empresa. |
| `ciudad` | Ciudad registrada; el formato depende del catálogo geográfico. |
| `zona` | Zona comercial, logística o geográfica asociada. |
| `contacto` | Nombre o referencia del contacto principal. |
| `codigo_interno` | Código interno asignado por la empresa. |
| `numero_matricula` | Número de matrícula mercantil u otro registro equivalente. |
| `id_estado_civil` | Identificador del estado civil seleccionado. |
| `id_estrato_social` | Identificador del estrato social seleccionado. |
| `id_clase_cliente` | Clasificación comercial del cliente. |
| `id_tipo_cliente` | Tipo de cliente dentro de la segmentación configurada. |
| `fecha_nacimiento` | Fecha de nacimiento enviada como entero en milisegundos desde epoch; puede ser null. |
| `sexo` | Clasificación registrada para sexo; validar el catálogo aplicable. |
| `saldo_bono` | Saldo disponible en bonos asociado al tercero. |
| `permite_cartera_vencida` | Indica si se permiten operaciones con cartera vencida. |
| `id_centro_costo` | Centro de costo predeterminado para operaciones del tercero. |
| `permite_saldo_cartera` | Habilita el manejo de saldos de cartera. |
| `cupo_cartera` | Límite de crédito autorizado. |
| `permite_cartera` | Habilita operaciones a crédito para el tercero. |
| `id_tipo_retencion_ventas` | Tipo de retención predeterminado para ventas. |
| `id_tipo_retencion_compra` | Tipo de retención predeterminado para compras. |
| `id_sucursal` | Sucursal principal o de creación del tercero. |
| `id_vendedor` | Vendedor asignado. |
| `envioSmsCartera` | Configura el envío de SMS relacionados con cartera. |
| `envioSmsProducto` | Configura el envío de SMS relacionados con productos. |
| `pais` | País registrado. |
| `departamento` | Departamento, estado o región registrada. |
| `regimen` | Régimen tributario; validar valores contra el catálogo fiscal. |
| `id_tipo_identificacion` | Identificador del tipo de documento seleccionado. |
| `medio_pago` | Medio de pago preferido o configurado. |
| `tipoOperacion` | Tipo de operación tributaria o comercial; validar valores. |
| `cliente_predeterminado` | Marca al tercero como genérico o predeterminado. |
| `legalidad` | Configuración fiscal de legalidad para documentos electrónicos. |
| `regimenImpuesto` | Régimen de impuestos usado por integraciones tributarias. |
| `fecha_vencimiento_codigo_turismo` | Vencimiento del código de turismo enviado como entero en milisegundos desde epoch; puede ser null. |
| `codigo_turismo` | Código del registro de turismo. |
| `alias` | Nombre corto o comercial alternativo. |
| `horario` | Hora asociada al tercero enviada como entero en milisegundos desde epoch; puede ser null. |
| `dias_vencimiento_cartera_cliente` | Plazo de cartera predeterminado para el cliente. |
| `es_consumidor_final` | Marca al tercero como consumidor final para reglas tributarias. |
| `genera_bonos` | Habilita la generación o acumulación de bonos. |
| `solo_remision2` | Restringe operaciones a una modalidad específica de remisión. |
| `tiene_documentos_asocisados` | Indica si existen documentos asociados; conserva el nombre del campo del contrato. |
| `telefonos` | Hasta tres teléfonos registrados como arreglo. |
| `correos` | Hasta dos correos electrónicos registrados como arreglo. |

Para crear: route-fixed-selector=-1; nombre_cliente; identificacion; id_tipo_persona; es_cliente=1 o es_proveedor=1; al menos un teléfono; al menos un correo.
Para actualizar: route-fixed-selector debe ser mayor que cero; Se requiere al menos un campo editable; Las actualizaciones son parciales.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "nombre_cliente": "Tercero de ejemplo",
    "identificacion": "<id-documento>",
    "id_tipo_persona": 1,
    "es_cliente": 1,
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
  "message": "guardar",
  "type": 1,
  "retorno": "<route-fixed-selector>"
}
```

- El comportamiento verificado del servidor prevalece sobre el informe anterior: omitir route-fixed-selector no crea; route-fixed-selector=-1 crea.
- No exponga clave_portal ni valores personales en registros, fragmentos de código, claves de caché o métricas.
- Los reintentos automáticos están prohibidos sin idempotencia comprobada.
- route-fixed-selector es obligatorio: -1 crea y un valor positivo actualiza.
- Las operaciones de creación requieren identificación, tipo de persona, condición de cliente o proveedor, un teléfono y un correo.
- Se rechazan los campos desconocidos del cuerpo y las actualizaciones parciales vacías.

**Peticiones habituales:** Crear; Actualización parcial.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

### `terceros-actualizar`: Actualizar tercero

**Para qué sirve:** Actualizar tercero.

**Método:** `PUT`.

**Ruta:** `/api/v1/terceros/{id_tercero}`.

**Tipo:** Acción que modifica datos.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_tercero` | Sí | número entero; mínimo `1` |

**Datos que acepta la acción**

| Dato | Significado |
| --- | --- |
| `nombre_cliente` | Nombre completo o razón social del tercero. |
| `id_tipo_persona` | Clasificación de persona requerida en creación. |
| `identificacion` | Documento requerido en creación. |
| `id_empresa_portal` | Empresa del portal vinculada al tercero. |
| `id_usuario_portal` | Usuario del portal vinculado al tercero. |
| `primer_nombre` | Primer nombre de una persona natural. |
| `segundo_nombre` | Segundo nombre de una persona natural. |
| `primer_apellido` | Primer apellido de una persona natural. |
| `segundo_apellido` | Segundo apellido de una persona natural. |
| `direccion` | Dirección principal del tercero. |
| `sitio_web` | Sitio web registrado. |
| `facebook` | Perfil o referencia de Facebook. |
| `twitter` | Perfil o referencia de X/Twitter. |
| `instagram` | Perfil o referencia de Instagram. |
| `snapchat` | Perfil o referencia de Snapchat. |
| `puntos_acumulados` | Puntos acumulados en programas de fidelización. |
| `nota` | Observaciones internas sobre el tercero. |
| `es_activo` | Estado operativo del tercero. |
| `fecha_registro` | Fecha de registro enviada como entero en milisegundos desde epoch. |
| `id_lista_precios` | Lista de precios asignada al tercero. |
| `id_ruta_despacho` | Ruta de despacho asociada. |
| `es_cliente` | Indica que el tercero puede comprar a la empresa. |
| `es_proveedor` | Indica que el tercero puede suministrar a la empresa. |
| `ciudad` | Ciudad registrada; el formato depende del catálogo geográfico. |
| `zona` | Zona comercial, logística o geográfica asociada. |
| `contacto` | Nombre o referencia del contacto principal. |
| `codigo_interno` | Código interno asignado por la empresa. |
| `numero_matricula` | Número de matrícula mercantil u otro registro equivalente. |
| `id_estado_civil` | Identificador del estado civil seleccionado. |
| `id_estrato_social` | Identificador del estrato social seleccionado. |
| `id_clase_cliente` | Clasificación comercial del cliente. |
| `id_tipo_cliente` | Tipo de cliente dentro de la segmentación configurada. |
| `fecha_nacimiento` | Fecha de nacimiento enviada como entero en milisegundos desde epoch; puede ser null. |
| `sexo` | Clasificación registrada para sexo; validar el catálogo aplicable. |
| `saldo_bono` | Saldo disponible en bonos asociado al tercero. |
| `permite_cartera_vencida` | Indica si se permiten operaciones con cartera vencida. |
| `id_centro_costo` | Centro de costo predeterminado para operaciones del tercero. |
| `permite_saldo_cartera` | Habilita el manejo de saldos de cartera. |
| `cupo_cartera` | Límite de crédito autorizado. |
| `permite_cartera` | Habilita operaciones a crédito para el tercero. |
| `id_tipo_retencion_ventas` | Tipo de retención predeterminado para ventas. |
| `id_tipo_retencion_compra` | Tipo de retención predeterminado para compras. |
| `id_sucursal` | Sucursal principal o de creación del tercero. |
| `id_vendedor` | Vendedor asignado. |
| `envioSmsCartera` | Configura el envío de SMS relacionados con cartera. |
| `envioSmsProducto` | Configura el envío de SMS relacionados con productos. |
| `pais` | País registrado. |
| `departamento` | Departamento, estado o región registrada. |
| `regimen` | Régimen tributario; validar valores contra el catálogo fiscal. |
| `id_tipo_identificacion` | Identificador del tipo de documento seleccionado. |
| `medio_pago` | Medio de pago preferido o configurado. |
| `tipoOperacion` | Tipo de operación tributaria o comercial; validar valores. |
| `cliente_predeterminado` | Marca al tercero como genérico o predeterminado. |
| `legalidad` | Configuración fiscal de legalidad para documentos electrónicos. |
| `regimenImpuesto` | Régimen de impuestos usado por integraciones tributarias. |
| `fecha_vencimiento_codigo_turismo` | Vencimiento del código de turismo enviado como entero en milisegundos desde epoch; puede ser null. |
| `codigo_turismo` | Código del registro de turismo. |
| `alias` | Nombre corto o comercial alternativo. |
| `horario` | Hora asociada al tercero enviada como entero en milisegundos desde epoch; puede ser null. |
| `dias_vencimiento_cartera_cliente` | Plazo de cartera predeterminado para el cliente. |
| `es_consumidor_final` | Marca al tercero como consumidor final para reglas tributarias. |
| `genera_bonos` | Habilita la generación o acumulación de bonos. |
| `solo_remision2` | Restringe operaciones a una modalidad específica de remisión. |
| `tiene_documentos_asocisados` | Indica si existen documentos asociados; conserva el nombre del campo del contrato. |
| `telefonos` | Hasta tres teléfonos registrados como arreglo. |
| `correos` | Hasta dos correos electrónicos registrados como arreglo. |

Para crear: route-fixed-selector=-1; nombre_cliente; identificacion; id_tipo_persona; es_cliente=1 o es_proveedor=1; al menos un teléfono; al menos un correo.
Para actualizar: route-fixed-selector debe ser mayor que cero; Se requiere al menos un campo editable; Las actualizaciones son parciales.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "nombre_cliente": "Tercero de ejemplo",
    "identificacion": "<id-documento>",
    "id_tipo_persona": 1,
    "es_cliente": 1,
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
  "message": "guardar",
  "type": 1,
  "retorno": "<route-fixed-selector>"
}
```

- El comportamiento verificado del servidor prevalece sobre el informe anterior: omitir route-fixed-selector no crea; route-fixed-selector=-1 crea.
- No exponga clave_portal ni valores personales en registros, fragmentos de código, claves de caché o métricas.
- Los reintentos automáticos están prohibidos sin idempotencia comprobada.
- route-fixed-selector es obligatorio: -1 crea y un valor positivo actualiza.
- Las operaciones de creación requieren identificación, tipo de persona, condición de cliente o proveedor, un teléfono y un correo.
- Se rechazan los campos desconocidos del cuerpo y las actualizaciones parciales vacías.

**Peticiones habituales:** Crear; Actualización parcial.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

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
- route-fixed-selector es obligatorio y debe ser 0 o 1.
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
- route-fixed-selector es obligatorio y debe ser 0 o 1.
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
- route-fixed-selector es obligatorio y debe ser 0 o 1.
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
- route-fixed-selector es obligatorio y debe ser 0 o 1.
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
- `empleado`: Empleado que registró o gestionó la operación. Incluye `id_empleado`, `identificacion`, `nombre_completo`, `codigo_empleado`, `tipo_usuario`, `es_activo`, `fecha_registro`, `id_usuario_portal`.
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

**Para qué sirve:** Obtener comandas de cocina. Su resultado principal es `comandas`.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_sucursal` | Sí | número entero |
| `id_transacion` | No | número entero |
| `numero_mesa` | No | número entero |
| `estado` | No | número entero |
| `id_cocina` | No | número entero |
| `id_empleado` | No | número entero |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`: Identificadores y números que permiten localizar el registro. Incluye `id_transacion_mesa`, `id_transacion`.
  - `id_transacion_mesa`: Identificador único de la línea de comanda.
  - `id_transacion`: Documento de venta asociado.
- `sucursal`: Sucursal donde se originó o aplica la operación. Incluye `id_sucursal`.
  - `id_sucursal`: Sucursal de la comanda.
- `mesa`: Identificación de la mesa y datos de sus comensales. Incluye `numero_mesa`, `nombre_mesa`, `comensales`, `turno`.
  - `numero_mesa`: Número de mesa.
  - `nombre_mesa`: Nombre visible de la mesa.
  - `comensales`: Cantidad de personas registrada en la mesa.
  - `turno`: Turno o rotación de ocupación de la mesa.
- `producto`: Identificación, descripción y presentación del producto. Incluye `id_producto`, `nombre`, `cantidad`, `precio`, `nota`, `formato_presentacion`, `configuracion_plato`.
  - `id_producto`: Producto o plato solicitado.
  - `nombre`: Nombre del producto o plato.
  - `cantidad`: Cantidad solicitada.
  - `precio`: Precio registrado para el plato.
  - `nota`: Instrucción u observación de preparación.
  - `formato_presentacion`: Formato comercial de presentación.
  - `configuracion_plato`: Adiciones o variantes configuradas para el plato.
- `empleado`: Empleado que registró o gestionó la operación. Incluye `id_empleado`, `nombre_empleado`.
  - `id_empleado`: Empleado que registró o atiende.
  - `nombre_empleado`: Nombre del empleado.
- `fecha`: Fecha de registro del evento operativo. Incluye `fecha_registro`.
  - `fecha_registro`: Fecha y hora de registro.
- `estado`: Estado operativo de la línea de comanda. Incluye `estado`, `es_activo`, `id_cocina`.
  - `estado`: Estado operativo de la línea de comanda.
  - `es_activo`: Indica que la línea permanece activa.
  - `id_cocina`: Cocina o estación asignada.
- `preparacion`: Tiempos y estación de preparación de la comanda. Incluye `tiempo_preparacion_producto`, `tiempo_preparacion_plato`, `tiempo_entrega`.
  - `tiempo_preparacion_producto`: Tiempo de preparación configurado para el producto.
  - `tiempo_preparacion_plato`: Tiempo registrado o calculado para el plato.
  - `tiempo_entrega`: Tiempo asociado a la entrega; validar unidad temporal.
- `pedido`: Referencias del pedido en línea y sus órdenes. Incluye `es_pedido_linea`, `id_pedido_linea`, `numero_orden`, `numero_orden2`.
  - `es_pedido_linea`: Indica si proviene de un pedido en línea.
  - `id_pedido_linea`: Identificador del pedido en línea.
  - `numero_orden`: Número de orden principal.
  - `numero_orden2`: Segunda referencia de orden.
- `impresion`: Configuración de plantillas, contenido y opciones de impresión. Incluye `impreso`, `imprimio_prefactura`, `marca`, `observacion`.
  - `impreso`: Indica si la comanda fue impresa.
  - `imprimio_prefactura`: Indica si se imprimió prefactura.
  - `marca`: Señal usada en el flujo de impresión o preparación; validar regla exacta.
  - `observacion`: Observación operativa.

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
      "mesa": {
        "numero_mesa": 1,
        "nombre_mesa": "Mesa ejemplo",
        "comensales": 2
      },
      "producto": {
        "id_producto": 25,
        "nombre": "Producto ejemplo",
        "cantidad": 1,
        "precio": 10000
      },
      "estado": {
        "estado": 1,
        "es_activo": 1
      }
    }
  ]
}
```

- Solo se devuelven comandas de cocina activas cuyo estado sea diferente de 4.
- id_sucursal es obligatorio.
- grupos no debe estar vacío, debe contener valores únicos y limitarse al catálogo.

**Peticiones habituales:** Comandas activas de la sucursal.

### `restaurante-platos-eliminados-busquedas`: Buscar platos eliminados

**Para qué sirve:** Buscar platos eliminados. Su resultado principal es `platos_eliminados`.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas/platos-eliminados/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `id_sucursal` | Sí | número entero |
| `id_empleado` | No | número entero |
| `mesa` | No | número entero |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

Para `grupos`:
- `codigos`: Identificadores y números que permiten localizar el registro. Incluye `id_auditoria`.
  - `id_auditoria`: Identificador único del registro de auditoría.
- `fecha`: Fecha de registro del evento operativo. Incluye `fecha_registro`.
  - `fecha_registro`: Momento de la eliminación.
- `sucursal`: Sucursal donde se originó o aplica la operación. Incluye `id_sucursal`, `nombre_sucursal`.
  - `id_sucursal`: Sucursal donde ocurrió la eliminación.
  - `nombre_sucursal`: Nombre de la sucursal.
- `empleado`: Empleado que registró o gestionó la operación. Incluye `id_empleado`, `nombre_empleado`.
  - `id_empleado`: Empleado asociado a la eliminación.
  - `nombre_empleado`: Nombre del empleado.
- `producto`: Identificación, descripción y presentación del producto. Incluye `nombre_producto`, `cantidad`.
  - `nombre_producto`: Nombre del plato o producto eliminado.
  - `cantidad`: Cantidad eliminada.
- `mesa`: Número de mesa guardado en la auditoría. Incluye `mesa`, `nombre_mesa`.
  - `mesa`: Número de mesa guardado en la auditoría.
  - `nombre_mesa`: Nombre visible de la mesa.
- `motivo`: Nota o motivo registrado para la eliminación del plato. Incluye `nota`.
  - `nota`: Motivo u observación de la eliminación.

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
      "motivo"
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
      "producto": {
        "nombre_producto": "Producto ejemplo",
        "cantidad": 1
      },
      "motivo": {
        "nota": "Motivo de ejemplo"
      }
    }
  ]
}
```

- El punto de acceso expone únicamente campos respaldados por la tabla de auditoría de eliminación de platos.
- id_sucursal es obligatorio.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Auditoría de eliminaciones por sucursal.

## Restaurante

### `restaurante-comandas-crear`: Crear comanda de restaurante

**Para qué sirve:** Registra una comanda en la API central de sincronización para cocina y POS.

**Método:** `POST`.

**Ruta:** `/api/v1/restaurante/comandas` a través de Envoy.

**Tipo:** Mutación idempotente; requiere confirmación explícita.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
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
- La ruta pública se alcanza a través de Envoy y se traduce internamente al servicio de sincronización.
- La operación no utiliza cache porque modifica datos.

**Antes de ejecutarla:** explica el destino y pide confirmación con `restaurante/confirmation=confirm:restaurante-comandas-crear`.
