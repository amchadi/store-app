import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
  export class ProductService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Récupérer les produits de la boutique courante
   */
async getProductsByCurrentStore() {
  const storeId = localStorage.getItem('currentStoreId');
  if (!storeId) throw new Error('Aucune boutique sélectionnée');

  const { data, error } = await this.supabase
  .supa()
  .from('products')
  .select(`
    *,
    basket_items (
      id,
      baskets!inner (
        id,
        status
      )
    )
  `)
  .eq('store_id', storeId)
  .eq('basket_items.baskets.status', 'draft')
  .order('created_at', { ascending: false });

  if (error) throw error;
      
      
  return data.map(p => ({
    ...p,
    inBasket: Array.isArray(p.basket_items) && p.basket_items?.length > 0
  }));
}


  async createProduct(input: {
    name: string;
    stock: number;
    purchase_price: number;
    sale_price: number;
  }) {
    const storeId = localStorage.getItem('currentStoreId');

    const payload = {
      store_id: storeId,
      name: input.name.trim(),
      stock: Number(input.stock || 0),
      purchase_price: Number(input.purchase_price || 0),
      sale_price: Number(input.sale_price || 0),
    };

    const { data, error } = await this.supabase
      .supa()
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  }
}
