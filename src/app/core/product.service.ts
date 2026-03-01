import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Product } from '../models/product.model';

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

  deleteProduct(productId: any) {
  return this.supabase.supa()
    .from('products')
    .delete()
    .eq('id', productId);
}
  async getProductDetails(productId: string) {

  // 1️⃣ Récupérer les informations du produit
  const { data: product, error: productError } = await this.supabase.supa()
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError) throw productError;

  // 2️⃣ Récupérer les ventes liées à ce produit
  // On filtre uniquement les paniers validés
  const { data: sales, error: salesError } = await this.supabase.supa()
    .from('basket_items')
    .select(`
      quantity,
      price,
      purchase_price,
      created_at,
      baskets!inner(status)
    `)
    .eq('product_id', productId)
    .eq('baskets.status', 'validated');

  if (salesError) throw salesError;

  // ================================
  // 3️⃣ Calcul des statistiques
  // ================================

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let soldToday = 0;
  let soldThisMonth = 0;
  let totalRevenue = 0;
  let totalProfit = 0;
  let lastSaleDate:any = null;

  // Parcours de toutes les ventes
  sales.forEach(item => {

    const saleDate = new Date(item.created_at);
    const saleDay = saleDate.toISOString().split('T')[0];

    // Calcul du chiffre d'affaires total
    totalRevenue += item.price * item.quantity;

    // Calcul du bénéfice total
    totalProfit += (item.price - item.purchase_price) * item.quantity;

    // Calcul des ventes du jour
    if (saleDay === today) {
      soldToday += item.quantity;
    }

    // Détermination de la dernière date de vente
    if (!lastSaleDate || saleDate > new Date(lastSaleDate)) {
      lastSaleDate = saleDate;
    }
  });

  // Calcul des ventes du mois en cours
  soldThisMonth = sales
    .filter(item => {
      const d = new Date(item.created_at);
      return d.getMonth() === currentMonth &&
             d.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calcul du prix moyen de vente
  const averageSellPrice =
    soldThisMonth > 0 ? totalRevenue / soldThisMonth : 0;

  // ================================
  // 4️⃣ Retour de l'objet final
  // ================================

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    stock: product.stock,
    buyPrice: product.purchase_price,
    sellPrice: product.sale_price,
    status: product.stock > 0 ? 'OK' : 'Rupture',
    statusColor: product.stock > 0 ? 'success' : 'danger',

    soldToday,
    soldThisMonth,
    totalRevenue,
    totalProfit,
    averageSellPrice: Number(averageSellPrice.toFixed(2)),
    lastSaleDate: lastSaleDate
      ? new Date(lastSaleDate).toLocaleDateString()
      : '-'
  };
}
async updateProductStock(productId: string, newStock: number) {

  // 🔹 Requête update vers Supabase
  const { error } = await this.supabase
    .supa()
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId);

  // 🔹 Gestion d’erreur
  if (error) {
    throw error;
  }
}
async updateProduct(id: string,name:string,purchase_price:number,sale_price:number) {

  // 🔹 Requête update vers Supabase
  const { error } = await this.supabase
    .supa()
    .from('products')
    .update({ name: name,purchase_price:purchase_price,sale_price:sale_price })
    .eq('id', id);

  // 🔹 Gestion d’erreur
  if (error) {
    throw error;
  }
}
  async getProductById(productId: string) {

  // 🔹 Requête pour récupérer un seul produit par son ID
  const { data, error } = await this.supabase
    .supa()
    .from('products')
    .select('*')
    .eq('id', productId)
    .single(); // On attend un seul résultat

  // 🔹 Gestion d’erreur
  if (error) {
    console.error('Erreur lors de la récupération du produit', error);
    throw error;
  }

  // 🔹 Retourne le produit
  return data;
}
}
