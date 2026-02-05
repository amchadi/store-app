import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";

@Injectable({ providedIn: 'root' })
export class StoreService {
    constructor(private supabase: SupabaseService) { }
    @Injectable({ providedIn: 'root' })


    /**
     * Crée une boutique et lie l'utilisateur comme propriétaire
     */
    async createStoreAsOwner(storeName: string, userId: string) {
        // 1️⃣ Création de la boutique
        const { data: store, error: storeError } = await this.supabase
            .supa()
            .from('stores')
            .insert({ name: storeName,created_by: userId })
            .select()
            .single();

        if (storeError) throw storeError;

        // 2️⃣ Lier l'utilisateur comme OWNER
        const { error: linkError } = await this.supabase
            .supa()
            .from('store_users')
            .insert({
                store_id: store.id,
                user_id: userId,
                is_owner: true,
                
            });

        if (linkError) throw linkError;

        return store; 
    }

    async getMyStores() {
        return this.supabase
            .supa()
            .from('stores')
            .select(`
        id,
        name,
        store_users!inner ( is_owner )
      `);
    }
}
