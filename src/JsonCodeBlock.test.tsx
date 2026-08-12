import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { formatJsonText, JsonCodeBlock } from './JsonCodeBlock';

describe('JsonCodeBlock', () => {
  it('distingue claves y tipos escalares con tokens semánticos', () => {
    const { container } = render(
      <JsonCodeBlock
        value={{
          id_categoria: 16,
          nombre_categoria: 'Hogar',
          activo: true,
          sucursales: null,
        }}
      />,
    );

    expect(container.querySelectorAll('.json-key')).toHaveLength(4);
    expect(container.querySelector('.json-number')).toHaveTextContent('16');
    expect(container.querySelector('.json-string')).toHaveTextContent('Hogar');
    expect(container.querySelector('.json-boolean')).toHaveTextContent('true');
    expect(container.querySelector('.json-null')).toHaveTextContent('null');
  });

  it('formatea una respuesta JSON textual y conserva texto plano', () => {
    expect(formatJsonText('{"id":16}')).toEqual({
      text: '{\n  "id": 16\n}',
      isJson: true,
    });
    expect(formatJsonText('Servicio no disponible')).toEqual({
      text: 'Servicio no disponible',
      isJson: false,
    });
  });

  it('escapa contenido recibido sin crear elementos HTML', () => {
    const { container } = render(
      <JsonCodeBlock
        value={'{"valor":"<script>alert(1)</script>"}'}
        parseText
      />,
    );

    expect(screen.getByText(/<script>alert\(1\)<\/script>/)).toBeVisible();
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });
});
