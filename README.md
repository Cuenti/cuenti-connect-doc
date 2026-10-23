# Guía de la API Cuenti

Documentación operativa en React para las operaciones REST de Cuenti expuestas mediante NGINX y para sus dos servidores MCP. La interfaz usa Cuenti DNA, lee `contracts/j4/endpoints.json` y `contracts/stats/endpoints.json` como fuentes canónicas locales, y no usa Swagger ni duplica los inventarios.

El portal publica dos skills independientes: `cuenti-mcp-erp` en `/skills/cuenti-mcp-erp/` y `cuenti-mcp-stats` en `/skills/cuenti-mcp-stats/`. Cada ZIP contiene únicamente las instrucciones y referencias de su servidor MCP. El portal no implementa un cliente MCP de prueba.

La interfaz web incluye la sección independiente **Catálogos y valores**, con el significado de los IDs de configuración y los valores base documentados.

## Inicio rápido

1. Instala las dependencias con `pnpm install`.
2. Inicia la aplicación con `pnpm run dev` y abre `http://localhost:3000`.
3. Selecciona una operación, configura sus encabezados obligatorios y pulsa **Enviar solicitud**. Las mutaciones requieren confirmación explícita.

Durante el desarrollo, las solicitudes del navegador permanecen en el mismo origen. Rsbuild reenvía `/api/v1/**` y `/jServerj4ErpPro/**` a `ERP_PROXY_TARGET`.

El indicador **Servidor API** muestra la base pública de Integration API, con rutas `/api/v1/**`, no las rutas Java internas. Si `PUBLIC_PROXY_BASE_URL` está vacía durante el desarrollo, utiliza el destino local configurado. Las guías MCP muestran sus propias URLs y no ejecutan llamadas desde el navegador.

## Probar consultas

En desarrollo, `pnpm run dev` habilita la ejecución interactiva y usa Integration API en `http://127.0.0.1:8083`. Mantén `PUBLIC_PROXY_BASE_URL` vacío para que el navegador use el proxy same-origin de Rsbuild.

Para cambiar el destino local o habilitar la ejecución en una compilación desplegada, define únicamente las variables necesarias:

```dotenv
PUBLIC_TRY_IT_ENABLED=true
PUBLIC_PROXY_BASE_URL=https://cuenti-connect.cuenti.co
ERP_PROXY_TARGET=https://cuenti-connect.cuenti.co
```

Después ejecuta:

```bash
pnpm run dev
```

## Despliegue en GitHub Pages

El repositorio `Cuenti/cuenti-connect-doc` publica el contenido estático de
`dist` mediante `.github/workflows/deploy-pages.yml`. En GitHub, configura
**Settings > Pages > Build and deployment > Source** como **GitHub Actions**.

El workflow necesita un secret de repositorio llamado `NPM_TOKEN` para instalar
`@cuenti-dna/react` desde `https://package-manager.cuenti.co/`. El token solo se
usa durante el build y no se copia al artefacto publicado.

La compilación usa estas variables públicas:

```dotenv
PUBLIC_ASSET_PREFIX=/cuenti-connect-doc/
PUBLIC_PROXY_BASE_URL=https://cuenti-connect.cuenti.co
PUBLIC_TRY_IT_ENABLED=true
```

La URL resultante es `https://cuenti.github.io/cuenti-connect-doc/`. GitHub Pages
no funciona como proxy: **Probar consulta** llama directamente a
`https://cuenti-connect.cuenti.co`, cuyo CORS ya permite solicitudes del
navegador. Si se configura un dominio personalizado, cambia
`PUBLIC_ASSET_PREFIX` a `/` en el workflow.

En la sección **Probar consulta**, configura el contexto que exige la operación. El token puede escribirse con o sin el prefijo `Bearer`; la aplicación siempre envía un único prefijo. `X-gtm` usa `GMT-0500` cuando el contrato lo requiere. Finalmente, pulsa **Enviar solicitud**.

El portal envía únicamente los encabezados declarados por cada contrato. El contexto habitual es:

| Encabezado | Valor |
| --- | --- |
| `X-Auth-Token-empresa` | Empresa ingresada en la interfaz. |
| `X-Auth-Token-sucursal` | Sucursal ingresada en la interfaz. |
| `X-Id-Empleado` | Identificador del empleado que ejecuta la operación; no corresponde al ID del usuario del portal (`id_usuario_portal`). |
| `X-gtm` | `GMT-0500` de forma predeterminada. |
| `Authorization` | `Bearer <token>`, siempre con un único prefijo. |

Las consultas de comandas y platos eliminados requieren `Content-Type`, empresa y autorización, y permiten cuerpo vacío. Mesas ocupadas requiere empresa y autorización. No exigen sucursal, empleado ni zona horaria como encabezados. Las demás operaciones conservan los requisitos de su contrato, incluido `Content-Type` cuando se declara, incluso en una anulación sin cuerpo.

## Finanzas y documentos

| Necesidad | Contrato público y regla |
| --- | --- |
| Registrar un abono nuevo | `POST /api/v1/finanzas/abonos` sin `id_comprobante_caja`: crea un nuevo recibo. |
| Aplicar un anticipo existente | La misma ruta con `id_comprobante_caja`: usa saldo ya recibido. No ejecutes ambas variantes como si fueran la misma operación. |
| Consultar un anticipo o comprobante | Usa las consultas de anticipos por cliente/sucursal o de comprobante por ID; no repitas una escritura para recuperar su respuesta. |
| Anular un pedido u otro documento comercial | `POST /api/v1/documentos/{id_documento}/anulaciones/{id_empleado}`, sin cuerpo. Usa el ID de `vent_documento` y el empleado local. Devuelve `{ "success": true, "status": "ANULADO" }` o `YA_ESTABA_ANULADO`; no llames al GET Java ni a la anulación de transacciones. |

Las fechas financieras `fecha_registro` usan `YYYY-MM-DDTHH:mm:ss`, sin `Z`, offset ni epoch; por ejemplo, `2026-10-21T15:30:00`. Los filtros de fecha de restaurante usan milisegundos Unix. Los IDs de empleado, sucursal, banco y medio de pago pertenecen al ERP de la empresa, no al usuario del portal.

Solo creación, consulta y anulación de anticipos y anulación de abonos usan `{success,data,error,request_id}`. Los abonos existentes, terceros y anulaciones de documentos conservan sus formatos específicos. Si el comprobante enriquecido es `null` tras confirmar un pago, consulta por ID: no significa que haya fallado. Ante un resultado de mutación desconocido, consulta el estado y no reintentes automáticamente.

El catálogo actual permite crear y anular documentos, pero no publica una modificación de pedidos ni la asociación propuesta entre un documento existente y una transacción. Tampoco ofrece una asociación directa de un anticipo a un documento existente sin transacción. `lstPagos[].id_comprobante_caja` es una referencia opcional en la creación del documento, no una ruta de asociación posterior.

Terceros acepta `codigo_tributario: 5` como **No aplica ZZZ**, contactos y los campos adicionales declarados. En actualizaciones, los contactos omitidos se conservan y `[]` no elimina los existentes. La documentación de un campo aceptado no garantiza que Java persista todos sus valores; siguen pendientes los hallazgos del adaptador de terceros.

## Variables de entorno

| Variable | Entorno | Propósito |
| --- | --- | --- |
| `PUBLIC_TRY_IT_ENABLED` | Compilación del navegador | En desarrollo se habilita por defecto; usa `false` para desactivarla. En una compilación desplegada exige `true`. |
| `PUBLIC_PROXY_BASE_URL` | Compilación del navegador | Origen público de Integration API que se muestra en **Servidor API** y se usa para generar curl. No incluyas `/jServerj4ErpPro`; las operaciones ya declaran sus rutas `/api/v1/**`. |
| `PUBLIC_ASSET_PREFIX` | Compilación de producción | Prefijo de assets estáticos; para este repositorio es `/cuenti-connect-doc/`. |
| `ERP_PROXY_TARGET` | Servidor de desarrollo | Destino del proxy de Rsbuild; por defecto `http://127.0.0.1:8083`. |

No guardes tokens, contraseñas, credenciales de empresa ni datos personales en archivos de entorno. **Probar consulta** conserva las credenciales únicamente en memoria. Sin contexto configurado, los curl usan variables compatibles con Postman (`{{id_empresa}}`, `{{id_sucursal}}`, `{{id_empleado}}` y `{{token}}`); con contexto pueden incluir las credenciales ingresadas. No publiques esos comandos.

## Verificación

```bash
pnpm run verify
pnpm run build
pnpm run test:e2e
```

`verify` ejecuta el lint enfocado de código de aplicación, ambos typechecks, las pruebas unitarias y la paridad de los artefactos públicos. `test:e2e` cubre escritorio y móvil con Playwright Chromium. Las pruebas interceptan las solicitudes y no necesitan credenciales reales ni acceso al backend.

Para contrastar también el contenido completo con la fuente del wrapper, proporciona su archivo explícitamente:

```bash
node tools/verify-public-artifacts.mjs --source-registry /ruta/al/wrapper/contracts/j4/endpoints.json
```

El chequeo falla ante cualquier diferencia de contenido, aunque coincidan los conteos. Sin esa opción conserva las verificaciones locales de secciones Markdown y del contenido y orden de los ZIP, sin depender de un checkout hermano. Esta actualización toma como referencia el árbol local del wrapper; no demuestra qué versión está desplegada.

## Arquitectura

La aplicación se organiza alrededor de límites explícitos:

| Área | Responsabilidad |
| --- | --- |
| `src/components/portal` | Composición de la aplicación, navegación, shell, tema y estado global en memoria. |
| `src/components/endpoint-documentation` | Presentación de contratos, ejemplos, curl y tablas de cada operación. |
| `src/components/try-it` | Estado y controles de ejecución interactiva por endpoint. |
| `src/components/modals` | Flujos de credenciales e instalación de skills. |
| `src/StatsGuide.tsx` | Guía y catálogo visual de las tools públicas de Stats derivados del contrato. |
| `src/app` | Configuración del runtime y estado de página derivado de la URL. |
| `src/request` | Construcción pura de solicitudes y comandos curl, detrás de `src/request.ts`. |
| `src/registry` | Adaptación del registro canónico, detrás de `src/registry.ts`. |

El dominio no depende de React ni de APIs del navegador. Los componentes reciben datos y callbacks desde la composición; no importan estado de otras features. Las fachadas `src/request.ts` y `src/registry.ts` conservan los límites de consumo mientras sus implementaciones evolucionan.

## Límites de responsabilidad

| Fuente | Responsabilidad |
| --- | --- |
| `contracts/j4/endpoints.json` | Registro local con rutas, métodos, clasificación, política de caché, contratos, ejemplos y metadatos. |
| `contracts/stats/endpoints.json` | Contrato canónico de las herramientas públicas y workflows del servidor Stats MCP. |
| `src/registry.ts` | Proyección pública, validación de referencias y unicidad, adaptación tipada y encabezados por contrato. |
| `src/request.ts` | Validación de campos, URL del proxy, normalización de Bearer, generación de curl y preparación de solicitudes. |
| `src/TryIt.tsx` | Credenciales solo en memoria, tiempo límite, confirmación de mutaciones e inspección de respuestas. |

El catálogo actual contiene **48 rutas públicas ERP y una herramienta externa: 49 operaciones**. Los descriptores privados, incluido `consultarClienteId`, no se publican. El adaptador exige rutas públicas explícitas, referencias válidas, IDs únicos y pares método/ruta únicos, en lugar de imponer un conteo fijo. Stats conserva su catálogo independiente.
