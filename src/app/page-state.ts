import {
  catalogGuideFromLocation,
  endpointFromLocation,
  mcpGuideFromLocation,
  statsMcpGuideFromLocation,
} from '../navigation';

export type PageState =
  | { kind: 'endpoint'; id: string }
  | { kind: 'mcp' }
  | { kind: 'mcp-stats' }
  | { kind: 'catalog' };

export const pageStateFromLocation = (
  location: Pick<Location, 'search'>,
  endpointIds: ReadonlySet<string>,
  fallbackId: string,
): PageState => {
  if (catalogGuideFromLocation(location)) return { kind: 'catalog' };
  if (statsMcpGuideFromLocation(location)) return { kind: 'mcp-stats' };
  if (mcpGuideFromLocation(location)) return { kind: 'mcp' };
  const endpointId = endpointFromLocation(location);
  return {
    kind: 'endpoint',
    id: endpointId && endpointIds.has(endpointId) ? endpointId : fallbackId,
  };
};
