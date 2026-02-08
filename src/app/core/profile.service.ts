import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(private supabase: SupabaseService) {}

  /**
   * Crée le profil utilisateur avec son nom complet
   */
  async createProfile(userId: string, fullName: string) {
    const { error } = await this.supabase
      .supa()
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName
      });

    if (error) throw error;
  }
}
