import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class BasketService {
  constructor(private supabase: SupabaseService) {}

  private getStoreId() {
    const id = localStorage.getItem('currentStoreId');
    if (!id) throw new Error('Aucune boutique sélectionnée');
    return id;
  }

  /** Récupérer ou créer panier en draft */
  async getOrCreateBasket() {
    const storeId = this.getStoreId();

    const { data: existing } = await this.supabase
      .supa()
      .from('baskets')
      .select('*')
      .eq('store_id', storeId)
      .eq('status', 'draft')
      .maybeSingle();

    if (existing) return existing;

    const { data: user } = await this.supabase.supa().auth.getUser();

    const { data, error } = await this.supabase
      .supa()
      .from('baskets')
      .insert({
        store_id: storeId,
        user_id: user.user!.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /** Ajouter produit au panier */
  async addProduct(product: any,quantity:number) {
    const basket = await this.getOrCreateBasket();

    // check si produit déjà موجود
    const { data: existing } = await this.supabase
      .supa()
      .from('basket_items')
      .select('*')
      .eq('basket_id', basket.id)
      .eq('product_id', product.id)
      .single();

    if (existing) {
      return this.supabase
        .supa()
        .from('basket_items')
        .update({ quantity: quantity })
        .eq('id', existing.id);
    }

    return this.supabase
      .supa()
      .from('basket_items')
      .insert({
        basket_id: basket.id,
        product_id: product.id,
        quantity: 1,
        price: product.sale_price,
      });
  }

  /** Charger panier */
  async getBasketItems() {
    const basket = await this.getOrCreateBasket();

    const { data, error } = await this.supabase
      .supa()
      .from('basket_items')
      .select(`
        id,
        quantity,
        price,
        product:products (*)
      `)
      .eq('basket_id', basket.id);

    if (error) throw error;
    return data;
  }


}
