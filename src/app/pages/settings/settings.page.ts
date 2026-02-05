import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonNote,
  IonIcon,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import {
  qrCodeOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent]
})
export class SettingsPage implements OnInit {
  qrCode = qrCodeOutline;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }
  async logout() {
    await this.auth.signOut();
    localStorage.clear();

    this.router.navigateByUrl('/login', { replaceUrl: true });

  }

}
