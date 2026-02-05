import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service'; 
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  /* =========================
     AUTHENTIFICATION
     ========================= */

  /**
   * Connexion via email + mot de passe
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.supa().auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Inscription via email + mot de passe
   */
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.supa().auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Déconnexion
   */
  async signOut() {
    const { error } = await this.supabase.supa().auth.signOut();
    if (error) throw error;
  }

  /* =========================
     SESSION & UTILISATEUR
     ========================= */

  /**
   * Récupère la session actuelle (ou null)
   */
  async getSession() {
    const { data, error } = await this.supabase.supa().auth.getSession();
    if (error) throw error;
    return data.session;
  }

  /**
   * Récupère l'utilisateur actuel (ou null)
   */
  async getUser() {
    const { data, error } = await this.supabase.supa().auth.getUser();
    if (error) throw error;
    return data.user;
  }

  /**
   * Envoie un email de réinitialisation du mot de passe
   */
  async resetPassword(email: string) {
    const { error } = await this.supabase.supa().auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  /**
   * Écoute les changements d'état auth (login/logout/refresh)
   * ⚠️ Retourne l'objet Supabase => appelle .data.subscription.unsubscribe() pour arrêter
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.supa().auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}
