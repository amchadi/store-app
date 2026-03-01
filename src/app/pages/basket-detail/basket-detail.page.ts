import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard,IonCardContent,IonSpinner ,IonBadge,IonIcon} from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/core/supabase.service';
import { ActivatedRoute } from '@angular/router';
import {
  calendarOutline,personOutline, checkmarkCircleOutline,closeCircleOutline,cubeOutline,
  cashOutline,pricetagOutline,layersOutline,calculatorOutline,trendingUpOutline,trendingDownOutline,
  walletOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-basket-detail',
  templateUrl: './basket-detail.page.html',
  styleUrls: ['./basket-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCard,IonCardContent,IonSpinner,IonBadge,IonIcon]
})
export class BasketDetailPage implements OnInit {
calendarOutline = calendarOutline;
personOutline = personOutline;
checkmarkCircleOutline = checkmarkCircleOutline;
closeCircleOutline = closeCircleOutline;
cubeOutline =cubeOutline;
cashOutline = cashOutline;
pricetagOutline = pricetagOutline;
layersOutline = layersOutline;
calculatorOutline = calculatorOutline;
basketId!: string;
trendingUpOutline = trendingUpOutline;
trendingDownOutline = trendingDownOutline;
walletOutline = walletOutline;
  isLoading = true;
  basket: any = null;        // { id, status, validated_at, cancelled_at, seller... }
  items: any[] = [];         // basket_items

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    this.basketId = this.route.snapshot.paramMap.get('id')!;
    this.loadBasketDetail();
  }

  async loadBasketDetail() {
    this.isLoading = true;

    const { data, error } = await this.supabase
      .supa()
      .from('baskets')
      .select(`
        id,
        status,
        validated_at,
        created_at,
            seller:profiles (
      full_name
    ),
        basket_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            purchase_price,
            sale_price
          )
        )
      `)
      .eq('id', this.basketId)
      .maybeSingle();

    this.isLoading = false;

    if (error) {
      console.error('loadBasketDetail error', error);
      return;
    }

    this.basket = data;
    this.items = data?.basket_items ?? [];
  }

  // ===== Helpers UI =====
  getStatusLabel(): string {
    return this.basket?.status === 'validated' ? 'Validé' : 'Annulé';
  }

  getStatusColor(): string {
    return this.basket?.status === 'validated' ? 'success' : 'medium';
  }

  formatDateTimeShort(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  lineTotal(it: any): number {
    return (Number(it.price) || 0) * (Number(it.quantity) || 0);
  }

  lineBenefit(it: any): number {
    const buy = Number(it.product?.purchase_price) || 0;
    const sell = Number(it.price) || 0;
    const q = Number(it.quantity) || 0;
    return Number((sell - buy) * q) as any;
  }

  basketTotal(): number {
    return this.items.reduce((sum, it) => sum + this.lineTotal(it), 0);
  }

  globalBenefit(): number {
    return this.items.reduce((sum, it) => Number(sum) + this.lineBenefit(it), 0);
  }

  totalQty(): number {
    return this.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  }

}
