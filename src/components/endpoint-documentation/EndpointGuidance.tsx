import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cuenti-dna/react/card';
import type { EndpointDoc } from '../../model';
import { JsonBlock } from '../shared/code';

export const EndpointGuidance = ({
  guidance,
}: {
  guidance: EndpointDoc['guidance'];
}) => {
  if (!guidance) return null;
  return (
    <section className="endpoint-guidance" aria-labelledby="guidance-title">
      <h3 id="guidance-title">{guidance.title}</h3>
      <p>{guidance.intro}</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Valor</th>
              <th>Campo en objDetalle</th>
              <th>Úsalo cuando...</th>
              <th>Regla</th>
            </tr>
          </thead>
          <tbody>
            {guidance.rows.map((row) => (
              <tr key={`${row.value}-${row.field}`}>
                <td>
                  <code>{row.value}</code>
                </td>
                <td>
                  <code>{row.field}</code>
                </td>
                <td>{row.use}</td>
                <td>{row.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="endpoint-guidance-notes">
        {guidance.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      {guidance.examples.length ? (
        <div className="endpoint-guidance-examples">
          <h4>Ejemplos</h4>
          <div className="example-grid">
            {guidance.examples.map((example) => (
              <Card as="section" className="example-card" key={example.title}>
                <CardHeader className="example-card-header">
                  <CardTitle>{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="example-card-content">
                  <JsonBlock value={example.value} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};
