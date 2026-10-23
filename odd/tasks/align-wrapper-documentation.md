# Align Developer Portal with the current wrapper
Objective: implement the approved documentation alignment without changing ERP behavior; branch: `docs/wrapper-alignment-20261022`; delivery: local candidate only, no publication or commits requested.
Runner: Vitest, `pnpm run verify`, Rsbuild, mocked Playwright desktop/mobile, Python registry validation; implementation route: inline, with delegated mapping and per-action verification only.

## Specs

- S1: Apply the approved plan: "Actualizar el catálogo, la documentación visible, los ejemplos y los descargables del Developer Portal para reflejar **el comportamiento existente del wrapper**, sin añadir funcionalidades al ERP ni cambiar contratos públicos." Source: current wrapper `contracts/j4/endpoints.json`, SHA-256 `551f7e46b43444ddf5be4996886ca110f6d52e7d9f828002370dd9ecb92335f4`, HEAD `83e87b5` plus its existing dirty changes. Publish 48 ERP routes plus the existing external tool. Preserve all pre-existing local edits, Stats, public-only projection, route references, unique IDs and method/path tuples. Do not expose `consultarClienteId` or proposed associations. Replace the fixed 38-operation gate with declared-catalog invariants.
- S2: "Para cada ruta, comprobar título, categoría, parámetros, headers, cuerpo, ejemplo de curl, respuesta, errores y configuración de «Probar consulta» según el contrato actual. Reutilizar los componentes existentes, sin rediseñar el portal." Include the 11 missing public routes and changes to `guardarTercero`, `grabarDocumentoSimple`, `obtenerComandas`, and `platosEliminados`. Respect endpoint-specific headers and optional bodies; financial local datetimes remain strings, restaurant timestamps remain epoch milliseconds. Restrict `{success,data,error,request_id}` to the four contracts that declare it. Preserve mutation confirmation, credential redaction, validation of headers actually used, and prior behavior of unchanged routes.
- S3: "Usar las secciones existentes" for new payment versus existing advance, financial dates versus restaurant timestamps, local ERP IDs, current order/advance limitations, duplicate-write retry risk, and successful receipts with absent enrichment. Update README and the ERP skill references and ZIP, preserving the existing Spanish documentation language and exact archive membership/order. Use placeholders, never real credentials. Do not claim unverified third-party persistence or production availability.
- S4: "Ampliar el verificador existente `tools/verify-public-artifacts.mjs` para poder contrastar el registro local con una fuente canónica indicada explícitamente." Compare contents, retain existing Markdown/ZIP checks, and add no personal-path build dependency or duplicate policy registry. A divergent source must fail and a matching source must pass.
- S5: "Se entregan los resultados observados de las verificaciones y cualquier fallo o prueba pendiente." Observe RED before applicable deterministic behavior changes and GREEN after implementation. Run wrapper registry validation/tests, portal verify/build/mocked E2E, explicit source parity and diff checks. Check shared request behavior differentially against an isolated copy of the original dirty portal baseline; committed tests must not depend on Git history. No real ERP requests, deployments, push, PR, or commits are authorized. Name any missing proof rather than inventing a pass.
- S6: Answer the user's exact question, "Aplica los cambios adicionalmente, nosotros tenemos este servicio para anular documentos?" Verify and document the existing public `POST /api/v1/documentos/{id_documento}/anulaciones/{id_empleado}` and its Java GET translation, distinguishing `id_documento` from `id_transacion` and public normalized responses from Java's raw response. Do not perform an actual cancellation or add a duplicate endpoint.

## Tasks

- [x] T1 — S1,S2,S6 — inline; canonical catalog and endpoint-aware request adaptation implemented; document cancellation documented without a new endpoint; commit: not requested; RED: 7 alignment failures plus the fixed string-selector regression; GREEN: 55 focused tests passed, full checks tracked by T4.
- [x] T2 — S4 — inline; explicit-source parity, regression tests and usage documentation implemented; commit: not requested; RED: 3 parity failures; GREEN: 4 parity tests and actual canonical-source comparison passed.
- [x] T3 — S3 — inline; integration guidance, README, 49-section ERP reference and matching ordered ZIP updated; commit: not requested; structural/public-selector and ERP49/Stats22 artifact checks passed.
- [x] T4 — S5 — inline coordination; delegated functional checks and one independent verifier for changed credential guards/shared contracts completed; commit: not requested; verify/build/parity/Python checks passed, browser checks: 19 passed and one existing explicit mobile skip; no independent blockers.

## Log

- L1 — 2026-10-22 — Original planning request, verbatim: "Crea un plan para actualizar la documentación para que coincida con lo que es el estado actual de wrapper". The approved plan is stored at `/home/juank/.local/share/plannotator/plans/plan-alinear-el-developer-port-2026-10-22-approved.md`.
- L2 — 2026-10-22 — Implementation authorization and cancellation question, verbatim:

```text
Aplica los cambios adicionalmente, nosotros tenemos este servicio para anular documentos?

INFORMACION AL RESPECTO
Para anular un pedido (vent_documento), se utiliza el endpoint de DocumentoController.java:443-455:

  • Método: GET
  • Ruta: /com/j4ErpPro/server/vent/documento/anularDocumento/{id_documento}/{id_empleado}

  (Este es exactamente el mismo endpoint que ejecuta el botón "Anular" en la pantalla de pedidos del frontend en DocumentoServices.js:114-116).
  ──────
  ### Ejemplo con curl

    curl -X GET "https://api.cuenti.co/jServerj4ErpPro/com/j4ErpPro/server/vent/documento/anularDocumento/105/1" \
      -H "Authorization: <TOKEN>" \
      -H "X-Auth-Token-empresa: <ID_EMPRESA>" \
      -H "X-Auth-Token-sucursal: 1" \
      -H "X-Id-Empleado: 1" \
      -H "X-gtm: GMT-5"

  • Parámetros en la URL:
      • 105 → id_documento (el ID del pedido que te retornó grabarDocumentoSimple).
      • 1 → id_empleado (el ID del empleado que realiza la anulación).

  ──────
  ### ¿Qué hace internamente al anular? (DocumentosDao.java:2370-2435)

  1. Valida si ya estaba anulado: si es_nula == 1, retorna error "codigo_error:1017:transacción ya fue anulada".
  2. Actualiza la base de datos:
    UPDATE vent_documento SET es_nula = 1 WHERE id_documento = :id_documento;

  3. Manejo de inventario de reserva: Si el pedido tenía configurada una bodega de reserva (bodega_reserva), devuelve automáticamente las unidades reservadas a la
  sucursal.
  4. Integración con Tienda Online / WooCommerce: Si el pedido provino de un canal digital (orden_servicio), emite el evento correspondiente para actualizar el estado
  en la tienda.
  ──────
  ### Respuesta esperada

  • Exitosa:
    {
      "message": "save",
      "type": 1,
      "retorno": null,
      "exception": null
    }


  │ Note
  │ No uses POST /api/token/anularTransacion para pedidos: ese endpoint busca exclusivamente en la tabla transacion_encabezado (id_transacion para facturas/remisiones)
  │ y fallaría al pasarle un ID de vent_documento.
  ──────
  Risk: none

  ## Key Learnings:

  1. Para anular pedidos (vent_documento), el endpoint es GET /com/j4ErpPro/server/vent/documento/anularDocumento/{id_documento}/{id_empleado} (DocumentoController.
  java:443).
  2. anularDocumento marca es_nula = 1 en vent_documento, libera inventario si el pedido usaba bodega de reserva, y sincroniza con tiendas online si tiene
  orden_servicio.
  3. anularTransacion (POST /api/token/anularTransacion) solo aplica para transacciones contables (transacion_encabezado), no para pedidos en vent_documento.
```

- L3 — Baseline: original portal HEAD `690e2ca` with 14 dirty tracked paths; wrapper HEAD `83e87b5` with 19 dirty tracked paths and two untracked Go files. Original checkout remains untouched during implementation. A fresh worktree based on local portal main contains a byte-preserving overlay of those 14 paths; existing dependencies are reused by a temporary `node_modules` symlink excluded from delivery. Its CodeGraph index was initialized independently.
- L4 — Bounded read-only exploration mapped endpoint-aware header/credential gating, optional bodies, date descriptions, public-only projection, generated-request tests, mock E2E and ordered ZIP checks. Mapping worker `ses_e9c25fa67ffeqRvj82CvWfAE7O` completed without writes. Parent spot check confirmed global credential gating in `src/request/builders.ts`. No writer trigger holds; all implementation remains inline.
- L5 — Cancellation evidence: canonical route `documentos-anular` translates to Java GET `anularDocumento`; public response is `ANULADO` or exact-code-1017 `YA_ESTABA_ANULADO`. Existing `internal/httpapi/transaction_mutations_test.go` contains translation/status/cache-invalidation cases. No real cancellation executed; no claim about current production deployment.
- L6 — Risk: item 2 (endpoint-aware credential guards) and item 3 (shared public request/registry adaptation). One independent verifier follows the feature's functional checks. Native review mode is enabled globally; assessment and provider-owned consent/lifecycle will be respected after normalization. Forecast: roughly 500–900 authored changed lines, excluding synchronized registry/generated references/archive. No commits or publication requested; any delivery-chain decision is deferred until such delivery is authorized.
- L7 — Recovery state: scratch `/tmp/opencode/portal-alignment.wMiFfT` holds the original tracked-file hashes/modes, original dirty patch and frozen wrapper registry. Worktree: `/home/juank/Proyectos/documentacion-cuenti/developer-portal-worktrees/docs-wrapper-alignment-20261022`. Parent will apply only its final delta back to the original portal after confirming the original baseline is unchanged, preserving all unrelated edits. Engram mirror topic: `odd/align-wrapper-documentation/tasks`; locator: `odd/tasks/align-wrapper-documentation.md`.
- L8 — Implementation evidence: 48 public ERP routes plus the existing external tool; explicit per-contract headers, optional bodies and financial local datetimes; canonical normalized response examples retained. Public projection now removes fixed selectors declared as strings as well as objects. Initial alignment RED: 7 failures; selector RED: 1 failure; combined focused GREEN: 55 tests. No shared helper was replaced or new dependency added.
- L9 — Artifact evidence: explicit-source checker RED: 3 failures/1 pass, GREEN: 4 passes. The real source comparison passed with SHA-256 unchanged. Generated reference contains 49 public sections, omits private/internal selector inputs, and preserves 33 unchanged sections. ERP ZIP uses the existing four ordered entries; Stats remains untouched. Targeted Biome normalization is convergent; `git diff --check` passed.
- L10 — Functional verification: `pnpm run verify` passed with 101 unit tests, lint, both typechecks and artifacts; Rsbuild passed; wrapper validation passed for 40 contracts/48 routes and all 47 Python tests. Initial E2E failed before execution on the new test's JSON module import. The test now reads JSON with `node:fs`, preserving the existing compiler target; typecheck and test discovery passed. Follow-up mocked Playwright: 19 passed, one existing mobile geometry test explicitly skipped; all six new alignment runs passed. A clipboard-permission diagnostic caused no test failure. No real ERP requests occurred.
- L11 — Independent verification: `ses_e9bfd29d8ffe0gRdEprB2R1BX1` passed every S1-S6 with no blockers. Baseline `690e2ca` plus the preserved dirty overlay matched all 82 original tracked hashes/modes. Differential: 851 inputs/2,553 request/curl/credential comparisons over all 38 existing consumers; 88 intentional differences only on the two updated restaurant contracts; the remaining 36 consumers matched exactly. Rejections made no network calls and preserved input/catalog/data hashes; Stats and external artifacts remained byte-identical.
- L12 — Independent guard probes were retained as `src/alignmentGuards.regression.test.ts` without Git-history dependencies. Final focused verification passed all 15 alignment/parity/guard tests; both typechecks, check-only formatting and diff checks passed. The earlier full suite plus the three retained guard tests cover 104 unique passing unit tests. Native assessment and any candidate consent remain separate informational review steps; no deployment, publication or commits are authorized.
- L13 — Native review: the user selected exactly one offered option, "Skip this time". The exact candidate-scoped decline invocation ran once; the provider returned `action: declined`, `consent: declined_this_candidate` and the expected target `sha256:bd09fb84941833efd1e4801d2f5f701d726d493e7e54a3bebffd2808beedf41d`. No review record or approval was created; future reviews remain enabled. The assessed 26 paths included the preserved pre-existing overlay.
- L14 — Local delivery completed: all 82 original tracked-file hashes and permission modes matched before applying only the verified task delta (16 tracked files and five new files). All 66 untouched tracked files and unrelated local edits were preserved; destination permissions and delivered file hashes matched, with no staged changes. Dependency symlink, build output, CodeGraph data and scratch were not transferred. The canonical-source/artifact check and `git diff --check` passed in the original portal checkout. No commits, publication, deployment or real ERP operations were performed.
