import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderErpReference } from './generate-erp-reference.mjs';

const load = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const registry = load('../contracts/j4/endpoints.json');
const external = load('../contracts/mcp/external-tools.json');

test('generated reference preserves every public response and fallback without private routes', () => {
  const markdown = renderErpReference(registry, external);
  const sections = new Map(
    [
      ...markdown.matchAll(
        /^### `([^`]+)`:[^\n]*\n(.*?)(?=^### |^## |$(?![\s\S]))/gms,
      ),
    ].map(([, id, text]) => [id, text]),
  );
  expect(sections.size).toBe(registry.routes.length + external.tools.length);
  expect(markdown).not.toContain('/jServerj4ErpPro');
  expect(markdown).not.toContain('consultarClienteId');
  expect(markdown).not.toContain('undefined');
  for (const route of registry.routes) {
    const source = registry.endpoints.find(
      (endpoint) => endpoint.id === route.contract,
    );
    const text = sections.get(route.routeId);
    expect(text).toContain(`**Método:** \`${route.method}\``);
    const response = text.match(
      /\*\*Ejemplo de respuesta:\*\*\s+```json\n(.*?)\n```/s,
    );
    expect(JSON.parse(response[1])).toEqual(source.response.example);
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
  }
  expect(markdown).toContain('mayor que: 0');
  expect(markdown).toContain('`id_documento` | No |');
  expect(markdown).toContain('admite null');
  expect(sections.get('terceros-actualizar')).not.toContain('Para crear:');
  expect(sections.get('terceros-crear')).not.toContain('Para actualizar:');
});
