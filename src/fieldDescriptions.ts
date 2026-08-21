const pendingDescription =
  'Descripción pendiente; validar regla de negocio antes de interpretarlo.';

const groupDescriptions: Record<string, string> = {
  agrupacion: 'Identidad de la entidad usada para agrupar los resultados.',
  acta_entrega: 'Datos del acta de entrega asociada al documento.',
  adjuntos:
    'Archivos adjuntos asociados al documento; la respuesta los entrega como una lista embebida.',
  archivos:
    'Alias de adjuntos para solicitar la lista de archivos del documento.',
  bodegas: 'Bodegas relacionadas con el documento o la logística.',
  banco: 'Entidad bancaria y sus datos principales.',
  categoria: 'Categoría comercial asociada al producto.',
  cantidad: 'Conteos agregados de registros o transacciones.',
  cantidades:
    'Cantidades registradas y cantidades netas después de devoluciones.',
  cartera_cliente: 'Resumen de la cartera pendiente del tercero.',
  cliente: 'Identificación y datos de contacto del tercero del documento.',
  codigos: 'Identificadores y números que permiten localizar el registro.',
  comentarios:
    'Comentarios asociados al documento; se entregan como una lista embebida de cabecera.',
  configuracion: 'Configuración comercial o contable asociada a la línea.',
  contabilidad: 'Cuentas y configuración contable asociadas al registro.',
  contacto: 'Teléfonos, correos y datos de contacto del tercero.',
  comision: 'Comisión configurada y reglas de cálculo aplicadas al empleado.',
  consecutivo: 'Configuración de numeración usada por el documento.',
  cuenta: 'Cuenta bancaria y referencia contable asociada.',
  costos: 'Costos acumulados o proporcionales del producto comprado.',
  costo: 'Costo registrado para la línea del documento.',
  detalle: 'Bloques de información de las líneas del documento.',
  descuento: 'Valores y porcentajes de descuento aplicados.',
  documento: 'Referencias documentales y comerciales relacionadas.',
  documentos: 'Cantidad y estado de los documentos del conjunto.',
  empleado: 'Empleado que registró o gestionó la operación.',
  empresa: 'Datos compartidos de la empresa del contexto de respuesta.',
  estado: 'Indicadores del estado operativo, financiero o documental.',
  estado_electronico: 'Estado de envío, validación y contingencia electrónica.',
  factura_electronica:
    'Resultado y trazabilidad de la integración fiscal electrónica.',
  fecha: 'Fecha de registro del evento operativo.',
  fechas: 'Fechas del documento y cálculo de vencimiento.',
  facturacion_electronica:
    'Resultado y trazabilidad de la integración fiscal electrónica.',
  grupos: 'Conjunto de bloques funcionales solicitados para la respuesta.',
  impresion: 'Configuración de plantillas, contenido y opciones de impresión.',
  impuestos: 'Impuestos y tributos calculados para el documento o la línea.',
  impuesto: 'Impuesto principal aplicado al registro.',
  imagen: 'Referencia y URL de la imagen del producto.',
  inventario: 'Existencias y configuración de inventario del producto.',
  mesa: 'Identificación de la mesa y datos de sus comensales.',
  motivo: 'Nota o motivo registrado para la eliminación del plato.',
  moneda: 'Moneda y tasa de conversión del documento.',
  notas_credito: 'Notas crédito y líneas que modifican el documento.',
  nota: 'Observación general o específica del registro.',
  pedido: 'Referencias del pedido en línea y sus órdenes.',
  logistica: 'Datos de preparación, despacho y seguimiento logístico.',
  marca: 'Marca comercial asociada al producto.',
  medida: 'Unidad y presentación de medida del producto.',
  medio_pago: 'Medio de pago configurado o usado en la operación.',
  pagos: 'Comprobantes y movimientos aplicados como pago.',
  presentacion: 'Equivalencias y datos de la presentación comercial.',
  preparacion: 'Tiempos y estación de preparación de la comanda.',
  precios: 'Precios base, de venta y ajustes comerciales.',
  producto: 'Identificación, descripción y presentación del producto.',
  producto_ampliado:
    'Información adicional del producto, sanitaria y logística.',
  licores: 'Configuración comercial específica para compra y venta de licores.',
  politicas_precios: 'Políticas de precios aplicadas entre sucursales.',
  pos: 'Configuración operativa del punto de venta.',
  qr: 'Datos usados para construir o consultar el código QR.',
  retenciones: 'Retenciones aplicadas, sus bases, porcentajes y valores.',
  ruta_despacho: 'Ruta de despacho asignada al documento.',
  rangos: 'Rangos y límites de numeración configurados.',
  saldo: 'Deuda, abonos y pendiente financiero normalizado.',
  seriales: 'Seriales asociados a la línea del producto.',
  sucursal: 'Sucursal donde se originó o aplica la operación.',
  sucursal_configuracion:
    'Configuración de documentos y facturación de la sucursal.',
  sucursales: 'Relaciones y configuración asociadas a las sucursales.',
  permisos_caja:
    'Reglas de apertura, cierre y operación de la caja del empleado.',
  restaurante: 'Permisos y configuración del empleado para mesas.',
  roles: 'Indicadores de rol y capacidades operativas del empleado.',
  horario: 'Horario de ingreso y salida configurado para el empleado.',
  app_movil: 'Permisos de acceso del empleado a las aplicaciones móviles.',
  ventas_ext: 'Configuración extendida para la operación de ventas.',
  taller: 'Información del vehículo y del servicio de taller relacionado.',
  tercero: 'Identificación del tercero agrupado en cartera.',
  tributaria: 'Configuración fiscal y tributaria asociada al tercero.',
  totales: 'Importes agregados y saldos calculados del documento.',
  tienda: 'Configuración de publicación y visibilidad en la tienda.',
  transaccion:
    'Identificación y datos principales del documento transaccional.',
  vendedor: 'Vendedor comercial asociado a la operación.',
};

const commonFieldDescriptions: Record<string, string> = {
  alias: 'Nombre corto o comercial alternativo.',
  codigo: 'Código interno o de integración del registro.',
  codigo_barras: 'Código de barras principal o de la presentación consultada.',
  codigo_empleado: 'Código interno asignado al empleado.',
  codigo_sucursal: 'Código interno o de integración de la sucursal.',
  comision:
    'Comisión configurada; su unidad se interpreta con el tipo de comisión.',
  config:
    'Configuración adicional; JSON válido se entrega estructurado y el histórico inválido se conserva como texto.',
  correos: 'Lista de correos electrónicos registrados para el tercero.',
  descripcion: 'Descripción funcional o texto complementario del registro.',
  departamento: 'Departamento, estado o región registrada.',
  direccion: 'Dirección principal registrada.',
  es_activo: 'Indicador del estado operativo del registro.',
  es_bodega: 'Indica si la sucursal funciona como bodega.',
  es_cliente: 'Indica que el tercero puede operar como cliente.',
  es_contingencia: 'Indica emisión o numeración bajo contingencia.',
  es_devolucion:
    'Indica que el documento o línea corresponde a una devolución.',
  es_factura: 'Indica que el documento tiene naturaleza de factura.',
  es_factura_electronica:
    'Indica uso del consecutivo para factura electrónica.',
  es_ingreso: 'Dirección financiera: normalmente 1 por cobrar y 0 por pagar.',
  es_nula: 'Indica que el documento fue anulado.',
  es_proveedor: 'Indica que el tercero puede operar como proveedor.',
  es_visible_produccion:
    'Controla si la categoría aparece en vistas de producción.',
  es_visible_tienda: 'Controla si la categoría puede mostrarse en la tienda.',
  estado: 'Código del estado operativo de la línea o documento.',
  fecha_registro: 'Fecha y hora de creación o registro.',
  fecha_vencimiento: 'Fecha límite de pago o vencimiento de la autorización.',
  identificacion: 'Documento de identidad o identificación tributaria.',
  id_bodega: 'Identificador de la bodega asociada.',
  id_cliente: 'Identificador interno del tercero.',
  id_centro_costo: 'Identificador del centro de costo asociado.',
  id_consecutivo: 'Identificador de la configuración de numeración.',
  id_empleado: 'Identificador interno del empleado.',
  id_empresa_portal: 'Identificador de la empresa del portal vinculada.',
  id_estado_civil: 'Identificador del estado civil seleccionado.',
  id_estrato_social: 'Identificador del estrato social seleccionado.',
  id_imagen: 'Identificador del recurso de imagen.',
  id_producto: 'Identificador maestro del producto.',
  id_sucursal: 'Identificador interno de la sucursal.',
  id_tipo_identificacion: 'Identificador del tipo de documento seleccionado.',
  id_tipo_persona: 'Identificador de la clasificación de persona.',
  impuesto: 'Impuesto principal aplicado al registro.',
  impuestos: 'Impuestos asociados al registro.',
  marca: 'Marca asociada al producto o vehículo.',
  medio_pago: 'Medio de pago configurado o usado en la operación.',
  metadata:
    'Información adicional de la categoría; su estructura depende de los datos históricos.',
  nombre: 'Nombre visible del registro.',
  nombre_completo: 'Nombre completo del empleado.',
  nombre_empleado: 'Nombre visible del empleado.',
  nombre_producto: 'Nombre comercial del producto.',
  nombre_sucursal: 'Nombre visible de la sucursal.',
  nota: 'Observación o nota asociada al registro.',
  numero_cuenta:
    'Número de cuenta tratado como texto para conservar ceros iniciales; puede ser sensible.',
  numero_matricula:
    'Número de matrícula mercantil u otro registro equivalente.',
  pais: 'País registrado o país de aplicación.',
  prefijo: 'Prefijo que antecede la numeración documental.',
  saldo: 'Saldo registrado o pendiente financiero; puede ser sensible.',
  sku: 'Código interno o SKU usado para identificar el producto.',
  sucursales:
    'Configuración de sucursales; JSON válido se estructura y el histórico inválido se conserva como texto.',
  telefonos: 'Lista de teléfonos registrados para el tercero.',
  tipo_comision: 'Clasificación que define cómo se calcula la comisión.',
  tipo_documento:
    'Clasificación del documento según el catálogo transaccional.',
  tipo_impuesto:
    'Clasificación funcional del impuesto; validar códigos tributarios.',
  tipo_persona: 'Clasificación de persona natural, jurídica u otra.',
  total: 'Importe total persistido o calculado para el registro.',
  total_estampilla: 'Valor de estampilla asociado al producto o documento.',
  total_impoconsumo:
    'Valor del impuesto al consumo asociado al producto o documento.',
  total_impuestos: 'Suma de los impuestos principales del documento.',
  total_neto: 'Total neto del documento después de ajustes aplicables.',
  unidad: 'Unidad usada para expresar la medida o cantidad.',
  url_imagen: 'Dirección para consultar la imagen del producto.',
  id_concepto: 'Concepto contable del movimiento; el conteo usa -1.',
  es_entrada: 'Indica el sentido del movimiento; el conteo usa 1.',
  cantidad: 'Cantidad registrada en el movimiento o detalle.',
  code: 'SKU o código de barras según type_match_producto.',
  cambiar_precio_compra:
    'Indica si Cuenti actualiza el costo unitario de compra.',
  tipoDocumento: 'Tipo de documento: factura, compra/gasto o remisión.',
  type_match_producto:
    'Define si el producto se identifica por ID, SKU o código de barras.',
  codigo_unico: 'Código numérico único que conserva los ceros iniciales.',
  comentario: 'Texto del comentario asociado al documento.',
  empleado: 'Empleado asociado al comentario o a la operación.',
  etiqueta: 'Etiqueta visible del archivo adjunto.',
  objClienteMini: 'Datos mínimos del tercero asociado al documento.',
  objDetalle: 'Líneas del documento con cantidades y totales.',
  id_adjunto: 'Identificador del archivo adjunto asociado al documento.',
  id_comentario: 'Identificador del comentario asociado al documento.',
  lstPagos: 'Pagos aplicados; vacío representa una operación a crédito.',
  leido: 'Indica si el comentario fue marcado como leído.',
  nombre_real: 'Nombre real del archivo adjunto.',
  ruta: 'Ruta o URL del archivo adjunto.',
  tipo: 'Tipo MIME o clasificación del archivo adjunto.',
  precio_unidad: 'Valor numérico devuelto por el catálogo de marcas.',
  error: 'Mensaje de error devuelto por el catálogo, si aplica.',
};

const endpointFieldDescriptions: Record<string, Record<string, string>> = {
  actualizarImpuestosLicores: {
    id_producto:
      'Producto positivo y único que se actualizará dentro de la solicitud.',
    id_impuesto: 'Nuevo impuesto positivo asociado al producto en la sucursal.',
    total_estampilla: 'Valor no negativo de estampilla que se almacenará.',
    total_impoconsumo: 'Valor no negativo de impoconsumo que se almacenará.',
  },
  buscarCategorias: {
    id_categoria: 'Identificador único de la categoría.',
    nombre_categoria: 'Nombre visible de la categoría.',
    alias: 'Nombre alternativo o slug funcional de la categoría.',
    codigo_dian: 'Código de clasificación usado por la integración DIAN.',
    formato: 'Formato de presentación de la imagen o categoría.',
    url: 'Dirección del recurso asociado a la categoría.',
    es_activo: 'Estado operativo de la categoría.',
    fecha_registro: 'Momento de creación de la categoría.',
    id_imagen: 'Identificador de la imagen asociada.',
    es_visible_tienda: 'Indica si la categoría puede mostrarse en la tienda.',
    codigo_producto_dian:
      'Código de producto o clasificación usado por la integración DIAN.',
    mostrar_tienda_linea: 'Controla la visualización en la tienda en línea.',
    id_categoria_padre:
      'Identificador de la categoría superior; vacío ubica el nodo como raíz.',
    metadata:
      'Información adicional de la categoría según los datos históricos.',
    mostrar_catalogo_linea:
      'Controla la visualización en el catálogo en línea.',
    sucursales:
      'Sucursales asociadas; puede ser arreglo, objeto, string histórico o null.',
    alerta_vencimiento_lotes:
      'Controla alertas de vencimiento de lotes de la categoría.',
    visible_tienda: 'Controla la visibilidad de la categoría en la tienda.',
    visible_produccion:
      'Indica si la categoría aparece en procesos de producción.',
  },
  buscarTercero: {
    id_cliente: 'Identificador del tercero consultado.',
    nombre_cliente: 'Nombre completo o razón social principal.',
    identificacion: 'Documento de identidad o identificación tributaria.',
    id_empresa_portal: 'Empresa del portal vinculada al tercero.',
    id_usuario_portal: 'Usuario del portal vinculado al tercero.',
    primer_nombre: 'Primer nombre de una persona natural.',
    segundo_nombre: 'Segundo nombre de una persona natural.',
    primer_apellido: 'Primer apellido de una persona natural.',
    segundo_apellido: 'Segundo apellido de una persona natural.',
    direccion: 'Dirección principal del tercero.',
    sitio_web: 'Sitio web registrado.',
    facebook: 'Perfil o referencia de Facebook.',
    twitter: 'Perfil o referencia de X/Twitter.',
    instagram: 'Perfil o referencia de Instagram.',
    snapchat: 'Perfil o referencia de Snapchat.',
    puntos_acumulados: 'Puntos acumulados en programas de fidelización.',
    nota: 'Observaciones internas sobre el tercero.',
    es_activo: 'Estado operativo del tercero.',
    fecha_registro: 'Fecha de creación del tercero.',
    fecha_actualizacion: 'Fecha de la última actualización registrada.',
    id_lista_precios: 'Lista de precios asignada al tercero.',
    id_ruta_despacho: 'Ruta de despacho asociada.',
    es_cliente: 'Indica que el tercero puede comprar a la empresa.',
    es_proveedor: 'Indica que el tercero puede suministrar a la empresa.',
    ciudad: 'Ciudad registrada; el formato depende del catálogo geográfico.',
    zona: 'Zona comercial, logística o geográfica asociada.',
    contacto: 'Nombre o referencia del contacto principal.',
    codigo_interno: 'Código interno asignado por la empresa.',
    numero_matricula:
      'Número de matrícula mercantil u otro registro equivalente.',
    id_clase_cliente: 'Clasificación comercial del cliente.',
    id_tipo_cliente: 'Tipo de cliente dentro de la segmentación configurada.',
    fecha_nacimiento: 'Fecha de nacimiento de una persona natural.',
    sexo: 'Clasificación registrada para sexo; validar el catálogo aplicable.',
    saldo_bono: 'Saldo disponible en bonos asociado al tercero.',
    permite_cartera_vencida:
      'Indica si se permiten operaciones con cartera vencida.',
    id_centro_costo:
      'Centro de costo predeterminado para operaciones del tercero.',
    permite_saldo_cartera: 'Habilita el manejo de saldos de cartera.',
    cupo_cartera: 'Límite de crédito autorizado.',
    permite_cartera: 'Habilita operaciones a crédito para el tercero.',
    id_tipo_retencion_ventas: 'Tipo de retención predeterminado para ventas.',
    id_tipo_retencion_compra: 'Tipo de retención predeterminado para compras.',
    id_sucursal: 'Sucursal principal o de creación del tercero.',
    id_vendedor: 'Vendedor asignado.',
    envioSmsCartera: 'Configura el envío de SMS relacionados con cartera.',
    envioSmsProducto: 'Configura el envío de SMS relacionados con productos.',
    pais: 'País registrado.',
    departamento: 'Departamento, estado o región registrada.',
    regimen: 'Régimen tributario; validar valores contra el catálogo fiscal.',
    medio_pago: 'Medio de pago preferido o configurado.',
    tipoOperacion: 'Tipo de operación tributaria o comercial; validar valores.',
    cliente_predeterminado: 'Marca al tercero como genérico o predeterminado.',
    legalidad:
      'Configuración fiscal de legalidad para documentos electrónicos.',
    regimenImpuesto:
      'Régimen de impuestos usado por integraciones tributarias.',
    fecha_vencimiento_codigo_turismo:
      'Fecha de vencimiento del registro de turismo.',
    codigo_turismo: 'Código del registro de turismo.',
    alias: 'Nombre corto o comercial alternativo.',
    horario:
      'Horario asociado al tercero; la estructura depende del dato almacenado.',
    dias_vencimiento_cartera_cliente:
      'Plazo de cartera predeterminado para el cliente.',
    es_consumidor_final:
      'Marca al tercero como consumidor final para reglas tributarias.',
    genera_bonos: 'Habilita la generación o acumulación de bonos.',
    solo_remision2:
      'Restringe operaciones a una modalidad específica de remisión.',
    tiene_documentos_asocisados:
      'Indica si existen documentos asociados; conserva el nombre del campo del contrato.',
    telefonos: 'Hasta tres teléfonos registrados como arreglo.',
    correos: 'Hasta dos correos electrónicos registrados como arreglo.',
    tipo_identificacion: 'Datos relacionados del tipo de identificación.',
    tipo_persona: 'Datos relacionados de la clasificación de persona.',
    estado_civil: 'Datos relacionados del estado civil.',
    estrato_social: 'Datos relacionados del estrato social.',
  },
  guardarTercero: {
    id_cliente: 'Use -1 para crear y un ID positivo para actualizar.',
    nombre_cliente: 'Nombre completo o razón social del tercero.',
    id_tipo_persona: 'Clasificación de persona requerida en creación.',
    identificacion: 'Documento requerido en creación.',
    fecha_registro:
      'Fecha de registro enviada como entero en milisegundos desde epoch.',
    fecha_nacimiento:
      'Fecha de nacimiento enviada como entero en milisegundos desde epoch; puede ser null.',
    fecha_vencimiento_codigo_turismo:
      'Vencimiento del código de turismo enviado como entero en milisegundos desde epoch; puede ser null.',
    horario:
      'Hora asociada al tercero enviada como entero en milisegundos desde epoch; puede ser null.',
    telefono1:
      'Primer número telefónico como texto; puede estar vacío o ser null.',
    telefono2:
      'Segundo número telefónico como texto; puede estar vacío o ser null.',
    telefono3:
      'Tercer número telefónico como texto; puede estar vacío o ser null.',
    email1:
      'Primer correo electrónico como texto; puede estar vacío o ser null.',
    email2:
      'Segundo correo electrónico como texto; puede estar vacío o ser null.',
    lstContactoCliente:
      'Arreglo opcional con los contactos adicionales del tercero.',
    clave_portal:
      'Contraseña del portal; se cifra antes de persistir y nunca debe exponerse.',
    id_estado_civil: 'Identificador del estado civil seleccionado.',
    id_estrato_social: 'Identificador del estrato social seleccionado.',
    id_tipo_identificacion: 'Identificador del tipo de documento seleccionado.',
  },
  buscarBancos: {
    id_banco: 'Identificador de la cuenta bancaria, caja o recurso financiero.',
    nombre: 'Nombre visible del banco o caja.',
    numero_cuenta:
      'Número de cuenta como texto; puede contener información empresarial sensible.',
    saldo:
      'Saldo registrado de la cuenta; no necesariamente es conciliado en tiempo real.',
    descripcion: 'Descripción funcional de la cuenta.',
    es_activo: 'Estado operativo de la cuenta.',
    id_plan_cuenta: 'Cuenta contable relacionada.',
    codigo: 'Código interno del banco o caja.',
    id_sucursal: 'Sucursal propietaria o asociada.',
    config: 'Configuración adicional, por ejemplo empleados autorizados.',
  },
  buscarMediosPago: {
    id_medio_pago: 'Identificador interno del medio de pago.',
    nombre_medio_pago: 'Nombre visible del medio de pago.',
    nota: 'Observaciones de configuración.',
    es_activo: 'Estado operativo del medio de pago.',
    codigo: 'Código interno del medio de pago.',
    id_sucursal: 'Sucursal a la que pertenece o aplica.',
    comision:
      'Comisión configurada; validar si se expresa como porcentaje o importe.',
    codigo_pago_fisco: 'Código fiscal equivalente del medio de pago.',
    config: 'Configuración adicional, por ejemplo bancos permitidos.',
  },
  buscarImpuestos: {
    id_impuesto: 'Identificador de la configuración de impuesto.',
    nombre_impuesto: 'Nombre visible del impuesto.',
    valor_impuesto:
      'Tarifa o valor configurado; validar su unidad con el tipo de impuesto.',
    nota: 'Observaciones internas del impuesto.',
    es_activo: 'Estado operativo de la configuración tributaria.',
    fecha_registro: 'Momento de creación de la configuración.',
    tipo_impuesto: 'Tipo funcional del impuesto; validar códigos tributarios.',
    id_plan_cuentas_venta: 'Cuenta contable usada para impuestos en ventas.',
    id_plan_cuentas_pasivo: 'Cuenta de pasivo asociada al impuesto.',
    id_plan_cuentas_activo: 'Cuenta de activo asociada al impuesto.',
    id_plan_cuentas_compra: 'Cuenta contable usada para impuestos en compras.',
    id_plan_cuenta_imp_venta_devolucion:
      'Cuenta para impuestos en devoluciones de ventas.',
    id_plan_cuenta_imp_compa_devolucion:
      'Cuenta para impuestos en devoluciones de compra.',
    id_plan_cuenta_imp_gasto_devolucion:
      'Cuenta para impuestos en devoluciones de gastos.',
    id_plan_cuentas_gasto: 'Cuenta de gasto asociada al impuesto.',
    id_plan_cuenta_compra_item: 'Cuenta aplicada al ítem de compra.',
    clasificacion_tributaria:
      'Clasificación usada en reglas o reportes tributarios; validar valores por país.',
    codigo: 'Código interno o fiscal del impuesto.',
    codigo_tipo_impuesto:
      'Código del tipo de impuesto para integración fiscal.',
    nombre_codigo_impuesto: 'Nombre descriptivo del código fiscal asociado.',
    pais: 'País al que aplica la configuración tributaria.',
  },
  buscarConsecutivos: {
    id_consecutivo: 'Identificador de la numeración documental.',
    nombre_consecutivo: 'Nombre administrativo del consecutivo.',
    prefijo: 'Prefijo de la numeración visible.',
    numero:
      'Número actual o siguiente según la regla del módulo; consultar no lo incrementa.',
    alertar_numero:
      'Umbral para alertar proximidad al agotamiento de la numeración.',
    facturaOnline: 'Indica habilitación de facturación en línea.',
    es_activo: 'Estado operativo del consecutivo.',
    fecha_registro: 'Momento de creación.',
    resolucion: 'Resolución que autoriza la numeración.',
    id_sucursal: 'Sucursal a la que pertenece.',
    inicia: 'Primer número autorizado del rango.',
    finaliza: 'Último número autorizado del rango.',
    es_factura_electronica: 'Indica uso para factura electrónica.',
    fecha_vencimiento: 'Vencimiento de la resolución o autorización.',
    nRelleno: 'Longitud o cantidad de caracteres de relleno.',
    es_tirilla_pos: 'Indica numeración para tirilla POS.',
    es_contingencia: 'Indica numeración destinada a contingencia.',
    predeterminado: 'Marca el consecutivo propuesto por defecto.',
    multi_moneda: 'Permite documentos con configuración multimoneda.',
    tipo_consecutivo: 'Tipo documental asociado al consecutivo.',
    id_empleado:
      'Empleado asociado cuando el flujo del consecutivo lo utiliza.',
  },
  buscarSucursales: {
    id_sucursal: 'Identificador interno de la sucursal.',
    nombre_sucursal: 'Nombre visible de la sucursal.',
    nota: 'Observaciones internas.',
    codigo_sucursal: 'Código interno o de integración.',
    es_activo: 'Estado operativo.',
    fecha_registro: 'Momento de creación.',
    es_bodega: 'Indica si funciona como bodega.',
    id_padre: 'Sucursal o entidad superior en una jerarquía.',
    id_moneda: 'Moneda predeterminada.',
    simbolo_moneda: 'Símbolo mostrado para la moneda.',
    vender_con_impuestos: 'Indica si la venta opera incluyendo impuestos.',
    numero_mesas: 'Número de mesas configuradas para restaurante.',
    digitos_decimales: 'Precisión decimal usada en cálculos o presentación.',
    reondeoTotales: 'Control de redondeo de totales.',
    modificicar_precio_minimos_otras_sucursales:
      'Controla cambios de precios mínimos de otras sucursales.',
    modificicar_descuento_maximo_otras_sucursales:
      'Controla cambios de descuentos máximos de otras sucursales.',
    actualizarPrecioVentaSucursales:
      'Controla la propagación de precios de venta entre sucursales.',
    activar_venta_compra_licores:
      'Habilita reglas especiales de compra y venta de licores.',
    actualizarPrecioCostoSucursales:
      'Controla la propagación de precios de costo entre sucursales.',
    vender_ip_estampilla:
      'Control relacionado con venta y estampilla; validar la sigla IP.',
  },
  buscarEmpleados: {
    id_empleado: 'Identificador interno del empleado.',
    id_usuario_portal: 'Usuario de portal vinculado.',
    nombre_completo: 'Nombre completo para visualización.',
    es_activo: 'Estado operativo.',
    fecha_registro: 'Momento de creación.',
    id_lista_precios: 'Lista de precios predeterminada.',
    id_sucursal: 'Sucursal principal.',
    id_consecutivo: 'Consecutivo predeterminado.',
    sincroniazar_datos: 'Control de sincronización.',
    tipo_usuario: 'Rol o tipo de usuario; validar catálogo de seguridad.',
    comision: 'Comisión asignada al empleado.',
    id_bodega: 'Bodega predeterminada.',
    tipo_comision: 'Forma de cálculo de la comisión.',
    modePosDefecto: 'Modo POS predeterminado.',
    comision_antes_iva: 'Indica si la comisión se calcula antes del IVA.',
    identificacion: 'Documento de identificación del empleado.',
    mostrar_mesa: 'Habilita la visualización o selección de mesas.',
    es_contador: 'Marca al empleado como contador.',
    solo_bodegas_sucursal: 'Restringe las bodegas a las de su sucursal.',
    obligar_apertura_caja: 'Exige apertura de caja antes de operar.',
    cerrar_session_cierre: 'Controla el cierre de sesión durante un cierre.',
    es_tienda: 'Clasifica al usuario para operación de tienda.',
    codigo_empleado: 'Código interno del empleado.',
    sucursal_adicional: 'Sucursales y bodegas adicionales permitidas.',
    cierra_caja: 'Autoriza o configura el cierre de caja.',
    ventas_solo_credito: 'Restringe ventas a modalidad crédito.',
    vendedor_multi_sucursal:
      'Habilita operación comercial en varias sucursales.',
  },
  obtenerComandas: {
    id_transacion_mesa: 'Identificador único de la línea de comanda.',
    id_transacion: 'Documento de venta asociado.',
    id_sucursal: 'Sucursal de la comanda.',
    numero_mesa: 'Número de mesa.',
    nombre_mesa: 'Nombre visible de la mesa.',
    comensales: 'Cantidad de personas registrada en la mesa.',
    turno: 'Turno o rotación de ocupación de la mesa.',
    id_producto: 'Producto o plato solicitado.',
    nombre: 'Nombre del producto o plato.',
    cantidad: 'Cantidad solicitada.',
    precio: 'Precio registrado para el plato.',
    nota: 'Instrucción u observación de preparación.',
    formato_presentacion: 'Formato comercial de presentación.',
    configuracion_plato: 'Adiciones o variantes configuradas para el plato.',
    id_empleado: 'Empleado que registró o atiende.',
    nombre_empleado: 'Nombre del empleado.',
    fecha_registro: 'Fecha y hora de registro.',
    estado: 'Estado operativo de la línea de comanda.',
    es_activo: 'Indica que la línea permanece activa.',
    id_cocina: 'Cocina o estación asignada.',
    tiempo_preparacion_producto:
      'Tiempo de preparación configurado para el producto.',
    tiempo_preparacion_plato: 'Tiempo registrado o calculado para el plato.',
    tiempo_entrega: 'Tiempo asociado a la entrega; validar unidad temporal.',
    es_pedido_linea: 'Indica si proviene de un pedido en línea.',
    id_pedido_linea: 'Identificador del pedido en línea.',
    numero_orden: 'Número de orden principal.',
    numero_orden2: 'Segunda referencia de orden.',
    impreso: 'Indica si la comanda fue impresa.',
    imprimio_prefactura: 'Indica si se imprimió prefactura.',
    marca:
      'Señal usada en el flujo de impresión o preparación; validar regla exacta.',
    observacion: 'Observación operativa.',
  },
  platosEliminados: {
    id_auditoria: 'Identificador único del registro de auditoría.',
    fecha_registro: 'Momento de la eliminación.',
    id_sucursal: 'Sucursal donde ocurrió la eliminación.',
    nombre_sucursal: 'Nombre de la sucursal.',
    id_empleado: 'Empleado asociado a la eliminación.',
    nombre_empleado: 'Nombre del empleado.',
    nombre_producto: 'Nombre del plato o producto eliminado.',
    cantidad: 'Cantidad eliminada.',
    mesa: 'Número de mesa guardado en la auditoría.',
    nombre_mesa: 'Nombre visible de la mesa.',
    nota: 'Motivo u observación de la eliminación.',
  },
  grabarMovimientoArr: {
    nombre: 'Nombre o concepto visible del conteo.',
    nota: 'Observación asociada al conteo.',
    id_concepto: 'Concepto del movimiento; debe ser -1.',
    es_entrada: 'Sentido del movimiento; debe ser 1.',
    cantidad: 'Cantidad contada para el producto.',
    id_sucursal: 'Sucursal donde se registra el conteo.',
    id_bodega: 'Bodega del conteo; debe coincidir con la sucursal.',
    id_producto: 'Producto contado.',
    id_empleado: 'Empleado que registra el conteo.',
    fecha_registro: 'Fecha del conteo en milisegundos desde epoch.',
    id_centro_costo: 'Centro de costo opcional del movimiento.',
  },
  grabarDocumentoSimple: {
    tipoDocumento: '1 factura, 7 compra/gasto, 9 remisión/prefactura.',
    type_match_producto: '1 ID de producto, 2 SKU, 3 código de barras.',
    id_consecutivo: 'Consecutivo con el que se registra el documento.',
    codigo_unico: 'Código numérico de 1 a 50 dígitos, sin normalizar.',
    nota: 'Nota general del documento.',
    observacion: 'Observación general del documento.',
    id_sucursal: 'Sucursal del documento.',
    id_bodega: 'Bodega; debe coincidir con id_sucursal.',
    id_vendedor: 'Vendedor asociado al documento.',
    id_empleado: 'Empleado que registra el documento.',
    id_cliente: 'Tercero asociado al documento.',
    nombre_cliente: 'Nombre o razón social del tercero.',
    objClienteMini: 'Datos mínimos obligatorios del tercero.',
    objDetalle: 'Líneas del documento; total es el total de cada línea.',
    cantidad: 'Cantidad de la línea.',
    descripcion: 'Descripción de la línea.',
    total: 'Total de la línea; Cuenti registra internamente el unitario.',
    cambiar_precio_compra: 'True actualiza el costo; false lo conserva.',
    id_producto: 'Producto cuando type_match_producto es 1.',
    code: 'SKU o código de barras cuando type_match_producto es 2 o 3.',
    id_plan_cuentas: 'Cuenta contable requerida en un detalle de gasto.',
    lstPagos: 'Pagos del documento; arreglo vacío indica crédito.',
    id_medio_pago: 'Medio de pago aplicado.',
    id_banco: 'Banco o cuenta asociada al pago.',
    valor: 'Valor del pago.',
    boucher: 'Referencia o comprobante del pago.',
    digitos: 'Dígitos de referencia del pago.',
    devuelta: 'Valor devuelto al cliente.',
    dinero_entregado: 'Dinero recibido del cliente.',
    impuestos: 'Impuestos de la línea; si se incluye debe ser completo.',
    id_impuesto: 'Impuesto asociado.',
    total_impuesto_agregado_1: 'Primer total de impuesto agregado.',
    total_impuesto_agregado_2: 'Segundo total de impuesto agregado.',
  },
  consultarImpuestoCuenti: {
    id_impuesto: 'Identificador del impuesto consultado.',
  },
  consultarMarcasActivas: {
    es_activo: 'Debe ser 1 para consultar marcas activas.',
    precio_unidad: 'Valor numérico devuelto por el catálogo.',
    id_marca: 'Identificador de la marca.',
    nombre_marca: 'Nombre visible de la marca.',
    fecha_registro: 'Fecha de registro de la marca.',
    error: 'Mensaje de error si el ERP lo devuelve.',
  },
  consultarMarcaPorId: {
    id_marca: 'Identificador positivo de la marca.',
    precio_unidad: 'Valor numérico devuelto por el catálogo.',
    nombre_marca: 'Nombre visible de la marca.',
    fecha_registro: 'Fecha de registro de la marca.',
    es_activo: 'Indicador de marca activa.',
    error: 'Mensaje de error si el ERP lo devuelve.',
  },
};

const commonFieldTypes: Record<string, string> = {
  alias: 'texto',
  cantidad: 'número',
  codigo: 'texto',
  codigo_barras: 'texto',
  codigo_empleado: 'texto',
  codigo_sucursal: 'texto',
  comision: 'número',
  config: 'objeto o texto',
  comentario: 'texto',
  correos: 'arreglo',
  departamento: 'texto',
  descripcion: 'texto',
  direccion: 'texto',
  empleado: 'texto',
  es_activo: 'entero',
  es_bodega: 'entero',
  es_cliente: 'entero',
  es_contingencia: 'entero',
  es_devolucion: 'entero',
  es_factura: 'entero',
  es_factura_electronica: 'entero',
  es_ingreso: 'entero',
  es_nula: 'entero',
  es_proveedor: 'entero',
  estado: 'entero',
  fecha_actualizacion: 'milisegundos desde epoch',
  fecha_nacimiento: 'milisegundos desde epoch',
  fecha_registro: 'milisegundos desde epoch',
  fecha_vencimiento: 'milisegundos desde epoch',
  identificacion: 'texto',
  id_banco: 'entero',
  id_adjunto: 'entero',
  id_centro_costo: 'entero',
  id_cliente: 'entero',
  id_comentario: 'entero',
  id_empleado: 'entero',
  id_consecutivo: 'entero',
  id_empresa_portal: 'entero',
  id_imagen: 'entero',
  id_impuesto: 'entero',
  id_medio_pago: 'entero',
  id_plan_cuenta: 'entero',
  id_producto: 'entero',
  id_sucursal: 'entero',
  metadata: 'objeto o texto',
  nombre: 'texto',
  nombre_categoria: 'texto',
  nombre_cliente: 'texto',
  nombre_empleado: 'texto',
  nombre_marca: 'texto',
  nombre_producto: 'texto',
  nombre_real: 'texto',
  nombre_sucursal: 'texto',
  nota: 'texto',
  numero_cuenta: 'texto',
  pais: 'texto',
  precio: 'número',
  precio_unidad: 'número',
  etiqueta: 'texto',
  leido: 'entero',
  saldo: 'número',
  sucursales: 'arreglo, objeto o texto',
  telefonos: 'arreglo',
  tipo_impuesto: 'texto',
  tipo_persona: 'entero',
  total: 'número',
  total_estampilla: 'número',
  total_impoconsumo: 'número',
  total_impuestos: 'número',
  total_neto: 'número',
  tipo: 'texto',
  ruta: 'texto',
  url: 'texto',
  url_imagen: 'texto',
  valor: 'número',
  valor_impuesto: 'número',
};

const endpointFieldTypes: Record<string, Record<string, string>> = {
  consultarImpuestoCuenti: {
    clasificacion_tributaria: 'texto',
    nombre_impuesto: 'texto',
  },
  consultarMarcasActivas: {
    error: 'texto',
    es_activo: 'entero',
    fecha_registro: 'milisegundos desde epoch',
    id_marca: 'entero',
    nombre_marca: 'texto',
    precio_unidad: 'número',
  },
  consultarMarcaPorId: {
    error: 'texto',
    es_activo: 'entero',
    fecha_registro: 'milisegundos desde epoch',
    id_marca: 'entero',
    nombre_marca: 'texto',
    precio_unidad: 'número',
  },
};

const inferredFieldType = (field: string) => {
  if (/^id_|^numero_|^n_/.test(field)) return 'entero';
  if (
    /^es_|^(mostrar|permitir|permite|genera|actualizar|activar|vender|cerrar|obligar|cierra|solo_|tiene_|envio)/.test(
      field,
    )
  ) {
    return 'entero';
  }
  if (/^fecha_|_fecha$/.test(field)) return 'milisegundos desde epoch';
  if (/^(total|valor|saldo|precio|cantidad|cupo|puntos)/.test(field)) {
    return 'número';
  }
  if (/^(telefonos|correos|items|detalles)$/.test(field)) return 'arreglo';
  return undefined;
};

export const getGroupDescription = (group: string) =>
  groupDescriptions[group] ??
  groupDescriptions[group.split(' (')[0]] ??
  pendingDescription;

export const getFieldDescription = (endpointId: string, field: string) =>
  endpointFieldDescriptions[endpointId]?.[field] ??
  endpointFieldDescriptions.buscarTercero?.[field] ??
  commonFieldDescriptions[field] ??
  groupDescriptions[field] ??
  `Campo ${field}; confirma su significado funcional antes de interpretarlo.`;

export const getFieldType = (endpointId: string, field: string) =>
  endpointFieldTypes[endpointId]?.[field] ??
  commonFieldTypes[field] ??
  inferredFieldType(field);

export const hasGroupDescription = (group: string) =>
  getGroupDescription(group) !== pendingDescription;

export const hasFieldDescription = (endpointId: string, field: string) =>
  getFieldDescription(endpointId, field) !== pendingDescription;
