import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonCard,IonCardContent,IonIcon,IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  addCircleOutline
} from 'ionicons/icons';

type BasketItem = {
  id: string;
  title: string;
  date: string;
  itemsCount: number;
  total: number;
};
@Component({
  selector: 'app-list-baskets',
  templateUrl: './list-baskets.page.html',
  styleUrls: ['./list-baskets.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton,IonCard,IonCardContent,IonIcon,IonButtons,]
})
export class ListBasketsPage implements OnInit {
  add = addCircleOutline;
  baskets: BasketItem[] = [
    { id: 'b1', title: 'Panier #001', date: '02/02/2026', itemsCount: 3, total: 58 },
    { id: 'b2', title: 'Panier #002', date: '01/02/2026', itemsCount: 5, total: 120 },
  ];

  constructor(private router: Router) {}

  openBasket(id: string) {
    // مثلا صفحة panier detail
    this.router.navigate(['/tabs/basket', id]);
  }

  createBasket() {
   
    this.router.navigate(['/tabs/basket']);
  }


  ngOnInit() {
  }

}
