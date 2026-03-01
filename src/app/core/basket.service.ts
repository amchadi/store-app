import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BasketItem, BasketItemWithProduct } from '../models/basket-item.model';
import { Product } from '../models/product.model';
import { Basket } from '../models/basket.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
    constructor(private supabase: SupabaseService) { }

    private getStoreId() {
        const id = localStorage.getItem('currentStoreId');
        if (!id) throw new Error('Aucune boutique sélectionnée');
        return id;
    }

    /** Récupérer ou créer panier en draft */
    async getOrCreateBasket(): Promise<Basket> {
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
            .maybeSingle();

        if (error) throw error;
        return data as Basket;
    }
    async updateItem(product: BasketItem) {
        if (product.quantity < 0) product.quantity = 0;


        if (product.quantity === 0) {
            const { error } = await this.supabase
                .supa()
                .from('basket_items')
                .delete()
                .eq('id', product.id);

            if (error) throw error;
            return;
        }

        const { error } = await this.supabase
            .supa()
            .from('basket_items')
            .update({
                quantity: product.quantity,
                price: product.price
            })
            .eq('id', product.id);

        if (error) throw error;
    }


    /** Ajouter produit au panier */
    async addProduct(product: Product, quantity: number) {
        const basket = await this.getOrCreateBasket();

        const { data: existing } = await this.supabase
            .supa()
            .from('basket_items')
            .select('*')
            .eq('basket_id', basket.id)
            .eq('product_id', product.id)
            .maybeSingle();

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
                purchase_price:product.purchase_price
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
    async deleteBasketItemById(basketItemId: string) {
        const { error } = await this.supabase
            .supa()
            .from('basket_items')
            .delete()
            .eq('id', basketItemId);

        if (error) throw error;
    }

    /**
 * Récupère un seul produit du panier
 * en fonction du product_id et du basket_id
 *
 * @param productId - Identifiant du produit
 * @param basketId  - Identifiant du panier
 * @returns L'élément du panier ou null s'il n'existe pas
 */
    async getOneProductByBasket(product: Product): Promise<BasketItemWithProduct | null> {
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
            // Filtre par produit<
            .eq('product_id', product.id)
            // Filtre par panier
            .eq('basket_id', basket.id)
            // Peut retourner null si aucun résultat
            .maybeSingle();

        // Gestion des erreurs Supabase
        if (error) {
            console.error('Erreur lors de la récupération du produit du panier', error);
            throw error;
        }

        // Retourne soit l'objet, soit null
        return data as unknown as BasketItemWithProduct;
    }

   /**
 * Valide le panier via RPC (transaction):
 * - Vérifie stock
 * - Décrémente stock
 * - Valide le panier (validated_at)
 */
async validateBasket(dateValidate: string) {
  const userId = (await this.supabase.supa().auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const basket = await this.getOrCreateBasket();

  const { data, error } = await this.supabase
    .supa()
    .rpc('validate_basket_and_decrement_stock', {
      p_basket_id: basket.id,
      p_validated_at: dateValidate, // ISO string OK
    });

  if (error) throw error;

  // data = row de baskets (updated)
  return data;
}


    /**
    * Récupère les paniers validés (ventes)
    * pour le store courant 
    */
    async getValidatedBaskets() {
        const storeId = localStorage.getItem('currentStoreId');
        if (!storeId) {
            throw new Error('Aucune boutique sélectionnée');
        }
        const { data, error } = await this.supabase
            .supa()
            .from('baskets')
            .select(`
        id,
    validated_at,
    status,
    user_id,
    seller:profiles (
      full_name
    ),
    basket_items (
      id,
      quantity,
      price
    )
      `)
            .eq('store_id', storeId)
            .in('status', ['validated', 'cancelled'])
            .order('validated_at', { ascending: false });


        if (error) {
            throw error;
        }

        return data ?? [];
    }

    /**
 * Annule le panier courant :
 * - Récupère le panier draft
 * - Met à jour le statut du panier à "cancelled"
 * - Redirige vers la page produits
 */
    async cancelCurrentBasket(): Promise<void> {
        try {
            // 1️⃣ Récupérer le panier draft courant (ou le créer s’il n’existe pas)
            const basket = await this.getOrCreateBasket();

            if (!basket) return;

            // 2️⃣ Mettre à jour le statut du panier à "cancelled"
            await this.supabase
                .supa()
                .from('baskets')
                .update({ status: 'cancelled' })
                .eq('id', basket.id);

            return;

        } catch (error) {
            console.error('Erreur lors de l’annulation du panier', error);
            throw error;
        }
    }

}
