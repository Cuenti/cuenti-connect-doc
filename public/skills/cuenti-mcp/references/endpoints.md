# Catálogo funcional de Cuenti MCP

<!-- Generated from contracts/j4/endpoints.json. Do not edit manually. -->

Usa este catálogo para traducir una necesidad de negocio a la herramienta correcta y pedir únicamente la información necesaria.

## Cómo usarlo

- Identifica primero la necesidad y elige una herramienta de la tabla o de `tools/list`.
- Busca el encabezado `###` que contiene el nombre exacto de la herramienta y lee solo esa sección hasta el siguiente encabezado `###`.
- Usa el ejemplo de argumentos como punto de partida y cambia únicamente los datos necesarios.
- Antes de llamar, contrasta los nombres y tipos con el `inputSchema` publicado por el MCP.
- Los **filtros** reducen los resultados. Usa páginas pequeñas y evita consultas sin criterio cuando exista un filtro útil.
- Las **columnas** eligen datos concretos de una consulta.
- Los **grupos** agregan bloques relacionados; cada grupo explica sus campos incluidos.
- `0` suele significar no/inactivo y `1` sí/activo, salvo que la operación indique otro significado.
- Las fechas en milisegundos Unix son números como `1722470400000`.

## Herramientas por necesidad

| Necesidad | Herramientas |
| --- | --- |
| Facturas e historiales | `ventas-facturas-busquedas`, `ventas-planes-separe-busquedas`, `ventas-otros-ingresos-busquedas`, `ventas-compras-gastos-busquedas`, `ventas-remisiones-busquedas`, `ventas-facturas`, `ventas-compras-gastos`, `ventas-remisiones`, `ventas-productos-comprados-busquedas`, `ventas-descuentos-busquedas`, `ventas-consolidados-busquedas` |
| Documentos comerciales | `operativas-pedidos-busquedas`, `operativas-cotizaciones-busquedas`, `operativas-despachos-busquedas`, `operativas-despachos-agrupados-busquedas`, `operativas-ordenes-produccion-busquedas`, `operativas-devoluciones-ajustes-busquedas`, `operativas-traslados-internos-busquedas`, `operativas-ordenes-compra-busquedas`, `operativas-recepciones-mercancia-busquedas`, `operativas-productos-busquedas`, `operativas-descuentos-busquedas`, `operativas-consolidados-busquedas` |
| Productos e inventario | `catalogo-productos-busquedas`, `inventario-conteos` |
| Categorías e impuestos | `catalogo-categorias-busquedas`, `catalogo-productos-impuestos-licores`, `tributario-impuesto-por-id` |
| Maestros | `catalogo-marcas`, `catalogo-marca-por-id`, `tributario-impuestos-busquedas`, `finanzas-bancos-busquedas`, `finanzas-medios-pago-busquedas`, `organizacion-sucursales-busquedas`, `organizacion-empleados-busquedas`, `facturacion-consecutivos-busquedas` |
| Terceros | `terceros-busquedas`, `terceros-crear`, `terceros-actualizar` |
| Cartera | `finanzas-cartera-cobrar-busquedas`, `finanzas-cartera-pagar-busquedas`, `finanzas-resumen-cobrar-busquedas`, `finanzas-resumen-pagar-busquedas` |
| Comandas | `restaurante-comandas-busquedas`, `restaurante-platos-eliminados-busquedas` |

## Facturas e historiales

### `ventas-facturas-busquedas`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `es_factura` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `costo`, `nota`, `presentacion`, `configuracion`, `producto_ampliado`, `seriales`.

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
      "acta_entrega"
    ],
    "detalle": [
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "costo",
      "nota",
      "presentacion",
      "configuracion",
      "producto_ampliado",
      "seriales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'transacciones', resultados: Transaccion[], contexto?: object }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "transacciones",
  "resultados": []
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-planes-separe-busquedas`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `es_factura` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `costo`, `nota`, `presentacion`, `configuracion`, `producto_ampliado`, `seriales`.

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
      "acta_entrega"
    ],
    "detalle": [
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "costo",
      "nota",
      "presentacion",
      "configuracion",
      "producto_ampliado",
      "seriales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'transacciones', resultados: Transaccion[], contexto?: object }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "transacciones",
  "resultados": []
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-otros-ingresos-busquedas`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `es_factura` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `costo`, `nota`, `presentacion`, `configuracion`, `producto_ampliado`, `seriales`.

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
      "acta_entrega"
    ],
    "detalle": [
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "costo",
      "nota",
      "presentacion",
      "configuracion",
      "producto_ampliado",
      "seriales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'transacciones', resultados: Transaccion[], contexto?: object }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "transacciones",
  "resultados": []
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-compras-gastos-busquedas`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `es_factura` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `costo`, `nota`, `presentacion`, `configuracion`, `producto_ampliado`, `seriales`.

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
      "acta_entrega"
    ],
    "detalle": [
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "costo",
      "nota",
      "presentacion",
      "configuracion",
      "producto_ampliado",
      "seriales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'transacciones', resultados: Transaccion[], contexto?: object }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "transacciones",
  "resultados": []
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-remisiones-busquedas`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `es_factura` | No | `0`, `1` |
| `es_nula` | No | `0`, `1` |
| `es_activo` | No | `0`, `1` |
| `es_devolucion` | No | `0`, `1` |
| `fecha_desde` | No | fecha y hora en milisegundos Unix |
| `fecha_hasta` | No | fecha y hora en milisegundos Unix |

**Bloques de información que puedes pedir**

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `codigos`, `fechas`, `sucursal`, `cliente`, `empleado`, `vendedor`, `totales`, `impuestos`, `estado`, `qr`, `nota`, `documento`, `moneda`, `estado_electronico`, `pagos`, `retenciones`, `notas_credito`, `facturacion_electronica`, `consecutivo`, `impresion`, `cartera_cliente`, `empresa`, `sucursal_configuracion`, `taller`, `acta_entrega`.
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `costo`, `nota`, `presentacion`, `configuracion`, `producto_ampliado`, `seriales`.

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
      "acta_entrega"
    ],
    "detalle": [
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "costo",
      "nota",
      "presentacion",
      "configuracion",
      "producto_ampliado",
      "seriales"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'transacciones', resultados: Transaccion[], contexto?: object }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "transacciones",
  "resultados": []
}
```

- Todas las variaciones de filtros son configuraciones predefinidas de este punto de acceso, nunca rutas independientes.
- detalle.codigos contiene id_detalle_transacion, no id_transacion.
- El grupo impresion devuelve configuración y no genera un PDF.
- Se rechazan los arreglos de grupos desconocidos, repetidos o vacíos.
- La paginación está limitada a 1..1000 registros.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `ventas-facturas`: Crear factura, compra, gasto o remisión

**Para qué sirve:** Crear factura, compra, gasto o remisión.

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
  "message": "save",
  "retorno": "opaque-value",
  "id_transacion": 511903,
  "url_interna": "...",
  "url_externa": "..."
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

### `ventas-compras-gastos`: Crear factura, compra, gasto o remisión

**Para qué sirve:** Crear factura, compra, gasto o remisión.

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
  "message": "save",
  "retorno": "opaque-value",
  "id_transacion": 511903,
  "url_interna": "...",
  "url_externa": "..."
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

### `ventas-remisiones`: Crear factura, compra, gasto o remisión

**Para qué sirve:** Crear factura, compra, gasto o remisión.

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
  "message": "save",
  "retorno": "opaque-value",
  "id_transacion": 511903,
  "url_interna": "...",
  "url_externa": "..."
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

**Para qué sirve:** Buscar productos comprados. Su resultado principal es `resultados`.

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

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `producto`, `cantidades`, `totales`, `impuestos`, `costos`, `fechas`.

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
      "impuestos",
      "costos",
      "fechas"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'productos', resultados: ProductoComprado[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "productos",
  "resultados": []
}
```

- Los resultados se consolidan por id_producto.
- Las transacciones anuladas se excluyen de forma predeterminada.
- id_cliente es obligatorio.
- grupos no debe estar vacío, debe contener valores únicos y limitarse al catálogo.

**Peticiones habituales:** Productos comprados por cliente.

### `ventas-descuentos-busquedas`: Buscar descuentos

**Para qué sirve:** Buscar descuentos. Su resultado principal es `resultados`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/ventas/descuentos/busquedas`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `nivel` | No | `encabezado`, `detalle`; valor habitual `encabezado` |
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

- `grupos` cuando `nivel=encabezado`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `transaccion`, `cliente`, `empleado`, `totales`, `impuestos`.
- `grupos` cuando `nivel=detalle`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `transaccion`, `cliente`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 100,
  "nivel": "encabezado",
  "es_ingreso": 1,
  "body": {
    "grupos": [
      "transaccion",
      "cliente",
      "empleado",
      "totales",
      "impuestos"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'descuentos', resultados: Descuento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "descuentos",
  "resultados": []
}
```

- Las transacciones anuladas se excluyen de forma predeterminada.
- Los dos niveles son configuraciones predefinidas de un solo punto de acceso, no rutas independientes.
- nivel debe ser encabezado o detalle.
- Los grupos seleccionados deben pertenecer al nivel seleccionado.

**Peticiones habituales:** Descuentos de factura; Descuentos de producto.

### `ventas-consolidados-busquedas`: Buscar historial consolidado

**Para qué sirve:** Buscar historial consolidado. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'consolidado', resultados: FilaConsolidada[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "consolidado",
  "resultados": []
}
```

- Las transacciones anuladas se excluyen de forma predeterminada, salvo que se proporcione es_nula=1.
- agrupar_por debe ser cliente, empleado o vendedor.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Por cliente; Por empleado; Por vendedor.

## Documentos comerciales

### `operativas-pedidos-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-cotizaciones-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-despachos-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-despachos-agrupados-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/despachos-agrupados/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-ordenes-produccion-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/ordenes-produccion/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-devoluciones-ajustes-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/devoluciones-ajustes/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-traslados-internos-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/traslados-internos/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-ordenes-compra-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/ordenes-compra/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
}
```

- detalle es opcional y conserva el orden de los grupos solicitados.
- Las respuestas no exponen credenciales ni claves internas.
- Los grupos desconocidos, duplicados o vacíos se rechazan.
- Los filtros de fecha usan rangos inclusivos en epoch-milliseconds.

**Peticiones habituales:** Facturas activas.

### `operativas-recepciones-mercancia-busquedas`: Buscar documentos comerciales

**Para qué sirve:** Buscar documentos comerciales. Su resultado principal es `documentos`.

**Método:** `POST`.

**Ruta:** `/api/v1/transacciones/operativas/recepciones-mercancia/busquedas`.

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
- `detalle`: Bloques de información de las líneas del documento. Valores: `codigos`, `producto`, `cantidades`, `precios`, `descuento`, `impuestos`, `totales`, `presentacion`, `configuracion`, `producto_ampliado`.

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
      "codigos",
      "producto",
      "cantidades",
      "precios",
      "descuento",
      "impuestos",
      "totales",
      "presentacion",
      "configuracion",
      "producto_ampliado"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, documentos: Documento[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "documentos": []
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
  "cantidad": 0,
  "productos": []
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

- `grupos`: Conjunto de bloques funcionales solicitados para la respuesta. Valores: `documento`, `cliente`, `empleado`, `vendedor`, `producto`, `cantidades`, `precios`, `descuento`, `totales`.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "grupos": [
      "documento",
      "cliente",
      "empleado",
      "vendedor",
      "producto",
      "cantidades",
      "precios",
      "descuento",
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
  "cantidad": 0,
  "descuentos": []
}
```

- Los grupos producto, cantidades o precios solicitan el modo detalle.
- Los resultados solo incluyen documentos con descuentos.
- Los grupos incompatibles con el detalle solicitado se rechazan.
- Los filtros de fecha son inclusivos y usan epoch-milliseconds.

**Peticiones habituales:** Descuentos por documento.

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
  "cantidad": 0,
  "consolidado": []
}
```

- El consolidado agrupa documentos por la dimensión seleccionada.
- Los rangos de fecha incluyen ambos extremos y usan epoch-milliseconds.
- agrupar_por debe ser cliente, empleado, vendedor o sucursal.
- Los grupos deben ser únicos y no vacíos.

**Peticiones habituales:** Consolidado por cliente.

## Productos e inventario

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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_producto` | Identificador maestro del producto. |
| `nombre` | Nombre visible del registro. |
| `sku` | Código interno o SKU usado para identificar el producto. |
| `codigo_barras` | Código de barras principal o de la presentación consultada. |
| `nota` | Observaciones internas sobre el tercero. |
| `es_servicio` | Campo `es_servicio`; confirma su significado funcional antes de interpretarlo. |
| `es_ingrediente` | Campo `es_ingrediente`; confirma su significado funcional antes de interpretarlo. |
| `mostrar_tienda` | Campo `mostrar_tienda`; confirma su significado funcional antes de interpretarlo. |
| `vende_sin_existencia` | Campo `vende_sin_existencia`; confirma su significado funcional antes de interpretarlo. |
| `maneja_lote` | Campo `maneja_lote`; confirma su significado funcional antes de interpretarlo. |
| `maneja_seriales` | Campo `maneja_seriales`; confirma su significado funcional antes de interpretarlo. |
| `alias` | Nombre corto o comercial alternativo. |
| `metadata` | Información adicional de la categoría; su estructura depende de los datos históricos. |
| `id_producto_sucursal` | Campo `id_producto_sucursal`; confirma su significado funcional antes de interpretarlo. |
| `id_sucursal` | Sucursal principal o de creación del tercero. |
| `nombre_sucursal` | Nombre visible de la sucursal. |
| `ubicacion` | Campo `ubicacion`; confirma su significado funcional antes de interpretarlo. |
| `es_activo` | Estado operativo del tercero. |
| `precio_venta` | Campo `precio_venta`; confirma su significado funcional antes de interpretarlo. |
| `precio_compra` | Campo `precio_compra`; confirma su significado funcional antes de interpretarlo. |
| `costo` | Costo registrado para la línea del documento. |
| `costo_fijo` | Campo `costo_fijo`; confirma su significado funcional antes de interpretarlo. |
| `precio_venta_minimo` | Campo `precio_venta_minimo`; confirma su significado funcional antes de interpretarlo. |
| `precio_venta_online` | Campo `precio_venta_online`; confirma su significado funcional antes de interpretarlo. |
| `precio_promocion_sito` | Campo `precio_promocion_sito`; confirma su significado funcional antes de interpretarlo. |
| `precio_promocion_online` | Campo `precio_promocion_online`; confirma su significado funcional antes de interpretarlo. |
| `descuento_maximo` | Campo `descuento_maximo`; confirma su significado funcional antes de interpretarlo. |
| `existencias` | Campo `existencias`; confirma su significado funcional antes de interpretarlo. |
| `stock_minimo` | Campo `stock_minimo`; confirma su significado funcional antes de interpretarlo. |
| `id_categoria` | Campo `id_categoria`; confirma su significado funcional antes de interpretarlo. |
| `nombre_categoria` | Campo `nombre_categoria`; confirma su significado funcional antes de interpretarlo. |
| `id_marca` | Campo `id_marca`; confirma su significado funcional antes de interpretarlo. |
| `nombre_marca` | Campo `nombre_marca`; confirma su significado funcional antes de interpretarlo. |
| `id_impuesto` | Campo `id_impuesto`; confirma su significado funcional antes de interpretarlo. |
| `nombre_impuesto` | Campo `nombre_impuesto`; confirma su significado funcional antes de interpretarlo. |
| `valor_impuesto` | Campo `valor_impuesto`; confirma su significado funcional antes de interpretarlo. |
| `tipo_impuesto` | Clasificación funcional del impuesto; validar códigos tributarios. |
| `clasificacion_tributaria` | Campo `clasificacion_tributaria`; confirma su significado funcional antes de interpretarlo. |
| `total_estampilla` | Valor de estampilla asociado al producto o documento. |
| `total_impoconsumo` | Valor del impuesto al consumo asociado al producto o documento. |
| `id_tipo_medida` | Campo `id_tipo_medida`; confirma su significado funcional antes de interpretarlo. |
| `nombre_medida` | Campo `nombre_medida`; confirma su significado funcional antes de interpretarlo. |
| `tipo_medida` | Campo `tipo_medida`; confirma su significado funcional antes de interpretarlo. |
| `id_imagen` | Identificador del recurso de imagen. |
| `ext1` | Campo `ext1`; confirma su significado funcional antes de interpretarlo. |
| `ext2` | Campo `ext2`; confirma su significado funcional antes de interpretarlo. |
| `url_imagen` | Dirección para consultar la imagen del producto. |
| `url_imagen_400` | Campo `url_imagen_400`; confirma su significado funcional antes de interpretarlo. |
| `invima` | Campo `invima`; confirma su significado funcional antes de interpretarlo. |
| `cum` | Campo `cum`; confirma su significado funcional antes de interpretarlo. |
| `cups` | Campo `cups`; confirma su significado funcional antes de interpretarlo. |
| `codigo_producto_dian` | Campo `codigo_producto_dian`; confirma su significado funcional antes de interpretarlo. |
| `tiempo_preparacion` | Campo `tiempo_preparacion`; confirma su significado funcional antes de interpretarlo. |
| `ncm` | Campo `ncm`; confirma su significado funcional antes de interpretarlo. |
| `fecha_registro` | Fecha de creación del tercero. |

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
        "nombre": "Producto",
        "sku": "SKU-25"
      },
      "inventario": {
        "existencias": 10
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
  "message": "save",
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

## Categorías e impuestos

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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_categoria` | Identificador único de la categoría. |
| `nombre_categoria` | Nombre visible de la categoría. |
| `alias` | Nombre alternativo o slug funcional de la categoría. |
| `codigo_dian` | Código de clasificación usado por la integración DIAN. |
| `id_categoria_padre` | Identificador de la categoría superior; vacío ubica el nodo como raíz. |
| `es_activo` | Estado operativo de la categoría. |
| `fecha_registro` | Momento de creación de la categoría. |
| `visible_tienda` | Controla la visibilidad de la categoría en la tienda. |
| `mostrar_tienda_linea` | Controla la visualización en la tienda en línea. |
| `mostrar_catalogo_linea` | Controla la visualización en el catálogo en línea. |
| `metadata` | Información adicional de la categoría según los datos históricos. |
| `id_imagen` | Identificador de la imagen asociada. |
| `formato` | Formato de presentación de la imagen o categoría. |
| `url` | Dirección del recurso asociado a la categoría. |
| `sucursales` | Sucursales asociadas; puede ser arreglo, objeto, string histórico o null. |
| `alerta_vencimiento_lotes` | Controla alertas de vencimiento de lotes de la categoría. |
| `visible_produccion` | Indica si la categoría aparece en procesos de producción. |

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
      "id_categoria": 17,
      "nombre_categoria": "Productos Alimenticios",
      "sucursales": [
        1,
        2,
        4
      ],
      "subcategorias": [
        {
          "id_categoria": 18,
          "nombre_categoria": "Bebidas",
          "sucursales": [
            1,
            4
          ],
          "subcategorias": []
        }
      ]
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

## Maestros

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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_impuesto` | Identificador de la configuración de impuesto. |
| `nombre_impuesto` | Nombre visible del impuesto. |
| `valor_impuesto` | Tarifa o valor configurado; validar su unidad con el tipo de impuesto. |
| `nota` | Observaciones internas del impuesto. |
| `es_activo` | Estado operativo de la configuración tributaria. |
| `fecha_registro` | Momento de creación de la configuración. |
| `tipo_impuesto` | Tipo funcional del impuesto; validar códigos tributarios. |
| `id_plan_cuentas_venta` | Cuenta contable usada para impuestos en ventas. |
| `id_plan_cuentas_pasivo` | Cuenta de pasivo asociada al impuesto. |
| `id_plan_cuentas_activo` | Cuenta de activo asociada al impuesto. |
| `id_plan_cuentas_compra` | Cuenta contable usada para impuestos en compras. |
| `id_plan_cuenta_imp_venta_devolucion` | Cuenta para impuestos en devoluciones de ventas. |
| `id_plan_cuenta_imp_compa_devolucion` | Cuenta para impuestos en devoluciones de compra. |
| `id_plan_cuenta_imp_gasto_devolucion` | Cuenta para impuestos en devoluciones de gastos. |
| `id_plan_cuentas_gasto` | Cuenta de gasto asociada al impuesto. |
| `id_plan_cuenta_compra_item` | Cuenta aplicada al ítem de compra. |
| `clasificacion_tributaria` | Clasificación usada en reglas o reportes tributarios; validar valores por país. |
| `codigo` | Código interno o fiscal del impuesto. |
| `codigo_tipo_impuesto` | Código del tipo de impuesto para integración fiscal. |
| `nombre_codigo_impuesto` | Nombre descriptivo del código fiscal asociado. |
| `pais` | País al que aplica la configuración tributaria. |

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
  "cantidad": 0,
  "impuestos": []
}
```

- Consulta de datos maestros; no se devuelve un total global de páginas.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Impuestos activos.

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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_banco` | Identificador de la cuenta bancaria, caja o recurso financiero. |
| `nombre` | Nombre visible del banco o caja. |
| `numero_cuenta` | Número de cuenta como texto; puede contener información empresarial sensible. |
| `saldo` | Saldo registrado de la cuenta; no necesariamente es conciliado en tiempo real. |
| `descripcion` | Descripción funcional de la cuenta. |
| `es_activo` | Estado operativo de la cuenta. |
| `id_plan_cuenta` | Cuenta contable relacionada. |
| `codigo` | Código interno del banco o caja. |
| `id_sucursal` | Sucursal propietaria o asociada. |
| `nombre_sucursal` | Nombre visible de la sucursal. |
| `config` | Configuración adicional, por ejemplo empleados autorizados. |

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
      "id_banco": 1,
      "nombre": "Caja General",
      "numero_cuenta": "11050101",
      "saldo": 500000,
      "config": {
        "lstEmpleados": [
          1,
          2,
          3,
          5,
          6,
          8,
          11
        ]
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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_medio_pago` | Identificador interno del medio de pago. |
| `nombre_medio_pago` | Nombre visible del medio de pago. |
| `nota` | Observaciones de configuración. |
| `es_activo` | Estado operativo del medio de pago. |
| `codigo` | Código interno del medio de pago. |
| `id_sucursal` | Sucursal a la que pertenece o aplica. |
| `nombre_sucursal` | Nombre visible de la sucursal. |
| `comision` | Comisión configurada; validar si se expresa como porcentaje o importe. |
| `codigo_pago_fisco` | Código fiscal equivalente del medio de pago. |
| `config` | Configuración adicional, por ejemplo bancos permitidos. |

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
      "id_medio_pago": 1,
      "nombre_medio_pago": "Efectivo",
      "config": {
        "lstBancos": []
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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_sucursal` | Identificador interno de la sucursal. |
| `nombre_sucursal` | Nombre visible de la sucursal. |
| `nota` | Observaciones internas. |
| `codigo_sucursal` | Código interno o de integración. |
| `es_activo` | Estado operativo. |
| `fecha_registro` | Momento de creación. |
| `es_bodega` | Indica si funciona como bodega. |
| `id_padre` | Sucursal o entidad superior en una jerarquía. |
| `id_moneda` | Moneda predeterminada. |
| `simbolo_moneda` | Símbolo mostrado para la moneda. |
| `vender_con_impuestos` | Indica si la venta opera incluyendo impuestos. |
| `numero_mesas` | Número de mesas configuradas para restaurante. |
| `digitos_decimales` | Precisión decimal usada en cálculos o presentación. |
| `reondeoTotales` | Control de redondeo de totales. |
| `modificicar_precio_minimos_otras_sucursales` | Controla cambios de precios mínimos de otras sucursales. |
| `modificicar_descuento_maximo_otras_sucursales` | Controla cambios de descuentos máximos de otras sucursales. |
| `actualizarPrecioVentaSucursales` | Controla la propagación de precios de venta entre sucursales. |
| `activar_venta_compra_licores` | Habilita reglas especiales de compra y venta de licores. |
| `actualizarPrecioCostoSucursales` | Controla la propagación de precios de costo entre sucursales. |
| `vender_ip_estampilla` | Control relacionado con venta y estampilla; validar la sigla IP. |

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
  "cantidad": 0,
  "sucursales": []
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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_empleado` | Identificador interno del empleado. |
| `id_usuario_portal` | Usuario de portal vinculado. |
| `nombre_completo` | Nombre completo para visualización. |
| `es_activo` | Estado operativo. |
| `fecha_registro` | Momento de creación. |
| `id_lista_precios` | Lista de precios predeterminada. |
| `id_sucursal` | Sucursal principal. |
| `id_consecutivo` | Consecutivo predeterminado. |
| `sincroniazar_datos` | Control de sincronización. |
| `tipo_usuario` | Rol o tipo de usuario; validar catálogo de seguridad. |
| `comision` | Comisión asignada al empleado. |
| `id_bodega` | Bodega predeterminada. |
| `tipo_comision` | Forma de cálculo de la comisión. |
| `modePosDefecto` | Modo POS predeterminado. |
| `comision_antes_iva` | Indica si la comisión se calcula antes del IVA. |
| `identificacion` | Documento de identificación del empleado. |
| `mostrar_mesa` | Habilita la visualización o selección de mesas. |
| `es_contador` | Marca al empleado como contador. |
| `solo_bodegas_sucursal` | Restringe las bodegas a las de su sucursal. |
| `obligar_apertura_caja` | Exige apertura de caja antes de operar. |
| `cerrar_session_cierre` | Controla el cierre de sesión durante un cierre. |
| `es_tienda` | Clasifica al usuario para operación de tienda. |
| `codigo_empleado` | Código interno del empleado. |
| `sucursal_adicional` | Sucursales y bodegas adicionales permitidas. |
| `cierra_caja` | Autoriza o configura el cierre de caja. |
| `ventas_solo_credito` | Restringe ventas a modalidad crédito. |
| `vendedor_multi_sucursal` | Habilita operación comercial en varias sucursales. |

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
      "id_empleado": 1,
      "nombre_completo": "Empleado de ejemplo",
      "sucursal_adicional": {
        "bodegas_vender": [],
        "bodegas_trasladar": [],
        "sucursales_permitidas": []
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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_consecutivo` | Identificador de la numeración documental. |
| `nombre_consecutivo` | Nombre administrativo del consecutivo. |
| `prefijo` | Prefijo de la numeración visible. |
| `numero` | Número actual o siguiente según la regla del módulo; consultar no lo incrementa. |
| `alertar_numero` | Umbral para alertar proximidad al agotamiento de la numeración. |
| `facturaOnline` | Indica habilitación de facturación en línea. |
| `es_activo` | Estado operativo del consecutivo. |
| `fecha_registro` | Momento de creación. |
| `resolucion` | Resolución que autoriza la numeración. |
| `id_sucursal` | Sucursal a la que pertenece. |
| `nombre_sucursal` | Nombre visible de la sucursal. |
| `inicia` | Primer número autorizado del rango. |
| `finaliza` | Último número autorizado del rango. |
| `es_factura_electronica` | Indica uso para factura electrónica. |
| `fecha_vencimiento` | Vencimiento de la resolución o autorización. |
| `nRelleno` | Longitud o cantidad de caracteres de relleno. |
| `es_tirilla_pos` | Indica numeración para tirilla POS. |
| `es_contingencia` | Indica numeración destinada a contingencia. |
| `predeterminado` | Marca el consecutivo propuesto por defecto. |
| `multi_moneda` | Permite documentos con configuración multimoneda. |
| `tipo_consecutivo` | Tipo documental asociado al consecutivo. |

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
  "cantidad": 0,
  "consecutivos": []
}
```

- Este punto de acceso consulta la configuracion de consecutivos; no reserva ni incrementa numeros.
- El body {} es valido y devuelve la proyeccion completa; se recomienda grupos y columnas se conserva por compatibilidad plana.
- technicalKey2, registrarEmpleados e id_empleado se omiten porque la auditoria del ERP los marco como columnas no disponibles; los grupos factura_electronica y configuracion del backend actual requieren validacion antes de usarse.
- segunda_clave y clave_caja estan deshabilitados en el backend y no son columnas consultables.
- es_activo debe ser 0 o 1.
- Los grupos o columnas deben ser no vacíos, únicos y limitarse al catálogo.

**Peticiones habituales:** Consecutivos activos.

## Terceros

### `terceros-busquedas`: Buscar terceros

**Para qué sirve:** Buscar terceros. Su resultado principal es `terceros`.

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

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_cliente` | Identificador del tercero consultado. |
| `nombre_cliente` | Nombre completo o razón social principal. |
| `identificacion` | Documento de identidad o identificación tributaria. |
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
| `fecha_registro` | Fecha de creación del tercero. |
| `fecha_actualizacion` | Fecha de la última actualización registrada. |
| `id_lista_precios` | Lista de precios asignada al tercero. |
| `id_ruta_despacho` | Ruta de despacho asociada. |
| `es_cliente` | Indica que el tercero puede comprar a la empresa. |
| `es_proveedor` | Indica que el tercero puede suministrar a la empresa. |
| `ciudad` | Ciudad registrada; el formato depende del catálogo geográfico. |
| `zona` | Zona comercial, logística o geográfica asociada. |
| `contacto` | Nombre o referencia del contacto principal. |
| `codigo_interno` | Código interno asignado por la empresa. |
| `numero_matricula` | Número de matrícula mercantil u otro registro equivalente. |
| `id_clase_cliente` | Clasificación comercial del cliente. |
| `id_tipo_cliente` | Tipo de cliente dentro de la segmentación configurada. |
| `fecha_nacimiento` | Fecha de nacimiento de una persona natural. |
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
| `medio_pago` | Medio de pago preferido o configurado. |
| `tipoOperacion` | Tipo de operación tributaria o comercial; validar valores. |
| `cliente_predeterminado` | Marca al tercero como genérico o predeterminado. |
| `legalidad` | Configuración fiscal de legalidad para documentos electrónicos. |
| `regimenImpuesto` | Régimen de impuestos usado por integraciones tributarias. |
| `fecha_vencimiento_codigo_turismo` | Fecha de vencimiento del registro de turismo. |
| `codigo_turismo` | Código del registro de turismo. |
| `alias` | Nombre corto o comercial alternativo. |
| `horario` | Horario asociado al tercero; la estructura depende del dato almacenado. |
| `dias_vencimiento_cartera_cliente` | Plazo de cartera predeterminado para el cliente. |
| `es_consumidor_final` | Marca al tercero como consumidor final para reglas tributarias. |
| `genera_bonos` | Habilita la generación o acumulación de bonos. |
| `solo_remision2` | Restringe operaciones a una modalidad específica de remisión. |
| `tiene_documentos_asocisados` | Indica si existen documentos asociados; conserva el nombre del campo del contrato. |
| `telefonos` | Hasta tres teléfonos registrados como arreglo. |
| `correos` | Hasta dos correos electrónicos registrados como arreglo. |
| `tipo_identificacion` | Datos relacionados del tipo de identificación. |
| `tipo_persona` | Datos relacionados de la clasificación de persona. |
| `estado_civil` | Datos relacionados del estado civil. |
| `estrato_social` | Datos relacionados del estrato social. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "tipo_tercero": 1,
  "body": {
    "columnas": [
      "id_cliente",
      "nombre_cliente",
      "identificacion",
      "telefonos",
      "correos"
    ]
  }
}
```

**Respuesta esperada:** { pagina: integer, cantidad: integer, terceros: Tercero[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "terceros": []
}
```

- telefonos y correos se proyectan como arreglos; las columnas de relaciones se proyectan como objetos.
- No incluya NIT, teléfonos, correos ni nombres en las etiquetas de métricas de caché.
- cantidad_registros es obligatorio según el contrato actual del servidor.
- El cuerpo debe contener únicamente un arreglo columnas no vacío y sin duplicados.
- Se rechazan las columnas desconocidas.

**Peticiones habituales:** Clientes.

### `terceros-crear`: Guardar tercero

**Para qué sirve:** Guardar tercero.

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

### `terceros-actualizar`: Guardar tercero

**Para qué sirve:** Guardar tercero.

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

## Cartera

### `finanzas-cartera-cobrar-busquedas`: Buscar cuentas por cobrar y por pagar

**Para qué sirve:** Buscar cuentas por cobrar y por pagar. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'cartera', resultados: DocumentoCartera[], totales: { total_deuda: number, total_abono: number, total_pendiente: number } }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "cartera",
  "resultados": [],
  "totales": {
    "total_deuda": 0,
    "total_abono": 0,
    "total_pendiente": 0
  }
}
```

- Los totales globales abarcan todos los registros filtrados, independientemente de la página actual.
- Se excluyen los documentos anulados, inactivos, con saldos no positivos, de clientes internos y de clientes predeterminados.
- Las respuestas financieras no deben usar la directiva stale-if-error sin una decisión explícita.
- route-fixed-selector es obligatorio y debe ser 0 o 1.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Cuentas por cobrar; Cuentas por pagar; Cuentas por cobrar vencidas.

### `finanzas-cartera-pagar-busquedas`: Buscar cuentas por cobrar y por pagar

**Para qué sirve:** Buscar cuentas por cobrar y por pagar. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'cartera', resultados: DocumentoCartera[], totales: { total_deuda: number, total_abono: number, total_pendiente: number } }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "cartera",
  "resultados": [],
  "totales": {
    "total_deuda": 0,
    "total_abono": 0,
    "total_pendiente": 0
  }
}
```

- Los totales globales abarcan todos los registros filtrados, independientemente de la página actual.
- Se excluyen los documentos anulados, inactivos, con saldos no positivos, de clientes internos y de clientes predeterminados.
- Las respuestas financieras no deben usar la directiva stale-if-error sin una decisión explícita.
- route-fixed-selector es obligatorio y debe ser 0 o 1.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.

**Peticiones habituales:** Cuentas por cobrar; Cuentas por pagar; Cuentas por cobrar vencidas.

### `finanzas-resumen-cobrar-busquedas`: Resumir saldos por tercero

**Para qué sirve:** Resumir saldos por tercero. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'resumen_terceros', resultados: SaldoTercero[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "resumen_terceros",
  "resultados": []
}
```

- Los saldos se calculan como SUM(total_deuda) - SUM(total_abono) sobre el mismo conjunto filtrado.
- Las cuentas por cobrar y por pagar nunca se mezclan.
- route-fixed-selector es obligatorio y debe ser 0 o 1.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Resumen de cuentas por cobrar; Resumen de cuentas por pagar.

### `finanzas-resumen-pagar-busquedas`: Resumir saldos por tercero

**Para qué sirve:** Resumir saldos por tercero. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'resumen_terceros', resultados: SaldoTercero[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "resumen_terceros",
  "resultados": []
}
```

- Los saldos se calculan como SUM(total_deuda) - SUM(total_abono) sobre el mismo conjunto filtrado.
- Las cuentas por cobrar y por pagar nunca se mezclan.
- route-fixed-selector es obligatorio y debe ser 0 o 1.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Resumen de cuentas por cobrar; Resumen de cuentas por pagar.

## Comandas

### `restaurante-comandas-busquedas`: Obtener comandas de cocina

**Para qué sirve:** Obtener comandas de cocina. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'comandas', resultados: ComandaCocina[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "comandas",
  "resultados": []
}
```

- Solo se devuelven comandas de cocina activas cuyo estado sea diferente de 4.
- id_sucursal es obligatorio.
- grupos no debe estar vacío, debe contener valores únicos y limitarse al catálogo.

**Peticiones habituales:** Comandas activas de la sucursal.

### `restaurante-platos-eliminados-busquedas`: Buscar platos eliminados

**Para qué sirve:** Buscar platos eliminados. Su resultado principal es `resultados`.

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

**Respuesta esperada:** { pagina: integer, cantidad: integer, tipo_consulta: 'platos_eliminados', resultados: AuditoriaPlatoEliminado[] }.

**Ejemplo de respuesta:**

```json
{
  "pagina": 0,
  "cantidad": 0,
  "tipo_consulta": "platos_eliminados",
  "resultados": []
}
```

- El punto de acceso expone únicamente campos respaldados por la tabla de auditoría de eliminación de platos.
- id_sucursal es obligatorio.
- Los filtros de fecha deben expresarse en milisegundos desde la época Unix.
- grupos no debe estar vacío y debe contener valores únicos.

**Peticiones habituales:** Auditoría de eliminaciones por sucursal.
