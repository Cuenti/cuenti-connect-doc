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
| Productos e inventario | `consultaProductoPaginadaMCP`, `grabarMovimientoArr` |
| Categorías e impuestos | `buscarCategorias`, `actualizarImpuestosLicores`, `consultarImpuestoCuenti` |
| Terceros | `buscarTercero`, `guardarTercero` |
| Maestros | `buscarImpuestos`, `buscarBancos`, `buscarMediosPago`, `buscarConsecutivos`, `buscarSucursales`, `buscarEmpleados`, `consultarMarcasActivas`, `consultarMarcaPorId` |
| Facturas e historiales | `buscarTransacciones`, `buscarProductosComprados`, `buscarDescuentos`, `buscarConsolidado`, `grabarDocumentoSimple` |
| Cartera | `buscarCartera`, `buscarResumenTerceros` |
| Comandas | `obtenerComandas`, `platosEliminados` |

## Productos e inventario

### `consultaProductoPaginadaMCP`: Buscar productos paginados

**Para qué sirve:** Buscar productos paginados. Su resultado principal es `productos`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `id_sucursal` | Sí | número entero; mínimo `1` |
| `pagina` | Sí | número entero; mínimo `0` |
| `total` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_ingrediente` | No | `0`, `1`; valor habitual `0`; Solo el valor 1 incluye resultados de ingredientes. |
| `nombre_producto` | No | texto; coincidencia parcial |
| `id_producto` | No | número entero; mínimo `1`; coincidencia exacta; Debe ser mayor que cero cuando se proporciona. |
| `sku` | No | texto; coincidencia exacta; Los valores vacíos se ignoran. |
| `codigo_barras` | No | texto; coincidencia exacta |
| `id_categoria` | No | número entero; coincidencia exacta |
| `nombre_categoria` | No | texto; coincidencia parcial |
| `id_marca` | No | número entero; coincidencia exacta |
| `nombre_marca` | No | texto; coincidencia parcial |

**Ejemplo de argumentos:**

```json
{
  "id_sucursal": 1,
  "pagina": 0,
  "total": 30,
  "nombre_producto": "Producto"
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
      "id_producto": 25,
      "nombre": "Producto",
      "sku": "SKU-25",
      "existencias": 10,
      "precio_venta": 15000
    }
  ]
}
```

**Peticiones habituales:** Por nombre de producto; Por ID y SKU.

### `grabarMovimientoArr`: Registrar conteo de inventario

**Para qué sirve:** Registrar conteo de inventario.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

Envía una lista con entre 1 y 1000 elementos.

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `nombre` | Sí | texto | Nombre visible del registro. |
| `nota` | Sí | texto | Observaciones internas sobre el tercero. |
| `id_concepto` | Sí | `-1`; valor habitual `-1` | Identificador del concepto contable o de inventario aplicado. |
| `es_entrada` | Sí | `1`; valor habitual `1` | Indica que el movimiento registra una entrada de inventario. |
| `cantidad` | Sí | número; mínimo `0` | Conteos agregados de registros o transacciones. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal principal o de creación del tercero. |
| `id_bodega` | Sí | número entero; mínimo `1` | Identificador de la bodega asociada. |
| `id_producto` | Sí | número entero; mínimo `1` | Identificador maestro del producto. |
| `fecha_registro` | Sí | fecha y hora en milisegundos Unix | Fecha de creación del tercero. |
| `id_centro_costo` | No | número entero; mínimo `1` | Centro de costo predeterminado para operaciones del tercero. |

- id_bodega debe ser igual a id_sucursal.
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
      "fecha_registro": 1735689600000
    }
  ]
}
```

**Respuesta esperada:** Mensaje { message: string, type: integer, retorno?: string }.

**Ejemplo de respuesta:**

```json
{
  "message": "save",
  "type": 1,
  "retorno": ""
}
```

**Peticiones habituales:** Conteo de un producto.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

## Categorías e impuestos

### `buscarCategorias`: Buscar categorías

**Para qué sirve:** Buscar categorías. Su resultado principal es `categorias`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_categoria` | Identificador único de la categoría. |
| `nombre_categoria` | Nombre visible de la categoría. |
| `es_activo` | Estado operativo de la categoría. |
| `fecha_registro` | Momento de creación de la categoría. |
| `id_imagen` | Identificador de la imagen asociada. |
| `es_visible_tienda` | Indica si la categoría puede mostrarse en la tienda. |
| `codigo_producto_dian` | Código de producto o clasificación usado por la integración DIAN. |
| `mostrar_tienda_linea` | Controla la visualización en la tienda en línea. |
| `id_categoria_padre` | Identificador de la categoría superior; vacío ubica el nodo como raíz. |
| `metadata` | Información adicional de la categoría según los datos históricos. |
| `alias` | Nombre alternativo o slug funcional de la categoría. |
| `mostrar_catalogo_linea` | Controla la visualización en el catálogo en línea. |
| `sucursales` | Sucursales asociadas; puede ser arreglo, objeto, string histórico o null. |
| `alerta_vencimiento_lotes` | Controla alertas de vencimiento de lotes de la categoría. |
| `es_visible_produccion` | Indica si la categoría aparece en procesos de producción. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_categoria",
      "nombre_categoria",
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

**Peticiones habituales:** Árbol de categorías activas.

### `actualizarImpuestosLicores`: Actualizar impuestos de licores

**Para qué sirve:** Actualizar impuestos de licores.

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

**Peticiones habituales:** Actualización parcial de impuestos.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

### `consultarImpuestoCuenti`: Consultar impuesto por ID

**Para qué sirve:** Consultar impuesto por ID.

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

**Peticiones habituales:** Impuesto por ID.

## Terceros

### `buscarTercero`: Buscar terceros

**Para qué sirve:** Buscar terceros. Su resultado principal es `terceros`.

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
| `sexo` | Clasificación registrada para sexo; validar catálogo legacy. |
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
| `solo_remision2` | Restringe operaciones a una modalidad legacy de remisión. |
| `tiene_documentos_asocisados` | Indica si existen documentos asociados; conserva el error ortográfico legacy. |
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

**Peticiones habituales:** Clientes.

### `guardarTercero`: Guardar tercero

**Para qué sirve:** Guardar tercero.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `id_cliente` | Sí | número entero | Use -1 para crear y un ID positivo para actualizar. |
| `nombre_cliente` | Sí | texto | Nombre completo o razón social del tercero. |
| `id_tipo_persona` | Sí | texto | Clasificación de persona requerida en creación. |
| `identificacion` | Sí | texto | Documento requerido en creación. |
| `id_empresa_portal` | No | número entero | Empresa del portal vinculada al tercero. |
| `id_usuario_portal` | No | número entero | Usuario del portal vinculado al tercero. |
| `primer_nombre` | No | texto | Primer nombre de una persona natural. |
| `segundo_nombre` | No | texto | Segundo nombre de una persona natural. |
| `primer_apellido` | No | texto | Primer apellido de una persona natural. |
| `segundo_apellido` | No | texto | Segundo apellido de una persona natural. |
| `direccion` | No | texto | Dirección principal del tercero. |
| `telefono1` | No | texto | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `telefono2` | No | texto | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `telefono3` | No | texto | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `email1` | No | texto | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `email2` | No | texto | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `sitio_web` | No | texto | Sitio web registrado. |
| `facebook` | No | texto | Perfil o referencia de Facebook. |
| `twitter` | No | texto | Perfil o referencia de X/Twitter. |
| `instagram` | No | texto | Perfil o referencia de Instagram. |
| `snapchat` | No | texto | Perfil o referencia de Snapchat. |
| `puntos_acumulados` | No | número entero | Puntos acumulados en programas de fidelización. |
| `nota` | No | texto | Observaciones internas sobre el tercero. |
| `es_activo` | No | texto | Estado operativo del tercero. |
| `fecha_registro` | No | fecha y hora en milisegundos Unix | Fecha de creación del tercero. |
| `id_lista_precios` | No | número entero | Lista de precios asignada al tercero. |
| `id_ruta_despacho` | No | número entero | Ruta de despacho asociada. |
| `es_cliente` | No | número entero | Indica que el tercero puede comprar a la empresa. |
| `es_proveedor` | No | número entero | Indica que el tercero puede suministrar a la empresa. |
| `ciudad` | No | texto | Ciudad registrada; el formato depende del catálogo geográfico. |
| `zona` | No | texto | Zona comercial, logística o geográfica asociada. |
| `contacto` | No | texto | Nombre o referencia del contacto principal. |
| `clave_portal` | No | texto | Contraseña del portal; se cifra antes de persistir y nunca debe exponerse. |
| `codigo_interno` | No | texto | Código interno asignado por la empresa. |
| `numero_matricula` | No | texto | Número de matrícula mercantil u otro registro equivalente. |
| `id_estado_civil` | No | número entero | Identificador del estado civil seleccionado. |
| `id_estrato_social` | No | número entero | Identificador del estrato social seleccionado. |
| `id_clase_cliente` | No | número entero | Clasificación comercial del cliente. |
| `id_tipo_cliente` | No | número entero | Tipo de cliente dentro de la segmentación configurada. |
| `fecha_nacimiento` | No | fecha y hora en milisegundos Unix | Fecha de nacimiento de una persona natural. |
| `sexo` | No | texto | Clasificación registrada para sexo; validar catálogo legacy. |
| `saldo_bono` | No | número | Saldo disponible en bonos asociado al tercero. |
| `permite_cartera_vencida` | No | texto | Indica si se permiten operaciones con cartera vencida. |
| `id_centro_costo` | No | número entero | Centro de costo predeterminado para operaciones del tercero. |
| `permite_saldo_cartera` | No | texto | Habilita el manejo de saldos de cartera. |
| `cupo_cartera` | No | número | Límite de crédito autorizado. |
| `permite_cartera` | No | texto | Habilita operaciones a crédito para el tercero. |
| `id_tipo_retencion_ventas` | No | número entero | Tipo de retención predeterminado para ventas. |
| `id_tipo_retencion_compra` | No | número entero | Tipo de retención predeterminado para compras. |
| `id_sucursal` | No | número entero | Sucursal principal o de creación del tercero. |
| `id_vendedor` | No | número entero | Vendedor asignado. |
| `envioSmsCartera` | No | texto | Configura el envío de SMS relacionados con cartera. |
| `envioSmsProducto` | No | texto | Configura el envío de SMS relacionados con productos. |
| `pais` | No | texto | País registrado. |
| `departamento` | No | texto | Departamento, estado o región registrada. |
| `regimen` | No | número entero | Régimen tributario; validar valores contra el catálogo fiscal. |
| `id_tipo_identificacion` | No | texto | Identificador del tipo de documento seleccionado. |
| `medio_pago` | No | número entero | Medio de pago preferido o configurado. |
| `tipoOperacion` | No | texto | Tipo de operación tributaria o comercial; validar valores. |
| `cliente_predeterminado` | No | texto | Marca al tercero como genérico o predeterminado. |
| `legalidad` | No | número entero | Configuración fiscal de legalidad para documentos electrónicos. |
| `regimenImpuesto` | No | número entero | Régimen de impuestos usado por integraciones tributarias. |
| `fecha_vencimiento_codigo_turismo` | No | fecha y hora en milisegundos Unix | Fecha de vencimiento del registro de turismo. |
| `codigo_turismo` | No | número entero | Código del registro de turismo. |
| `alias` | No | texto | Nombre corto o comercial alternativo. |
| `horario` | No | fecha y hora en milisegundos Unix | Horario asociado al tercero; la estructura depende del dato almacenado. |
| `dias_vencimiento_cartera_cliente` | No | número entero | Plazo de cartera predeterminado para el cliente. |
| `es_consumidor_final` | No | texto | Marca al tercero como consumidor final para reglas tributarias. |
| `genera_bonos` | No | número entero | Habilita la generación o acumulación de bonos. |
| `solo_remision2` | No | número entero | Restringe operaciones a una modalidad legacy de remisión. |
| `telefonos` | Sí | array | Hasta tres teléfonos registrados como arreglo. |
| `correos` | Sí | array | Hasta dos correos electrónicos registrados como arreglo. |
| `lstContactoCliente` | No | array | Información disponible en la respuesta; confirma su significado antes de interpretarla. |
| `id_empleado` | No | número entero | Identificador interno del empleado. |

Para crear: id_cliente=-1; nombre_cliente; identificacion; id_tipo_persona; es_cliente=1 o es_proveedor=1; al menos un teléfono; al menos un correo.
Para actualizar: id_cliente debe ser mayor que cero; Se requiere al menos un campo editable; Las actualizaciones son parciales.

**Ejemplo de argumentos:**

```json
{
  "body": {
    "id_cliente": -1,
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
  "retorno": "<id_cliente>"
}
```

**Peticiones habituales:** Crear; Actualización parcial.

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

## Maestros

### `buscarImpuestos`: Buscar impuestos

**Para qué sirve:** Buscar impuestos. Su resultado principal es `impuestos`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

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
| `id_plan_cuenta_imp_compa_devolucion` | Cuenta para impuestos en devoluciones de compra; conserva el nombre legacy. |
| `id_plan_cuenta_imp_gasto_devolucion` | Cuenta para impuestos en devoluciones de gastos. |
| `id_plan_cuentas_gasto` | Cuenta de gasto asociada al impuesto. |
| `id_plan_cuenta_compra_item` | Cuenta aplicada al ítem de compra. |
| `clasificacion_tributaria` | Clasificación usada en reglas o reportes tributarios; validar valores por país. |
| `codigo` | Código interno o fiscal del impuesto. |
| `codigo_tipo_impuesto` | Código del tipo de impuesto para integración fiscal. |
| `nombre_codigo_impuesto` | Nombre descriptivo del código fiscal asociado. |
| `pais` | País al que aplica la configuración tributaria. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_impuesto",
      "nombre_impuesto",
      "valor_impuesto"
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

**Peticiones habituales:** Impuestos activos.

### `buscarBancos`: Buscar bancos

**Para qué sirve:** Buscar bancos. Su resultado principal es `bancos`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

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
| `config` | Configuración adicional, por ejemplo empleados autorizados. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_banco",
      "nombre",
      "numero_cuenta",
      "saldo",
      "config"
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

**Peticiones habituales:** Bancos activos.

### `buscarMediosPago`: Buscar medios de pago

**Para qué sirve:** Buscar medios de pago. Su resultado principal es `medios_pago`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

**Información que puedes pedir en `columnas`**

| Columna | Significado |
| --- | --- |
| `id_medio_pago` | Identificador interno del medio de pago. |
| `nombre_medio_pago` | Nombre visible del medio de pago. |
| `nota` | Observaciones de configuración. |
| `es_activo` | Estado operativo del medio de pago. |
| `codigo` | Código interno del medio de pago. |
| `id_sucursal` | Sucursal a la que pertenece o aplica. |
| `comision` | Comisión configurada; validar si se expresa como porcentaje o importe. |
| `codigo_pago_fisco` | Código fiscal equivalente del medio de pago. |
| `config` | Configuración adicional, por ejemplo bancos permitidos. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_medio_pago",
      "nombre_medio_pago",
      "config"
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

**Peticiones habituales:** Medios de pago activos con configuración.

### `buscarConsecutivos`: Buscar consecutivos de documentos

**Para qué sirve:** Buscar consecutivos de documentos. Su resultado principal es `consecutivos`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

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

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_consecutivo",
      "nombre_consecutivo",
      "prefijo",
      "numero"
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

**Peticiones habituales:** Consecutivos activos.

### `buscarSucursales`: Buscar sucursales

**Para qué sirve:** Buscar sucursales. Su resultado principal es `sucursales`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

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
| `reondeoTotales` | Control de redondeo de totales; conserva el nombre legacy. |
| `modificicar_precio_minimos_otras_sucursales` | Controla cambios de precios mínimos de otras sucursales; conserva la ortografía legacy. |
| `modificicar_descuento_maximo_otras_sucursales` | Controla cambios de descuentos máximos de otras sucursales; conserva la ortografía legacy. |
| `actualizarPrecioVentaSucursales` | Controla la propagación de precios de venta entre sucursales. |
| `activar_venta_compra_licores` | Habilita reglas especiales de compra y venta de licores. |
| `actualizarPrecioCostoSucursales` | Controla la propagación de precios de costo entre sucursales. |
| `vender_ip_estampilla` | Control relacionado con venta y estampilla; validar la sigla IP. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_sucursal",
      "nombre_sucursal",
      "nota",
      "simbolo_moneda",
      "digitos_decimales",
      "reondeoTotales",
      "modificicar_precio_minimos_otras_sucursales",
      "modificicar_descuento_maximo_otras_sucursales",
      "actualizarPrecioVentaSucursales",
      "activar_venta_compra_licores",
      "actualizarPrecioCostoSucursales",
      "vender_ip_estampilla"
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

**Peticiones habituales:** Sucursales activas con configuración comercial.

### `buscarEmpleados`: Buscar empleados

**Para qué sirve:** Buscar empleados. Su resultado principal es `empleados`.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `pagina` | No | número entero; mínimo `0`; valor habitual `0` |
| `cantidad_registros` | No | número entero; mínimo `1`; máximo `1000`; valor habitual `30` |
| `es_activo` | Sí | `0`, `1` |

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
| `sincroniazar_datos` | Control de sincronización; conserva el error ortográfico legacy. |
| `tipo_usuario` | Rol o tipo de usuario; validar catálogo de seguridad. |
| `comision` | Comisión asignada al empleado. |
| `id_bodega` | Bodega predeterminada. |
| `tipo_comision` | Forma de cálculo de la comisión. |
| `modePosDefecto` | Modo POS predeterminado; conserva el nombre legacy. |
| `comision_antes_iva` | Indica si la comisión se calcula antes del IVA. |
| `identificacion` | Documento de identificación del empleado. |
| `mostrar_mesa` | Habilita la visualización o selección de mesas. |
| `es_contador` | Marca al empleado como contador. |
| `solo_bodegas_sucursal` | Restringe las bodegas a las de su sucursal. |
| `obligar_apertura_caja` | Exige apertura de caja antes de operar. |
| `cerrar_session_cierre` | Controla el cierre de sesión durante un cierre; conserva session legacy. |
| `es_tienda` | Clasifica al usuario para operación de tienda. |
| `codigo_empleado` | Código interno del empleado. |
| `sucursal_adicional` | Sucursales y bodegas adicionales permitidas. |
| `cierra_caja` | Autoriza o configura el cierre de caja. |
| `ventas_solo_credito` | Restringe ventas a modalidad crédito. |
| `vendedor_multi_sucursal` | Habilita operación comercial en varias sucursales. |

**Ejemplo de argumentos:**

```json
{
  "pagina": 0,
  "cantidad_registros": 30,
  "es_activo": 1,
  "body": {
    "columnas": [
      "id_empleado",
      "nombre_completo",
      "sucursal_adicional"
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

**Peticiones habituales:** Empleados activos.

### `consultarMarcasActivas`: Consultar marcas activas

**Para qué sirve:** Consultar marcas activas.

**Tipo:** Consulta.

**Filtros disponibles**

| Dato | Obligatorio | Valores que acepta |
| --- | --- | --- |
| `es_activo` | Sí | `1`; valor habitual `1` |

**Ejemplo de argumentos:**

```json
{
  "es_activo": 1
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

**Peticiones habituales:** Marcas activas.

### `consultarMarcaPorId`: Consultar marca por ID

**Para qué sirve:** Consultar marca por ID.

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

**Peticiones habituales:** Marca por ID.

## Facturas e historiales

### `buscarTransacciones`: Buscar transacciones

**Para qué sirve:** Buscar transacciones. Su resultado principal es `resultados`.

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
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión); separado por comas |
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
  "tipo_documento": "1,9",
  "es_ingreso": 1,
  "es_nula": 0,
  "body": {
    "grupos": [
      "codigos",
      "fechas",
      "cliente",
      "totales",
      "impuestos",
      "estado"
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

**Peticiones habituales:** Historial de ventas; Factura completa por ID; Facturas anuladas.

### `buscarProductosComprados`: Buscar productos comprados

**Para qué sirve:** Buscar productos comprados. Su resultado principal es `resultados`.

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
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión) |
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

**Peticiones habituales:** Productos comprados por cliente.

### `buscarDescuentos`: Buscar descuentos

**Para qué sirve:** Buscar descuentos. Su resultado principal es `resultados`.

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
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión) |
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

**Peticiones habituales:** Descuentos de factura; Descuentos de producto.

### `buscarConsolidado`: Buscar historial consolidado

**Para qué sirve:** Buscar historial consolidado. Su resultado principal es `resultados`.

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
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión) |
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

**Peticiones habituales:** Por cliente; Por empleado; Por vendedor.

### `grabarDocumentoSimple`: Crear factura, compra, gasto o remisión

**Para qué sirve:** Crear factura, compra, gasto o remisión.

**Tipo:** Acción que modifica datos.

**Filtros:** no requiere filtros adicionales.

**Datos que acepta la acción**

| Dato | Obligatorio | Valores que acepta | Significado |
| --- | --- | --- | --- |
| `tipoDocumento` | Sí | `1` (factura), `7` (compra o gasto), `9` (remisión o prefactura) | Tipo de documento: factura, compra o gasto, o remisión/prefactura. |
| `type_match_producto` | Sí | `1`, `2`, `3`; valor habitual `1` | Define si el producto se identifica por ID, SKU o código de barras. |
| `id_consecutivo` | Sí | número entero; mínimo `1` | Identificador de la configuración de numeración. |
| `codigo_unico` | Sí | texto | Identificador numérico de integración; conserva los ceros iniciales. |
| `nota` | Sí | texto | Observaciones internas sobre el tercero. |
| `observacion` | Sí | texto | Observación general asociada al documento o movimiento. |
| `id_sucursal` | Sí | número entero; mínimo `1` | Sucursal principal o de creación del tercero. |
| `id_bodega` | Sí | número entero; mínimo `1` | Identificador de la bodega asociada. |
| `id_vendedor` | Sí | número entero; mínimo `1` | Vendedor asignado. |
| `id_empleado` | Sí | número entero; mínimo `1` | Identificador interno del empleado. |
| `objClienteMini` | Sí | object | Datos mínimos del tercero asociado al documento. |
| `objDetalle` | Sí | array | Líneas del documento con cantidades y totales de línea. |
| `lstPagos` | Sí | array | Pagos aplicados al documento; puede ser un arreglo vacío para crédito. |

- Una solicitud contiene un solo documento.
- objDetalle.total es el total de la línea; Cuenti registra internamente el precio unitario.
- cambiar_precio_compra=true actualiza el costo unitario y false conserva el costo actual.
- type_match_producto=1 usa id_producto, 2 usa code como SKU y 3 usa code como código de barras.
- Para gasto, tipoDocumento=7 y cada detalle usa id_plan_cuentas.

**Elegir type_match_producto**

En grabarDocumentoSimple, elige un solo modo para todas las líneas del documento. El modo determina si cada producto se busca por ID, SKU o código de barras.

| Valor | Campo en `objDetalle` | Úsalo cuando... | Regla |
| --- | --- | --- | --- |
| `1` | `objDetalle[].id_producto` | Cuando conoces el ID interno positivo del producto. | No envíes code. |
| `2` | `objDetalle[].code` | Cuando conoces el SKU del producto. | code contiene el SKU. No envíes id_producto. |
| `3` | `objDetalle[].code` | Cuando conoces el código de barras del producto. | code contiene el código de barras. No envíes id_producto. |

- Si no sabes qué identificador usar: consulta primero consultaProductoPaginadaMCP y usa el ID, SKU o código de barras que devuelva.
- Nunca envíes id_producto y code juntos en la misma línea.
- Para gastos, usa tipoDocumento=7, identifica la cuenta con id_plan_cuentas, omite los identificadores de producto y conserva type_match_producto=1.

### Modo 1: ID interno

```json
{
  "type_match_producto": 1,
  "objDetalle": [
    {
      "cantidad": 2,
      "id_producto": 25,
      "total": 30000
    }
  ]
}
```

### Modo 2: SKU

```json
{
  "type_match_producto": 2,
  "objDetalle": [
    {
      "cantidad": 2,
      "code": "SKU-25",
      "total": 30000
    }
  ]
}
```

### Modo 3: código de barras

```json
{
  "type_match_producto": 3,
  "objDetalle": [
    {
      "cantidad": 2,
      "code": "7701234567890",
      "total": 30000
    }
  ]
}
```

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
  "message": "save",
  "retorno": "opaque-value",
  "id_transacion": 511903,
  "url_interna": "...",
  "url_externa": "..."
}
```

**Antes de ejecutarla:** consulta el estado actual, explica el cambio y pide confirmación. Ejecútala una sola vez.

## Cartera

### `buscarCartera`: Buscar cuentas por cobrar y por pagar

**Para qué sirve:** Buscar cuentas por cobrar y por pagar. Su resultado principal es `resultados`.

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
| `es_ingreso` | Sí | `0` (por pagar), `1` (por cobrar) |
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión) |
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
  "es_ingreso": 1,
  "body": {
    "grupos": [
      "transaccion",
      "fechas",
      "tercero",
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

**Peticiones habituales:** Cuentas por cobrar; Cuentas por pagar; Cuentas por cobrar vencidas.

### `buscarResumenTerceros`: Resumir saldos por tercero

**Para qué sirve:** Resumir saldos por tercero. Su resultado principal es `resultados`.

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
| `es_ingreso` | Sí | `0`, `1` |
| `tipo_documento` | No | `1` (Factura), `7` (Compra), `9` (Prefactura / remisión) |
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
  "es_ingreso": 1,
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

**Peticiones habituales:** Resumen de cuentas por cobrar; Resumen de cuentas por pagar.

## Comandas

### `obtenerComandas`: Obtener comandas de cocina

**Para qué sirve:** Obtener comandas de cocina. Su resultado principal es `resultados`.

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
  - `numero_orden2`: Segunda referencia de orden legacy.
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
      "mesa",
      "producto",
      "empleado",
      "fecha",
      "estado"
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

**Peticiones habituales:** Comandas activas de la sucursal.

### `platosEliminados`: Buscar platos eliminados

**Para qué sirve:** Buscar platos eliminados. Su resultado principal es `resultados`.

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

**Peticiones habituales:** Auditoría de eliminaciones por sucursal.
