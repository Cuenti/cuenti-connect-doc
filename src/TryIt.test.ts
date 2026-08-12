import { describe, expect, it } from 'vitest';
import { formatResponseBody } from './TryIt';

describe('formatResponseBody', () => {
  it('formatea JSON válido con sangría de dos espacios', () => {
    expect(formatResponseBody('{"resultados":[{"id":1}]}')).toBe(
      '{\n  "resultados": [\n    {\n      "id": 1\n    }\n  ]\n}',
    );
  });

  it('conserva respuestas que no son JSON', () => {
    expect(formatResponseBody('Servicio no disponible')).toBe(
      'Servicio no disponible',
    );
  });

  it('representa cuerpos vacíos con un mensaje en español', () => {
    expect(formatResponseBody('  ')).toBe('(respuesta sin cuerpo)');
  });

  it('renderiza estructuras recibidas y conserva strings históricos internos', () => {
    const formatted = formatResponseBody(
      JSON.stringify({
        medios_pago: [
          { config: { lstBancos: [] } },
          { config: '{valor histórico malformado' },
          { config: null },
        ],
      }),
    );

    expect(formatted).toContain('"lstBancos": []');
    expect(formatted).toContain('"config": "{valor histórico malformado"');
    expect(formatted).toContain('"config": null');
  });
});
