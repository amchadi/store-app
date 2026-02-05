export interface Product {
  id: string;
  name: string;
  sku?: string;
  buyPrice: number;
  sellPrice: number;
  stockQty: number;
  minStock?: number;
  createdAt: string;
}