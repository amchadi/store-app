export interface Product {
  id: string;
  store_id: string;
  name: string;
  stock: number;
  purchase_price: number;
  inBasket:boolean;
  sale_price: number;
  created_at: string;
}