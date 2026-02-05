import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonNote,IonButton,IonLabel,IonItem,IonBadge,
  IonCardSubtitle,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonButtons,IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonNote,IonButton,IonLabel,
    IonItem,IonBadge,IonCardSubtitle,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonButtons,IonBackButton]
})
export class ProductDetailPage implements OnInit {
   product = {
    name: 'Coca Cola 1L',
    description: 'Boisson gazeuse 1 litre',
    stock: 20,
    buyPrice: 6,
    sellPrice: 8,
    status: 'OK',
    statusColor: 'success',

    // 🔹 Infos commerciales
    soldToday: 5,
    soldThisMonth: 120,
    totalRevenue: 960,        // CA = sellPrice * soldThisMonth
    totalProfit: 240,         // (sell - buy) * soldThisMonth
    averageSellPrice: 8,
    lastSaleDate: '14/01/2026'
  };

  get profit() {
    return this.product.sellPrice - this.product.buyPrice;
  }
  constructor(private router: Router) { }

  ngOnInit() {
  }

  sellProduct() {
    this.router.navigateByUrl('/tabs/sales');
  
  }

  // ➕ Augmenter le stock
  increaseStock() {
    this.product.stock++;
    this.updateStatus();
  }


  updateStatus() {
    if (this.product.stock <= 0) {
      this.product.status = 'Rupture';
      this.product.statusColor = 'danger';
    } else if (this.product.stock <= 5) {
      this.product.status = 'Stock bas';
      this.product.statusColor = 'warning';
    } else {
      this.product.status = 'OK';
      this.product.statusColor = 'success';
    }
  }
}
