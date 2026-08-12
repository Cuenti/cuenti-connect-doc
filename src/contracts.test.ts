import { describe, expect, it } from 'vitest';
import { normalizeHistoricalJsonValue } from './contracts';

describe('normalizeHistoricalJsonValue', () => {
  it('preserva objetos, arreglos y null sin volver a deserializarlos', () => {
    const object = { lstBancos: [] };
    const array = [1, 4];

    expect(normalizeHistoricalJsonValue(object)).toBe(object);
    expect(normalizeHistoricalJsonValue(array)).toBe(array);
    expect(normalizeHistoricalJsonValue(null)).toBeNull();
  });

  it('convierte únicamente strings que contienen objetos o arreglos JSON válidos', () => {
    expect(normalizeHistoricalJsonValue('{"horario":[]}')).toEqual({
      horario: [],
    });
    expect(normalizeHistoricalJsonValue('[1,2,4]')).toEqual([1, 2, 4]);
  });

  it('conserva strings históricos malformados o escalares JSON', () => {
    expect(normalizeHistoricalJsonValue('{sin-cerrar')).toBe('{sin-cerrar');
    expect(normalizeHistoricalJsonValue('')).toBe('');
    expect(normalizeHistoricalJsonValue('true')).toBe('true');
  });
});
