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
  IonFab,
  IonSpinner,
  IonFabButton,
  IonCardContent
} from '@ionic/angular/standalone';
import {
  addCircle,cartOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/product.service';
import { BasketService } from 'src/app/core/basket.service';
import { Product } from 'src/app/models/product.model';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonSpinner,
    IonFab,
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
    IonIcon,
    IonFabButton
  ],
})
export class ProductsPage implements OnInit {
  add = addCircle;
  cartOutline=cartOutline;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchValue: string = '';
  searchTerm: string ='';
  constructor(private productService: ProductService, private router: Router,private basketService: BasketService) { }

  async ngOnInit() {
 
  }
  ionViewWillEnter() {
  this.loadProducts();
}

  async loadProducts() {
    this.loading = true;
    try {
      const  data  = await this.productService.getProductsByCurrentStore() ;

      
      this.products = data || [];
      this.filteredProducts = data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
 /* ===============================
   Fonction de recherche produit
================================= */
onSearch(event: any) {
  this.searchTerm = event.target.value?.toLowerCase() || '';

  if (!this.searchTerm) {
    this.filteredProducts = this.products;
    return;
  }

  this.filteredProducts = this.products.filter(p =>
    p.name.toLowerCase().includes(this.searchTerm) 
  );
}


  addProduct() {
    this.router.navigateByUrl('/tabs/add-product');

  }
  goToProductDettail(product:Product) {
    const url = `/tabs/product/${product.id}`
     this.router.navigateByUrl(url);

  }
  addToCart(product: any) {
    this.basketService.addProduct(product,1);
    product.inBasket = true;
  }
  get cartCount(){
    return this.products.filter(p=> p.inBasket).length
    }

  goToCart(){
    this.router.navigate(['/tabs/basket'])
  }

}
