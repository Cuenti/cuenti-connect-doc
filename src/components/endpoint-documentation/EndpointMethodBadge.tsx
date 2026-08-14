import { Badge } from '@cuenti-dna/react/badge';
import type { EndpointDoc } from '../../model';

export const EndpointMethodBadge = ({
  method,
}: {
  method: EndpointDoc['method'];
}) => (
  <Badge className={`method-badge method-${method.toLowerCase()}`} size="sm">
    {method}
  </Badge>
);
