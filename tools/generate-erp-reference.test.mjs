import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { endpointCurl } from '../src/components/shared/code.tsx';
import { adaptRegistry } from '../src/registry/adapter.ts';
import { defaultDraft } from '../src/request/builders.ts';
import { renderErpReference } from './generate-erp-reference.mjs';

const load = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const registry = load('../contracts/j4/endpoints.json');
const external = load('../contracts/mcp/external-tools.json');
const markdown = renderErpReference(registry, external);
const sections = new Map(
  [
    ...markdown.matchAll(
      /^### `([^`]+)`:[^\n]*\n(.*?)(?=^### |^## |$(?![\s\S]))/gms,
    ),
  ].map(([, id, text]) => [id, text]),
);

test('generated reference preserves public response parity without private routes', () => {
  const adapted = adaptRegistry(registry);
  expect(sections.size).toBe(registry.routes.length + external.tools.length);
  expect(markdown).not.toContain('/jServerj4ErpPro');
  expect(markdown).not.toContain('consultarClienteId');
  expect(markdown).not.toContain('undefined');
  for (const route of registry.routes) {
    const source = registry.endpoints.find(
      (endpoint) => endpoint.id === route.contract,
    );
    const endpoint = adapted.endpoints.find(
      (item) => item.id === route.routeId,
    );
    const text = sections.get(route.routeId);
    expect(text).toContain(`**Método:** \`${route.method}\``);
    const response = JSON.parse(
      text.match(/\*\*Ejemplo de respuesta:\*\*\s+```json\n(.*?)\n```/s)[1],
    );
    expect(response).toEqual(endpoint.responseExample);
    if (route.translation.boundedProduction) {
      expect(response.documentos[0].codigos.tipo_documento).toBe(
        route.translation.fixedQuery.tipo_documento,
      );
      expect(source.response.example.documentos[0].codigos.tipo_documento).toBe(
        4,
      );
    } else if (!route.translation.omitBodyFields?.length)
      expect(response).toEqual(source.response.example);
    if (source.response.fallbackExample) {
      const fallback = text.match(
        /\*\*Respuesta alternativa de pago confirmado:\*\*.*?```json\n(.*?)\n```/s,
      );
      expect(JSON.parse(fallback[1])).toEqual(source.response.fallbackExample);
    }
    const args = JSON.parse(
      text.match(/\*\*Ejemplo de argumentos:\*\*\s+```json\n(.*?)\n```/s)[1],
    );
    for (const key of Object.keys(route.translation.fixedQuery ?? {}))
      expect(args).not.toHaveProperty(key);
    for (const key of [
      ...Object.keys(route.translation.fixedBody ?? {}),
      ...Object.values(route.translation.pathToBody ?? {}),
    ])
      expect(args.body ?? {}).not.toHaveProperty(key);
    if (source.operation === 'mutation')
      expect(args.confirmation).toBe(`confirm:${route.routeId}`);
    else expect(args).not.toHaveProperty('confirmation');
  }
  expect(markdown).toContain('mayor que: 0');
  expect(markdown).toContain('`id_documento` | No |');
  expect(markdown).toContain('admite null');
  expect(sections.get('terceros-actualizar')).not.toContain('Para crear:');
  expect(sections.get('terceros-crear')).not.toContain('Para actualizar:');
});

test('invoice docs hide the omitted group without changing sibling routes or the source', () => {
  const invoiceId = 'ventas-facturas-busquedas';
  const field = 'cartera_cliente';
  const adapted = adaptRegistry(registry);
  const invoice = adapted.endpoints.find((item) => item.id === invoiceId);
  const source = registry.endpoints.find(
    (item) => item.id === invoice.contractId,
  );
  expect(JSON.stringify(invoice).includes(field)).toBe(false);
  const curl = endpointCurl(
    invoice,
    'https://api.example',
    defaultDraft(invoice).credentials,
  );
  expect(curl).toContain('"grupos"');
  expect(curl).not.toContain(field);
  expect(sections.get(invoiceId)).not.toContain(field);
  expect(invoice.requestExample.grupos).toEqual(
    source.body.example.grupos.filter((group) => group !== field),
  );
  const { cartera_cliente, ...otherFields } =
    source.response.example.transacciones[0];
  expect(cartera_cliente).toBeDefined();
  expect(invoice.responseExample.transacciones[0]).toEqual(otherFields);
  for (const route of registry.routes.filter(
    (route) => route.contract === source.id && route.routeId !== invoiceId,
  )) {
    expect(sections.get(route.routeId)).toContain(field);
  }
  expect(sections.get('terceros-busquedas')).toContain(field);
});

test('bounded query references expose SAFE groups and actual constraints without invented bank IDs or pagination', () => {
  for (const route of registry.routes.filter(
    (route) =>
      registry.endpoints.find((item) => item.id === route.contract).response
        .boundedQuery,
  )) {
    const text = sections.get(route.routeId);
    const args = JSON.parse(
      text.match(/\*\*Ejemplo de argumentos:\*\*\s+```json\n(.*?)\n```/s)[1],
    );
    expect(args.body).toEqual({});
    expect(text).toContain('proyección SAFE completa');
    expect(text).toContain('No admite columnas, detalle ni paginación');
    expect(text).toContain('no-store');
    expect(text).not.toContain('Columnas permitidas');
    expect(args).not.toHaveProperty('pagina');
    expect(args).not.toHaveProperty('confirmation');
  }
  const bank = sections.get('finanzas-bancos-movimientos-busquedas');
  expect(bank).toContain('"id_banco": "{{id_banco}}"');
  expect(bank).toContain('31 días calendario inclusivos en GMT-0500');
  expect(sections.get('operativas-ordenes-produccion-busquedas')).toContain(
    'no consumos reales',
  );
  expect(sections.get('operativas-ordenes-produccion-busquedas')).toContain(
    '{} no es válido',
  );
  expect(sections.get('operativas-ordenes-produccion-busquedas')).not.toContain(
    'proyección SAFE completa',
  );
});
