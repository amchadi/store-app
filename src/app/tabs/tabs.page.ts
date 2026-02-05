import { Component, EnvironmentInjector, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/angular/standalone';

import {
  cubeOutline,
  cartOutline,
  statsChartOutline,
  settingsOutline,
  add
} from 'ionicons/icons';




@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,IonRouterOutlet],
})
export class TabsPage {
    productsIcon = cubeOutline;
  salesIcon = cartOutline;
  dashboardIcon = statsChartOutline;
  settingsIcon = settingsOutline;
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      cubeOutline,
      cartOutline,
      statsChartOutline,
      settingsOutline,
    });
  }
}
