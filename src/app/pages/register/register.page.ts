import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonSpinner,IonIcon,IonInput,IonItem,IonCard,IonCardContent } from '@ionic/angular/standalone';
import {
  personAddOutline,personOutline,storefrontOutline,mailOutline,keyOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { SupabaseService } from 'src/app/core/supabase.service';
import { StoreService } from 'src/app/core/store.service';
import { ProfileService } from 'src/app/core/profile.service';
import { passwordMatchValidator } from './Validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,ReactiveFormsModule, CommonModule, FormsModule,IonButton,IonSpinner,IonIcon,IonInput,IonItem,IonCard,IonCardContent ]
})
export class RegisterPage implements OnInit {
  personAddOutline = personAddOutline;
  personOutline = personOutline;
  storefrontOutline = storefrontOutline;
  mailOutline=mailOutline;
  keyOutline = keyOutline;
  ngOnInit() {
  }
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  submitted = false;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    shopName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  },
  {
    validators: passwordMatchValidator
  }
);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private profileService:ProfileService,
    private storeService:StoreService
  ) {}

  isInvalid(controlName: string) {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  showError(controlName: string) {
    return this.isInvalid(controlName);
  }

async submit() {
  this.submitted = true;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }


  this.loading = true;

  const { email, password, shopName, fullName } = this.form.getRawValue();

  try {
    // 1️⃣ Créer le user (auth)
    const data = await this.auth.signUp(email!, password!);
    const userId = data.user?.id;
    if (!userId) throw new Error('Utilisateur non créé');

    // 2️⃣ Créer le profil (nom complet)
    await this.profileService.createProfile(userId, fullName!);

    // 3️⃣ Créer la boutique + lier le owner
    const store = await this.storeService.createStoreAsOwner(
      shopName!,
      userId
    );

    // 4️⃣ Sauvegarder la boutique courante
    localStorage.setItem('currentStoreId', store.id);

    // 5️⃣ Redirection
    this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });

  } catch (e: any) {
    console.error('Erreur signup', e);
  } finally {
    this.loading = false;
  }
}




  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  // private async toast(message: string) {
  //   const t = await this.toastCtrl.create({
  //     message,
  //     duration: 2200,
  //     position: 'top',
  //   });
  //   await t.present();
  // }
}
