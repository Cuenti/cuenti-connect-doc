export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];

export type HistoricalJsonValue = JsonValue | string | null;

export interface PaginatedResponse<T> {
  pagina: number;
  cantidad: number;
  [collection: string]: number | T[];
}

export interface Product {
  id_producto: number;
  sku?: string | null;
  [field: string]: JsonValue | undefined;
}

export interface Bank {
  id_banco: number;
  nombre?: string | null;
  numero_cuenta?: string | null;
  saldo?: number | null;
  config?: HistoricalJsonValue;
  [field: string]: JsonValue | undefined;
}

export interface Category {
  id_categoria: number;
  nombre_categoria?: string | null;
  sucursales?: HistoricalJsonValue;
  subcategorias: Category[];
  [field: string]: JsonValue | Category[] | undefined;
}

export interface Employee {
  id_empleado: number;
  nombre_completo?: string | null;
  sucursal_adicional?: HistoricalJsonValue;
  [field: string]: JsonValue | undefined;
}

export interface PaymentMethod {
  id_medio_pago: number;
  nombre_medio_pago?: string | null;
  config?: HistoricalJsonValue;
  [field: string]: JsonValue | undefined;
}

export type ProductSearchResponse = PaginatedResponse<Product> & {
  productos: Product[];
};

export type BankSearchResponse = PaginatedResponse<Bank> & {
  bancos: Bank[];
};

export type CategorySearchResponse = PaginatedResponse<Category> & {
  categorias: Category[];
};

export type EmployeeSearchResponse = PaginatedResponse<Employee> & {
  empleados: Employee[];
};

export type PaymentMethodSearchResponse = PaginatedResponse<PaymentMethod> & {
  medios_pago: PaymentMethod[];
};

export type EndpointResponseContracts = {
  consultaProductoPaginadaMCP: ProductSearchResponse;
  buscarBancos: BankSearchResponse;
  buscarCategorias: CategorySearchResponse;
  buscarEmpleados: EmployeeSearchResponse;
  buscarMediosPago: PaymentMethodSearchResponse;
};

export const normalizeHistoricalJsonValue = (
  value: unknown,
): HistoricalJsonValue => {
  if (value === null) return null;
  if (typeof value !== 'string') return value as JsonValue;

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === 'object'
      ? (parsed as JsonValue)
      : value;
  } catch {
    return value;
  }
};
