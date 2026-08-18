import type { EndpointDoc } from './model';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const selectedGroups = (body: unknown, key: string) => {
  if (!isObject(body) || !Array.isArray(body[key])) return null;
  return new Set(
    body[key].filter((item): item is string => typeof item === 'string'),
  );
};

const groupFields = (endpoint: EndpointDoc) =>
  new Map(endpoint.groups.map((group) => [group.name, new Set(group.fields)]));

const projectGroupRecord = (
  value: JsonObject,
  selected: Set<string>,
  knownGroups: Set<string>,
  fieldsByGroup: Map<string, Set<string>>,
) =>
  Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => (knownGroups.has(key) ? selected.has(key) : true))
      .map(([key, groupValue]) => {
        const fields = fieldsByGroup.get(key);
        if (!fields || !isObject(groupValue) || fields.size === 0)
          return [key, groupValue];
        return [
          key,
          Object.fromEntries(
            Object.entries(groupValue).filter(([field]) => fields.has(field)),
          ),
        ];
      }),
  );

const projectDetails = (
  value: unknown,
  selected: Set<string>,
  knownGroups: Set<string>,
  fieldsByGroup: Map<string, Set<string>>,
) => {
  if (!Array.isArray(value)) return value;
  return value.map((item) =>
    isObject(item)
      ? projectGroupRecord(item, selected, knownGroups, fieldsByGroup)
      : item,
  );
};

export const projectResponseExample = (
  endpoint: EndpointDoc,
  requestBody: unknown = endpoint.requestExample,
) => {
  const example = clone(endpoint.responseExample);
  if (!example || endpoint.groups.length === 0) return example;

  const groups = selectedGroups(requestBody, 'grupos');
  if (!groups || !isObject(example)) return example;

  const detail = selectedGroups(requestBody, 'detalle');
  const knownGroups = new Set(endpoint.groups.map((group) => group.name));
  const fieldsByGroup = groupFields(endpoint);
  const collection = Object.keys(example).find(
    (key) => Array.isArray(example[key]) && key !== 'detalle',
  );
  const result: JsonObject = { ...example };

  if (!collection || !Array.isArray(example[collection])) {
    for (const [key, value] of Object.entries(result)) {
      if (isObject(value)) {
        result[key] = projectGroupRecord(
          value,
          groups,
          knownGroups,
          fieldsByGroup,
        );
      }
    }
    return result;
  }

  result[collection] = example[collection].map((item) => {
    if (!isObject(item)) return item;
    const projected = projectGroupRecord(
      item,
      groups,
      knownGroups,
      fieldsByGroup,
    );
    if (detail && Array.isArray(item.detalle)) {
      projected.detalle = projectDetails(
        item.detalle,
        detail,
        knownGroups,
        fieldsByGroup,
      );
    }
    return projected;
  });
  return result;
};
