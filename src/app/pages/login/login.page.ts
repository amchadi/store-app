import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButton, IonSpinner, IonItem, IonLabel, IonCard, IonButtons, IonCardContent, IonInput
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  personOutline, mailOutline, keyOutline, lockClosed,eyeOffOutline,eyeOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth.service';
import { SupabaseService } from 'src/app/core/supabase.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButtons,
    FormsModule, IonIcon, IonButton, IonSpinner, IonItem, IonInput, IonLabel, ReactiveFormsModule, IonCard, IonCardContent]
})
export class LoginPage implements OnInit {
  persone = personOutline;
  keyOutline = keyOutline;
  mailOutline = mailOutline;
  lockClosed = lockClosed;
  eyeOffOutline = eyeOffOutline;
  eyeOutline = eyeOutline;
  loading = false;
  showPassword = false;
  submitted = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private supabase: SupabaseService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  isInvalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  async submit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.toast('Merci de remplir email et mot de passe.');
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();

    try {
      // 1) Login
      await this.auth.signIn(email!, password!);

      // 2) Current user
      const user = await this.auth.getUser();
      if (!user) throw new Error('Utilisateur introuvable');

      // 3) Get memberships (stores)
      const { data, error } = await this.supabase
        .supa()
        .from('store_users')
        .select('store_id, is_owner, stores ( id, name )')
        .eq('user_id', user.id);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Aucune boutique associée à ce compte');

      // 4) Choose first store (for now)
      const firstStore = data[0].stores as any;
      if (firstStore)
        localStorage.setItem('currentStoreId', firstStore.id);

      // 5) Go dashboard
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });

    } catch (e: any) {
      await this.showLoginError(e)
    } finally {
      this.loading = false;
    }
  }
 private async  showLoginError(error: any) {

  const msg =
    error?.message?.toLowerCase().includes('invalid login credentials')
      ? 'Email ou mot de passe incorrect.'
      : 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';

  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 2500,
    position: 'top',
    color: 'danger',
  });

  await toast.present();
}

  async forgotPassword() {
    await this.toast('Reset password: à ajouter (si بغيتي نديرها لك).');
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  private async toast(message: string) {
    //   const t = await this.toastCtrl.create({ message, duration: 2200, position: 'top' });
    // await t.present();
  }

  ngOnInit() {
  }

}
