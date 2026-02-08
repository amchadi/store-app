import { BasketItem } from "./basket-item.model";

export type BasketStatus = 'OPEN' | 'VALIDATED' | 'CANCELLED';

export interface Basket {
  id: string;
  store_id: string;
  user_id: string;
  status: BasketStatus;
  created_at: string;
}
export interface BasketWithItems extends Basket {
  items: BasketItem[];
}