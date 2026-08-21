import type { EndpointDoc } from './model';

const searchableText = (endpoint: EndpointDoc) =>
  [
    endpoint.name,
    endpoint.summary,
    endpoint.method,
    endpoint.path,
    endpoint.category,
    ...endpoint.pathParams.flatMap((parameter) => [
      parameter.name,
      parameter.description,
    ]),
    ...endpoint.queryParams.flatMap((parameter) => [
      parameter.name,
      parameter.description,
    ]),
    ...endpoint.groups.flatMap((group) => [
      group.name,
      ...(group.aliases ?? []),
      ...group.fields,
      ...(group.itemFields ?? []),
    ]),
    ...endpoint.columns,
  ]
    .join(' ')
    .toLocaleLowerCase('es');

export const filterEndpoints = (endpoints: EndpointDoc[], query: string) => {
  const terms = query
    .trim()
    .toLocaleLowerCase('es')
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return endpoints;

  return endpoints.filter((endpoint) => {
    const content = searchableText(endpoint);
    return terms.every((term) => content.includes(term));
  });
};
