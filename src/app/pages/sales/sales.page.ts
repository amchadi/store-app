import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  imports: [
    CommonModule,
    FormsModule, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class SalesPage {
  productName = '';
  qty = 1;
  unitPrice: number | null = null;
  saleDate = new Date().toISOString().slice(0, 10);

  getTotal(): number {
    return Number(this.qty) * Number(this.unitPrice || 0);
  }

  confirmSale() {
    console.log({
      productName: this.productName,
      qty: this.qty,
      unitPrice: this.unitPrice,
      saleDate: this.saleDate,
      total: this.getTotal(),
    });
  }
}
