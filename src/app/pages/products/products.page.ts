import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSearchbar,
  IonCard,
  IonSpinner,
  IonCardContent
} from '@ionic/angular/standalone';
import {
  addCircle
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/product.service';
import { BasketService } from 'src/app/core/basket.service';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonSpinner,
    IonTitle,
    CommonModule,
    IonCardContent,
    IonToolbar,
    IonCard,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonBadge,
    IonSearchbar,
    IonButtons,
    IonIcon
  ],
})
export class ProductsPage implements OnInit {
  add = addCircle;
  products: any[] = [];
  loading = false;
  searchValue: string = '';
  searchTimer: any;
  constructor(private productService: ProductService, private router: Router,private basketService: BasketService) { }

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      const  data  = await this.productService.getProductsByCurrentStore() ;
      console.log('data',data);
      
      this.products = data || [];
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
  onSearch(ev: any) {
    const value = (ev?.detail?.value || '').toString();
    this.searchValue = value;

    // debounce بسيط
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadProducts();
    }, 250);
  }


  addProduct() {
    this.router.navigateByUrl('/tabs/add-product');

  }
  goToProductDettail() {
    this.router.navigateByUrl('/tabs/product/5');

  }
  addToCart(product: any) {
    this.basketService.addProduct(product,1);
    product.inBasket = true;
  }

}
