# Guía de la API Cuenti

Documentación operativa en React para las 19 operaciones verificadas de Cuenti expuestas mediante Envoy. La interfaz usa Cuenti DNA y lee `../../contracts/j4/endpoints.json` como registro canónico; no usa Swagger ni duplica el inventario de rutas.

El portal también publica la skill `cuenti-mcp` en `/skills/cuenti-mcp/`. El botón **Skill MCP** descarga un único paquete `cuenti-mcp.zip` con `SKILL.md` y `references/endpoints.md`, y muestra comandos que instalan ambos archivos en clientes compatibles con Agent Skills y OpenCode.

## Inicio rápido

1. Instala las dependencias con `pnpm install`.
2. Inicia la aplicación con `pnpm run dev` y abre `http://localhost:3000`.
3. Selecciona una operación, ingresa empresa, sucursal, empleado y token, y pulsa **Enviar al proxy**.

Durante el desarrollo, las solicitudes del navegador permanecen en el mismo origen. Rsbuild reenvía `/jServerj4ErpPro/**` a `ERP_PROXY_TARGET`. El valor esperado para el proxy local es `http://127.0.0.1:8081`.

El indicador **Servidor API** muestra el origen que se usará para documentación y comandos curl. En local, cuando `PUBLIC_PROXY_BASE_URL` está vacío, muestra `http://localhost:8081/jServerj4ErpPro`. En una compilación configurada, muestra `PUBLIC_PROXY_BASE_URL` seguido del prefijo `/jServerj4ErpPro`.

## Probar consultas

En desarrollo, `pnpm run dev` habilita la ejecución interactiva y usa Envoy en `http://127.0.0.1:8081` sin configuración adicional.

Para cambiar el destino local o habilitar la ejecución en una compilación desplegada, define únicamente las variables necesarias:

```dotenv
PUBLIC_TRY_IT_ENABLED=true
ERP_PROXY_TARGET=http://127.0.0.1:8081
```

Después ejecuta:

```bash
pnpm run dev
```

En la sección **Probar consulta**, ingresa la empresa, sucursal, empleado y el token de autorización. El token puede escribirse con o sin el prefijo `Bearer`; la aplicación siempre envía un único prefijo. `X-gtm` usa `GMT-0500` de forma predeterminada. Finalmente, pulsa **Enviar al proxy**.

Los cinco encabezados globales se envían en todas las operaciones GET y POST:

| Encabezado | Valor |
| --- | --- |
| `X-Auth-Token-empresa` | Empresa ingresada en la interfaz. |
| `X-Auth-Token-sucursal` | Sucursal ingresada en la interfaz. |
| `X-Id-Empleado` | Empleado que ejecuta la operación. |
| `X-gtm` | `GMT-0500` de forma predeterminada. |
| `Authorization` | `Bearer <token>`, siempre con un único prefijo. |

Las operaciones POST también envían `Content-Type: application/json` cuando corresponde. Los encabezados adicionales se muestran en cada contrato.

## Variables de entorno

| Variable | Entorno | Propósito |
| --- | --- | --- |
| `PUBLIC_TRY_IT_ENABLED` | Compilación del navegador | En desarrollo se habilita por defecto; usa `false` para desactivarla. En una compilación desplegada exige `true`. |
| `PUBLIC_PROXY_BASE_URL` | Compilación del navegador | Origen opcional del proxy, por ejemplo `https://api.example.com`; no incluyas `/jServerj4ErpPro` porque la interfaz lo agrega al mostrar el servidor y generar curl. Vacía significa mismo origen para las solicitudes del navegador. |
| `ERP_PROXY_TARGET` | Servidor de desarrollo | Destino del proxy de Rsbuild; por defecto `http://127.0.0.1:8081`. |

No guardes tokens, contraseñas, credenciales de empresa ni datos personales en archivos de entorno. **Probar consulta** conserva las credenciales únicamente en memoria, oculta los valores sensibles y genera comandos curl con marcadores en lugar de secretos.

## Verificación

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
```

`test:e2e` cubre escritorio y móvil con Playwright Chromium. Las pruebas interceptan las solicitudes y no necesitan credenciales reales ni acceso al backend.

## Límites de responsabilidad

| Fuente | Responsabilidad |
| --- | --- |
| `../../contracts/j4/endpoints.json` | Rutas, métodos, clasificación, política de caché, contratos, ejemplos y metadatos. |
| `src/registry.ts` | Validación en ejecución, adaptación tipada y encabezados globales obligatorios. |
| `src/request.ts` | Validación de campos, URL del proxy, normalización de Bearer, generación de curl sin credenciales y preparación de solicitudes. |
| `src/TryIt.tsx` | Credenciales solo en memoria, tiempo límite, confirmación de mutaciones e inspección de respuestas. |

La compilación falla si el registro canónico no contiene exactamente 19 operaciones únicas. Esto evita divergencias silenciosas entre el comportamiento del proxy y la documentación.
