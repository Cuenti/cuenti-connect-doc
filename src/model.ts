export const categories = [
  'Productos e inventario',
  'Categorías e impuestos',
  'Terceros',
  'Maestros',
  'Facturas e historiales',
  'Cartera',
  'Comandas',
  'Documentos comerciales',
] as const;

export type EndpointCategory = (typeof categories)[number];
export type HttpMethod = 'GET' | 'POST';
export type EndpointKind = 'query' | 'mutation';

export interface ParameterSpec {
  name: string;
  description: string;
  required: boolean;
  type?: string;
  typeLabel?: string;
  defaultValue?: string;
  allowedValues?: string[];
  allowedValueLabels?: Record<string, string>;
  example?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  nullable?: boolean;
}

export interface HeaderSpec extends ParameterSpec {
  sensitive?: boolean;
}

export interface FieldGroup {
  name: string;
  fields: string[];
  description?: string;
}

export interface CompatibilityMetadata {
  columns: string[];
}

export interface FieldSpec extends ParameterSpec {
  path?: string;
  fields?: FieldSpec[];
  itemFields?: FieldSpec[];
  minimumItems?: number;
}

export interface EndpointPreset {
  id: string;
  name: string;
  description: string;
  path?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}

export interface EndpointGuidanceRow {
  value: string;
  field: string;
  use: string;
  rule: string;
}

export interface EndpointGuidance {
  title: string;
  intro: string;
  rows: EndpointGuidanceRow[];
  notes: string[];
  examples: Array<{ title: string; value: unknown }>;
}

export interface ErrorSpec {
  status: string;
  description: string;
}

export interface CachePolicy {
  mode: 'cacheable' | 'bypass';
  ttl?: string;
  invalidates?: string[];
  description?: string;
}

export interface EndpointDoc {
  id: string;
  name: string;
  summary: string;
  method: HttpMethod;
  path: string;
  category: EndpointCategory;
  kind: EndpointKind;
  status: 'implemented';
  cache: CachePolicy;
  headers: HeaderSpec[];
  pathParams: ParameterSpec[];
  queryParams: ParameterSpec[];
  bodyRequired: boolean;
  bodyDescription?: string;
  bodyType?: string;
  bodyFields: FieldSpec[];
  requestExample?: unknown;
  responseContract?: string;
  responseExample?: unknown;
  groups: FieldGroup[];
  columns: string[];
  compatibility?: CompatibilityMetadata;
  presets: EndpointPreset[];
  guidance?: EndpointGuidance;
  errors: ErrorSpec[];
  notes: string[];
  rateLimit?: string;
  queue?: string;
  tryIt?: {
    path: Record<string, string>;
    query: Record<string, string>;
    body?: unknown;
  };
}

export interface CanonicalRegistry {
  version: string;
  endpoints: EndpointDoc[];
}

export const upcomingCapabilities = [
  {
    id: 'create-order',
    name: 'Crear comandas',
    description: 'API nueva para registrar pedidos de mesa de forma segura.',
  },
  {
    id: 'inventory-count',
    name: 'Conteo físico de inventario',
    description: 'Flujo de conteo y conciliación de existencias.',
  },
  {
    id: 'create-invoice',
    name: 'Crear facturas o compras',
    description: 'API nueva de escritura para transacciones comerciales.',
  },
  {
    id: 'invoice-pdf',
    name: 'Documento PDF de factura',
    description: 'Generación u obtención del documento de una factura.',
  },
  {
    id: 'void-invoice',
    name: 'Anular facturas',
    description: 'Operación transaccional con validaciones e invalidación.',
  },
] as const;
