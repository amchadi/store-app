import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonNote, IonButton, IonLabel, IonItem, IonBadge,
  IonCardSubtitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButtons, IonBackButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/product.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonNote, IonButton, IonLabel, IonSpinner,
    IonItem, IonBadge, IonCardSubtitle, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButtons, IonBackButton,
    IonIcon]
})
export class ProductDetailPage implements OnInit {
  product: any = null;
  isLoading = true;


  get profit() {
    return (this.product.sellPrice - this.product.buyPrice).toFixed(2);
  }
  constructor(private router: Router, private productService: ProductService, private alertCtrl: AlertController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //  this.loadProduct();
  }
  async ionViewWillEnter() {
    this.loadProduct()

  }
  async loadProduct() {
    this.isLoading = true;
    const productId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.product = await this.productService.getProductDetails(productId);
    this.isLoading = false;

  }

  sellProduct() {
    this.router.navigateByUrl('/tabs/sales');

  }




  updateStatus() {
    if (this.product.stock <= 0) {
      this.product.status = 'Rupture';
      this.product.statusColor = 'danger';
    } else if (this.product.stock <= 5) {
      this.product.status = 'Stock bas';
      this.product.statusColor = 'warning';
    } else {
      this.product.status = 'OK';
      this.product.statusColor = 'success';
    }
  }
  editProduct() {
    this.router.navigate(['/tabs/edit-product', this.product.id]);
  }
  async deleteProduct() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer ce produit ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            await this.productService.deleteProduct(this.product.id);

            this.router.navigate(['/tabs/produits']);
          }
        }
      ]
    });

    await alert.present();
  }
  async increaseStock() {

    // 🔹 Création du popup (Alert Ionic)
    const alert = await this.alertCtrl.create({
      header: 'Augmenter le stock',
      message: 'Entrez la quantité à ajouter',

      // 🔹 Champ input pour saisir la quantité
      inputs: [
        {
          name: 'qty',
          type: 'number',
          placeholder: 'Ex: 5',
          min: 1,
        },
      ],

      // 🔹 Boutons du popup
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel' // Ferme le popup sans action
        },
        {
          text: 'Valider',

          // 🔹 Fonction exécutée après clic sur "Valider"
          handler: async (values) => {

            const qty = Number(values.qty);

            // ✅ Validation de la quantité
            if (!qty || qty <= 0) {
              console.warn('Quantité invalide');
              return false; // Empêche la fermeture du popup
            }

            try {

              // 🔹 Calcul du nouveau stock
              const newStock = (this.product.stock || 0) + qty;

              // 🔹 Mise à jour dans la base de données
              await this.productService.updateProductStock(
                this.product.id,
                newStock
              );

              // 🔹 Mise à jour locale pour rafraîchir l’UI
              this.product.stock = newStock;
              this.updateStatus();
              return true; // Ferme le popup

            } catch (error) {

              console.error('Erreur lors de la mise à jour du stock', error);
              return false; // Ne ferme pas le popup si erreur

            }
          },
        },
      ],
    });

    // 🔹 Affichage du popup
    await alert.present();
  }

}
