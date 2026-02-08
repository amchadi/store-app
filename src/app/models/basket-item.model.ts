import { Product } from "./product.model";

export interface BasketItem {
  id: string;
  basket_id?: string;
  product_id?: string;
  quantity: number;
  price: number;      
  created_at?: string;
}

export interface BasketItemWithProduct extends BasketItem {
  product: Product;
}
