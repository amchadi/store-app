import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardSubtitle,
  IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent, } from '@ionic/angular/standalone';
import {
  cashOutline,todayOutline,calendarOutline,trendingUpOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, 
      IonHeader, 
      IonTitle, 
      IonToolbar, 
      CommonModule, FormsModule,    IonTitle,
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
  cash=cashOutline;
  todayIcon = todayOutline;
  calendarIcon = calendarOutline;
  trendingUpOutline = trendingUpOutline;
  year = 2026;

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

  months = this.monthlyTotals.map(m => {
    const days = new Date(this.year, m.month + 1, 0).getDate();
    return {
      ...m,
      days,
      avgPerDay: Math.round((m.total / days) * 100) / 100
    };
  });

  get currentMonth() {
    return new Date().getMonth();
  }

  get currentMonthTotal() {
    return this.months.find(m => m.month === this.currentMonth)?.total ?? 0;
  }

  get currentMonthAvg() {
    return this.months.find(m => m.month === this.currentMonth)?.avgPerDay ?? 0;
  }
  constructor() { }

  ngOnInit() {
  }

}
