import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,IonDatetimeButton,IonDatetime, IonModal,IonButton, IonIcon, IonItem, IonInput,IonLabel,IonSelect,IonSelectOption } from '@ionic/angular/standalone';
import {
  trashSharp, chevronUpCircle, chevronDownCircle, cashOutline, trendingUp,
} from 'ionicons/icons';
import { BasketService } from 'src/app/core/basket.service';
type Product = {
  id: string;
  name: string;
  buyPrice: number;
  suggestedSellPrice: number;
};

type CartItem = {
  product: Product;
  price: number;
  quantity: number;
  total: number;
};

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption,CommonModule,IonDatetimeButton,IonModal,IonDatetime, FormsModule, IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonItem,IonLabel,IonSelect ]
})
export class BasketPage implements OnInit {
  cash = cashOutline;
  trendingUp = trendingUp;
  up = chevronUpCircle;
  down = chevronDownCircle;
  trash = trashSharp;

  // data
  products: any[] = [];

  selectedProductId: string | null = null;

  cartItems: CartItem[] = [];

 dateSelle: string = new Date().toISOString();;
  price: number = 0;
quantity: number = 1;
total: number = 0;

/**
 * Déclenchée lors du changement du prix dans le champ input.
 * Met à jour le prix et recalcule automatiquement le total.
 */
onPriceChange(event: any) {
  // Récupération de la valeur saisie depuis ion-input
  const value = event?.detail?.value;

  // Conversion en nombre (0 si vide ou invalide)
  const newPrice = value !== null && value !== '' ? Number(value) : 0;

  // Sécurité : éviter NaN
  this.price = isNaN(newPrice) ? 0 : newPrice;

  // Recalcul du total = prix × quantité
  this.total = Number((this.price * this.quantity).toFixed(2));
}

  // ===== Select handlers =====
  onProductSelected(ev: any) {
    this.selectedProductId = ev?.detail?.value ?? null;
  }

  addSelectedProduct() {
    if (!this.selectedProductId) return;

    const p = this.products.find(x => x.id === this.selectedProductId);
    if (!p) return;

    // إذا بغيتي نفس المنتج مايتزادش بزاف (غير يزيد qty):
    const existingIndex = this.cartItems.findIndex(ci => ci.product.id === p.id);
    if (existingIndex !== -1) {
      this.cartItems[existingIndex].quantity += 1;
      this.recalcItem(existingIndex);
      return;
    }

    // add new item
    const item: CartItem = {
      product: p,
      price: p.suggestedSellPrice, // default price
      quantity: 1,
      total: p.suggestedSellPrice,
    };

    this.cartItems.unshift(item);
  }

  // ===== Cart handlers =====
  onItemPriceChange(index: number, ev: any) {
    const val = Number(ev?.detail?.value ?? 0);
    this.cartItems[index].price = isNaN(val) ? 0 : val;
    this.recalcItem(index);
  }

  increaseQty(product: any) {
    product.quantity++;
  }

  decreaseQty(product: any) {
    product.quantity--;
  }

  private recalcItem(index: number) {
    const it = this.cartItems[index];
    it.total = Number((it.price * it.quantity).toFixed(2));
  }
  deleteItem(){}

  constructor(private basketService: BasketService) { }

 async ngOnInit() {
    this.products = await this.basketService.getBasketItems() as any
    
    
  }
calculateSalesCapital():number{
   let total = 0;
    this.products.map(p=> {
      total = total + p.product.sale_price * p.quantity
    })

    return total;
  }

calculatePurchaseCapital():number{
  let total = 0;
    this.products.map(p=> {
      total = total + p.product.purchase_price * p.quantity
    })

    return total;
  }

}
