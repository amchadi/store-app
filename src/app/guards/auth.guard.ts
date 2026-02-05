import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase.service';

/**
 * Auth Guard
 * -----------
 * Ce guard empêche l'accès aux routes protégées
 * si l'utilisateur n'est pas authentifié.
 */
export const authGuard: CanActivateFn = async () => {

  // Injection des services nécessaires
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  /**
   * Récupération de la session actuelle
   * - Si l'utilisateur est connecté, session !== null
   * - Sinon, session === null
   */
  const { data } = await supabase.supa().auth.getSession();
  const session = data.session;

  /**
   * Cas 1 : Aucune session
   * ➜ L'utilisateur n'est pas connecté
   * ➜ Redirection vers la page de login
   */
  if (!session) {
    router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }

  /**
   * Cas 2 : Session valide
   * ➜ L'utilisateur est authentifié
   * ➜ Accès autorisé à la route protégée
   */
  return true;
};
