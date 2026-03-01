import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCardSubtitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import {
  cashOutline, todayOutline, calendarOutline, trendingUpOutline, archiveOutline, walletOutline
} from 'ionicons/icons';
import { ProductService } from 'src/app/core/product.service';
import { Product } from 'src/app/models/product.model';
import { BasketService } from 'src/app/core/basket.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule, FormsModule, IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonIcon,
    IonButton,
    IonCardSubtitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent]
})
export class DashboardPage implements OnInit {
  cash = cashOutline;
  todayIcon = todayOutline;
  calendarIcon = calendarOutline;
  trendingUpOutline = trendingUpOutline;
  archiveOutline = archiveOutline;
  walletOutline = walletOutline
  totalProductsInStock = 0;
  totalCapital = 0;
  currentMonthTotal = 0;

  todayTotal = 180;

  monthlyTotals = [
    { month: 0, label: 'Jan', total: 4200 },
    { month: 1, label: 'Feb', total: 5100 },
    { month: 2, label: 'Mar', total: 3900 },
    { month: 3, label: 'Apr', total: 6200 },
    { month: 4, label: 'May', total: 5800 },
    { month: 5, label: 'Jun', total: 7300 },
    { month: 6, label: 'Jul', total: 6800 },
    { month: 7, label: 'Aug', total: 7900 },
    { month: 8, label: 'Sep', total: 6100 },
    { month: 9, label: 'Oct', total: 5400 },
    { month: 10, label: 'Nov', total: 8600 },
    { month: 11, label: 'Dec', total: 9200 },
  ];
months: Array<{ label: string; year: number; total: number; avgPerDay: number }> = [];
year = new Date().getFullYear();
  
  sales: any;

  get currentMonth() {
    return new Date().getMonth();
  }



  get currentMonthAvg() {
    const now = new Date();

    const daysPassed = now.getDate();

    if (daysPassed === 0) {

      return 0;
    }

    return this.currentMonthTotal / daysPassed;
  }
  constructor(private produitService: ProductService, private basketService: BasketService) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    const products = await this.produitService.getProductsByCurrentStore() as any;
    this.computeStock(products);
    this.computeCapital(products);
    this.loadSales()
  }
  generateMonthlyStatsBackwards(count: number = 12) {
  const now = new Date();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril',
    'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  this.months = [];

  for (let i = 0; i < count; i++) {
    // الشهر المستهدف = دابا - i شهر
    const target = new Date(now.getFullYear(), now.getMonth() - i-1, 1);
    const y = target.getFullYear();
    const m = target.getMonth();

    // sales ديال داك الشهر
    const salesOfMonth = this.sales.filter((s: { status: string; validated_at: string | number | Date; }) => {
      if (s.status !== 'validated') return false;
      const d = new Date(s.validated_at);
      return d.getFullYear() === y && d.getMonth() === m;
    });

    const total = salesOfMonth.reduce((sum: number, s: { basket_items: any[]; }) => {
      return sum + (Number(this.calculateBasketTotal(s.basket_items)) || 0);
    }, 0);

    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // ✅ avg: هاد الشهر على الأيام اللي دازو، اللي قبل على الشهر كامل
    const isCurrentMonth = (y === now.getFullYear() && m === now.getMonth());
    const divisor = isCurrentMonth ? now.getDate() : daysInMonth;

    const avgPerDay = divisor > 0 ? total / divisor : 0;

    this.months.push({
      label: monthNames[m],
      year: y,
      total,
      avgPerDay
    });
  }
}
  computeStock(products: any[]) {
    this.totalProductsInStock = (products || []).reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  }
  computeCapital(products: Product[]) {
    this.totalCapital = (products || []).reduce((sum, p) => sum + (Number(p.purchase_price * p.stock) || 0), 0);

  }
  async loadSales() {


    try {
      this.sales = await this.basketService.getValidatedBaskets() as any;
      this.calculateTodayCA();
      this.calculateCurrentMonthTotal();
      this.generateMonthlyStatsBackwards();
    } catch (error) {
      console.error('Erreur lors du chargement des ventes', error);
    }
  }
  calculateCurrentMonthTotal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11

    this.currentMonthTotal = this.sales
      .filter((s: { status: string; validated_at: string | number | Date; }) => {
        if (s.status !== 'validated') return false;

        const d = new Date(s.validated_at);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum: number, s: { basket_items: any[]; }) => {
        const total = Number(this.calculateBasketTotal(s.basket_items)) || 0;
        return sum + total;
      }, 0);
  }
  calculateTodayCA() {
    const today = new Date();

    this.todayTotal = this.sales
      .filter((s: { status: string; validated_at: string | number | Date; }) => {
        if (s.status !== 'validated') return false;

        const d = new Date(s.validated_at);

        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      })
      .reduce((sum: number, s: { basket_items: any; }) => {
        const total = Number(this.calculateBasketTotal(s.basket_items)) || 0;
        return sum + total;
      }, 0);
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
}
