import type { EndpointDoc } from './model';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

type GroupProjection = {
  name: string;
  fields: Set<string>;
  itemFields: Set<string>;
};

type SelectedGroups = Map<string, string>;

const selectedGroups = (
  body: unknown,
  key: string,
  groupsByName: Map<string, GroupProjection>,
) => {
  if (!isObject(body) || !Array.isArray(body[key])) return null;
  const selected: SelectedGroups = new Map();
  for (const name of body[key].filter(
    (item): item is string => typeof item === 'string',
  )) {
    const group = groupsByName.get(name);
    if (!group) {
      selected.set(name, name);
      continue;
    }
    const requestedName = selected.get(group.name);
    if (!requestedName || name === group.name) {
      selected.set(group.name, name);
    }
  }
  return selected;
};

const groupProjections = (endpoint: EndpointDoc) => {
  const groupsByName = new Map<string, GroupProjection>();
  for (const group of endpoint.groups) {
    const projection: GroupProjection = {
      name: group.name,
      fields: new Set(group.fields),
      itemFields: new Set(group.itemFields ?? []),
    };
    groupsByName.set(group.name, projection);
    for (const alias of group.aliases ?? [])
      groupsByName.set(alias, projection);
  }
  return groupsByName;
};

const projectGroupValue = (value: unknown, fields: Set<string>) => {
  if (fields.size === 0) return value;
  if (Array.isArray(value)) {
    return value.map((item) =>
      isObject(item)
        ? Object.fromEntries(
            Object.entries(item).filter(([field]) => fields.has(field)),
          )
        : item,
    );
  }
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value).filter(([field]) => fields.has(field)),
  );
};

const projectGroupRecord = (
  value: JsonObject,
  selected: SelectedGroups,
  groupsByName: Map<string, GroupProjection>,
) => {
  const projected: JsonObject = {};
  for (const [key, groupValue] of Object.entries(value)) {
    const group = groupsByName.get(key);
    const canonicalKey = group?.name ?? key;
    if (group && !selected.has(canonicalKey)) continue;

    const fields = group
      ? Array.isArray(groupValue) && group.itemFields.size > 0
        ? group.itemFields
        : group.fields
      : new Set<string>();
    const outputKey = group
      ? (selected.get(canonicalKey) ?? canonicalKey)
      : key;
    const hasOutputValue = Object.keys(projected).includes(outputKey);
    if (hasOutputValue && key !== canonicalKey) continue;
    projected[outputKey] = projectGroupValue(groupValue, fields);
  }
  return projected;
};

const projectDetails = (
  value: unknown,
  selected: SelectedGroups,
  groupsByName: Map<string, GroupProjection>,
) => {
  if (!Array.isArray(value)) return value;
  return value.map((item) =>
    isObject(item) ? projectGroupRecord(item, selected, groupsByName) : item,
  );
};

export const projectResponseExample = (
  endpoint: EndpointDoc,
  requestBody: unknown = endpoint.requestExample,
) => {
  const example = clone(endpoint.responseExample);
  if (!example || endpoint.groups.length === 0) return example;

  const groupsByName = groupProjections(endpoint);
  const groups = selectedGroups(requestBody, 'grupos', groupsByName);
  if (!groups || !isObject(example)) return example;

  const detail = selectedGroups(requestBody, 'detalle', groupsByName);
  const collection = Object.keys(example).find(
    (key) => Array.isArray(example[key]) && key !== 'detalle',
  );
  const result: JsonObject = { ...example };

  if (!collection || !Array.isArray(example[collection])) {
    for (const [key, value] of Object.entries(result)) {
      if (isObject(value)) {
        result[key] = projectGroupRecord(value, groups, groupsByName);
      }
    }
    return result;
  }

  result[collection] = example[collection].map((item) => {
    if (!isObject(item)) return item;
    const projected = projectGroupRecord(item, groups, groupsByName);
    if (detail && Array.isArray(item.detalle)) {
      projected.detalle = projectDetails(item.detalle, detail, groupsByName);
    }
    return projected;
  });
  return result;
};
