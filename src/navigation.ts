export const endpointFromLocation = (location: Pick<Location, 'search'>) =>
  new URLSearchParams(location.search).get('endpoint');

export const endpointUrl = (
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  endpointId: string,
) => {
  const params = new URLSearchParams(location.search);
  params.set('endpoint', endpointId);
  return `${location.pathname}?${params.toString()}${location.hash}`;
};
