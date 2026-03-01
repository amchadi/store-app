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

  constructor(private basketService: BasketService, private router: Router) {}

  async ngOnInit() {
    await this.loadSales();
  }
  async ionViewWillEnter(){
     await this.loadSales();
   }
   // Calcule le total des ventes pour un jour donné
getDayTotal(date: string): number {

  const targetDate = new Date(date);

  return this.sales
    .filter(s => {
      const d = new Date(s.validated_at);

      return (
        d.getFullYear() === targetDate.getFullYear() &&
        d.getMonth() === targetDate.getMonth() &&
        d.getDate() === targetDate.getDate() &&
        s.status === 'validated' // نحسب غير validated
      );
    })
    .reduce((sum, s) => {
       const v = this.calculateBasketTotal(s.basket_items);

      const num = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));

      return sum + (isNaN(num) ? 0 : num);
    }, 0);
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

     const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return total.toFixed(2)
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

  return `${hh}:${min}`;
}
/**
 * Vérifie si deux dates sont dans des jours différents
 */
isNewDay(current: string, previous: string): boolean {
  if (!previous) return true;

  const d1 = new Date(current);
  const d2 = new Date(previous);

  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  );
}

/**
 * Format date  (ex: 12 février 2026)
 */
formatDateOnly(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}
openSaleDetail(basketId: string) {
  this.router.navigate(['/tabs/basket-detail', basketId]);
}
}
