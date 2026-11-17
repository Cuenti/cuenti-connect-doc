import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CatalogGuide } from './CatalogGuide';

it('documents the same 15 unique document types in the portal and downloadable catalog', () => {
  render(<CatalogGuide />);
  const table = screen
    .getByRole('columnheader', { name: 'Tipo de documento' })
    .closest('table');
  if (!table) throw new Error('Missing document type table');
  const reference = readFileSync(
    resolve('public/skills/cuenti-mcp-erp/references/catalogos.md'),
    'utf8',
  );
  const documentedTypes =
    reference.split('### Tipo de documento\n')[1]?.split('\n### ')[0] ?? '';
  const types = [
    ['1', 'Factura'],
    ['2', 'Plan separe'],
    ['3', 'Despacho agrupado'],
    ['4', 'Pedidos'],
    ['5', 'Cotizaciones'],
    ['6', 'Otros ingresos'],
    ['7', 'Compra/gasto'],
    ['8', 'Despacho'],
    ['9', 'Remisiones'],
    ['12', 'Órdenes de producción'],
    ['13', 'Factura de venta recurrente'],
    ['14', 'Compras/gastos recurrentes'],
    ['18', 'Préstamos'],
    ['23', 'Orden de compra'],
    ['24', 'Orden de compra interna'],
  ];
  expect(within(table).getAllByRole('row')).toHaveLength(types.length + 1);
  for (const [id, name] of types) {
    expect(
      within(table).getByRole('row', { name: `${id} ${name}` }),
    ).toBeVisible();
    expect(
      documentedTypes.match(new RegExp(`^\\| \`${id}\` \\|`, 'gm')),
    ).toHaveLength(1);
    expect(documentedTypes).toContain(`| \`${id}\` | ${name} |`);
  }
});
