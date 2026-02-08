import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonButtons, IonCardContent, IonDatetimeButton, IonDatetime, IonModal, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonList,IonSpinner } from '@ionic/angular/standalone';
import {
  trashSharp, chevronUpCircle, chevronDownCircle, cashOutline, trendingUp, addCircleOutline
} from 'ionicons/icons';
import { BasketService } from 'src/app/core/basket.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { BasketItem, BasketItemWithProduct } from 'src/app/models/basket-item.model';
import { ProductService } from 'src/app/core/product.service';
import { Product } from 'src/app/models/product.model';
import { Router } from '@angular/router';


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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonButtons, CommonModule, IonList, IonDatetimeButton, IonModal, IonDatetime, FormsModule, IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect,IonSpinner]
})
export class BasketPage implements OnInit {
  cash = cashOutline;
  trendingUp = trendingUp;
  up = chevronUpCircle;
  down = chevronDownCircle;
  trash = trashSharp;
  addCircleOutline = addCircleOutline;
  // data
  products: BasketItemWithProduct[] = [];

  selectedProductId: string | null = null;

  cartItems: CartItem[] = [];

  dateSelle: string = new Date().toISOString();;
  validatedAtISO: string  = '';
isValidating = false;

  @ViewChild(IonModal) modal!: IonModal;

  allProducts: Product[] = [];

  isAddModalOpen = false;

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }
  async addProductToCart(prod: Product) {

    const loading = await this.loadingCtrl.create({
      message: 'Ajout en cours...',
      spinner: 'crescent'
    });

    this.closeAddModal();
    await loading.present();
    await this.basketService.addProduct(prod, 1);
    const product = await this.basketService.getOneProductByBasket(prod) as unknown as BasketItemWithProduct;
    this.products.push(product);
    await loading.dismiss();
  }

  /**
 * Récupère et sécurise la date/heure sélectionnée
 * ion-datetime peut retourner string | string[] | null
 */
onDateChange(event: any) {
  const value = event?.detail?.value;

  if (typeof value === 'string') {
    this.validatedAtISO = value;
  } else {
    this.validatedAtISO = '';
  }
}


  /**
   * Déclenchée lors du changement du prix dans le champ input.
   * Met à jour le prix et recalcule automatiquement le total.
   */
 async onPriceChange(product: any, event: any) {
    // Récupération de la valeur saisie depuis ion-input
    const value = event?.detail?.value;

    // Conversion en nombre (0 si vide ou invalide)
    const newPrice = value !== null && value !== '' ? Number(value) : 0;

    // Sécurité : éviter NaN
    product.price = isNaN(newPrice) ? 0 : newPrice;

    await this.basketService.updateItem(product)

  }







 async increaseQty(product: BasketItem) {
    product.quantity++;
    await this.basketService.updateItem(product)
  }
  
 async decreaseQty(product: BasketItem) {
    product.quantity--;
    await this.basketService.updateItem(product)
  }



  constructor(private basketService: BasketService, private alertCtrl: AlertController, private productService: ProductService, private loadingCtrl: LoadingController,private router: Router) { }

  async ngOnInit() {
    this.products = await this.basketService.getBasketItems() as unknown as BasketItemWithProduct[];
    this.allProducts = await this.productService.getProductsByCurrentStore();

  }
  private calculateBy(
    selector: (p: any) => number
  ): number {
    return this.products.reduce(
      (total, p) => total + selector(p) * p.quantity,
      0
    );
  }
  async deleteItem(basketItemId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ce produit du panier ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            await this.basketService.deleteBasketItemById(basketItemId);
            const index = this.products.findIndex(p => p.id === basketItemId);
            this.products.splice(index, 1);
          }
        }
      ]
    });

    await alert.present();
  }
  calculateSalesCapital(): number {
    return this.calculateBy(p => p.product.sale_price);
  }

  calculatePurchaseCapital(): number {
    return this.calculateBy(p => p.product.purchase_price);
  }

  calculateTotal(): number {
    return this.calculateBy(p => p.price);
  }
  calculateGlobalBenefit(): number {
  return this.calculateTotal() - this.calculatePurchaseCapital();
}
  /**
   * Validation du panier :
   * - Vérifications
   * - Mise à jour du statut en "validated"
   * - Enregistrement de validated_at
   */
  async validateBasket() {
    if (this.isValidating) return;

    if (!this.products.length) {
      console.warn('Panier vide');
      return;
    }

    if (!this.validatedAtISO) {
      console.warn('Date/heure de vente obligatoire');
      return;
    }

    this.isValidating = true;

    try {
      await this.basketService.validateBasket(
  //      this.validatedAtISO
      );

      // 
      this.router.navigate(['/tabs/list-baskets'])
    } catch (error) {
      console.error('Erreur lors de la validation du panier', error);
    } finally {
      this.isValidating = false;
    }
  }

}
