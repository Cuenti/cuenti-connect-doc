export const endpointFromLocation = (location: Pick<Location, 'search'>) =>
  new URLSearchParams(location.search).get('endpoint');

export const mcpGuideFromLocation = (location: Pick<Location, 'search'>) =>
  new URLSearchParams(location.search).get('section') === 'mcp' &&
  new URLSearchParams(location.search).get('server') !== 'stats';

export const statsMcpGuideFromLocation = (location: Pick<Location, 'search'>) =>
  new URLSearchParams(location.search).get('section') === 'mcp' &&
  new URLSearchParams(location.search).get('server') === 'stats';

export const catalogGuideFromLocation = (location: Pick<Location, 'search'>) =>
  new URLSearchParams(location.search).get('section') === 'catalogos';

export const endpointUrl = (
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  endpointId: string,
) => {
  const params = new URLSearchParams(location.search);
  params.set('endpoint', endpointId);
  params.delete('section');
  return `${location.pathname}?${params.toString()}${location.hash}`;
};

export const mcpGuideUrl = (
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
) => {
  const params = new URLSearchParams(location.search);
  params.delete('endpoint');
  params.set('section', 'mcp');
  params.set('server', 'erp');
  return `${location.pathname}?${params.toString()}${location.hash}`;
};

export const statsMcpGuideUrl = (
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
) => {
  const params = new URLSearchParams(location.search);
  params.delete('endpoint');
  params.set('section', 'mcp');
  params.set('server', 'stats');
  return `${location.pathname}?${params.toString()}${location.hash}`;
};

export const catalogGuideUrl = (
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
) => {
  const params = new URLSearchParams(location.search);
  params.delete('endpoint');
  params.set('section', 'catalogos');
  return `${location.pathname}?${params.toString()}${location.hash}`;
};
