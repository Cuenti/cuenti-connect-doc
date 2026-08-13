import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurlCodeBlock } from './CurlCodeBlock';

describe('CurlCodeBlock', () => {
  it('highlights shell and JSON tokens without changing the command text', () => {
    const curl = `curl --request POST \\
  'https://example.test/resource' \\
  -H 'Authorization: Bearer {{token}}' \\
  --data '{
  "active": true,
  "count": 2
}'`;
    const { container } = render(<CurlCodeBlock curl={curl} />);

    expect(container.textContent).toBe(curl);
    expect(container.querySelector('.curl-command')).toHaveTextContent('curl');
    expect(container.querySelector('.curl-method')).toHaveTextContent('POST');
    expect(container.querySelector('.curl-url')).toHaveTextContent(
      'https://example.test/resource',
    );
    expect(container.querySelector('.curl-variable')).toHaveTextContent('{{token}}');
    expect(container.querySelector('.curl-json .json-boolean')).toHaveTextContent('true');
    expect(container.querySelector('.curl-json .json-number')).toHaveTextContent('2');
  });
});
