import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonCard,IonCardContent,IonIcon,IonButtons,IonBadge } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  addCircleOutline,timeOutline,personOutline,chevronForwardOutline
} from 'ionicons/icons';
import { BasketService } from 'src/app/core/basket.service';


@Component({
  selector: 'app-list-baskets',
  templateUrl: './list-baskets.page.html',
  styleUrls: ['./list-baskets.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,IonBadge, FormsModule,IonButton,IonCard,IonCardContent,IonIcon,IonButtons,]
})
export class ListBasketsPage implements OnInit {
  add = addCircleOutline;
  timeOutline= timeOutline;
  personOutline=personOutline;
  chevronForwardOutline = chevronForwardOutline;
  sales: any[] = [];
  isLoading = false;

  constructor(private basketService: BasketService) {}

  async ngOnInit() {
    await this.loadSales();
  }

  /**
   * Chargement des ventes (paniers validés)
   */
  async loadSales() {
    this.isLoading = true;

    try {
      this.sales = await this.basketService.getValidatedBaskets() as any;
    } catch (error) {
      console.error('Erreur lors du chargement des ventes', error);
    } finally {
      this.isLoading = false;
    }
  }
  /**
 * Calcule le nombre total de produits vendus dans un panier
 * (somme des quantités)
 */
calculateTotalQuantity(items: any[]): number {
  if (!items?.length) return 0;

  return items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
}
/**
 * Retourne le libellé produit / produits selon la quantité
 */
getProductLabel(qty: number): string {
  return qty === 1 ? 'produit' : 'produits';
}


   /**
   * Calcul du total d'un panier à partir de ses articles
   */
  calculateBasketTotal(items: any[]): number {
    if (!items?.length) return 0;

    return items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

 /**
 * Format date + heure : dd/MM HH:mm
 * Exemple : 07/02/2026 22:56
 */
formatDateTimeShort(value: string | null): string {
  if (!value) return '-';

  const d = new Date(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}


}
