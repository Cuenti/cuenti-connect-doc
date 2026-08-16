import { describe, expect, it } from 'vitest';
import { registry } from '../../registry';
import { endpointCurl } from './code';

describe('documentation snippets', () => {
  it('uses the canonical group projection in the cURL snippet', () => {
    const endpoint = registry.endpoints.find(
      (item) => item.id === 'buscarCategorias',
    );
    if (!endpoint) throw new Error('Category endpoint was not found.');

    const curlSnippet = endpointCurl(endpoint, 'https://example.test', {
      company: '',
      timezone: 'GMT-0500',
      token: '',
      branch: '',
      employee: '',
    });

    expect(curlSnippet).toContain('"grupos"');
    expect(curlSnippet).not.toContain('"columnas"');
  });
});
