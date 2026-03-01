import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import {      IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonButton,
  IonBadge,
  IonSearchbar,
  IonButtons,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonInput
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: true,
  imports: [     IonContent,FormsModule,CommonModule,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
  IonList,
  ReactiveFormsModule,
  IonCard,
   IonCardContent,
  IonSpinner,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonSearchbar,
  IonButtons,
  IonIcon]
})
export class ProductFormPage implements OnInit {
  submitted = false;
  isEditMode = false;
  private productId:string =''
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    purchase_price: [0, [Validators.required, Validators.min(0)]],
    sale_price: [0, [Validators.required, Validators.min(0)]],
  });
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {}

  get margin(): number {
    const buy = Number(this.form.get('purchase_price')?.value || 0);
    const sell = Number(this.form.get('sale_price')?.value || 0);
    return +(sell - buy).toFixed(2);
  }

 async ionViewWillEnter(){
    const id = this.activatedRoute.snapshot.params['id'];
    if(id){
      this.isEditMode = true;
      const product = await this.productService.getProductById(id) as Product;
      this.form.get("name")?.setValue(product.name);
      this.form.get("stock")?.setValue(product.stock);
      this.form.get("purchase_price")?.setValue(product.purchase_price);
      this.form.get("sale_price")?.setValue(product.sale_price);
      this.productId = id;
    }
    
  }

  isInvalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  back() {
    this.router.navigateByUrl('/tabs/products');
  }

  async submit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.toast('Merci de remplir les champs correctement.');
      return;
    }

    this.loading = true;
    if(!this.isEditMode){
        try {
      const v = this.form.getRawValue();

      await this.productService.createProduct({
        name: v.name!,
        stock: Number(v.stock),
        purchase_price: Number(v.purchase_price),
        sale_price: Number(v.sale_price),
      });

      await this.toast('Produit ajouté ✅');
      this.router.navigateByUrl('/tabs/products', { replaceUrl: true });

    } catch (e: any) {
      console.error(e);
      await this.toast(e?.message || 'Erreur ajout produit');
    } finally {
      this.loading = false;
    }

    }else{
          try {
      const v = this.form.getRawValue();

      await this.productService.updateProduct(this.productId,v.name!,v.purchase_price!,v.sale_price!)


      await this.toast('Produit ajouté ✅');
      this.router.navigateByUrl('/tabs/products', { replaceUrl: true });

    } catch (e: any) {
      console.error(e);
      await this.toast(e?.message || 'Erreur ajout produit');
    } finally {
      this.loading = false;
    }
    }

  
  }

  private async toast(message: string) {
    // const t = await this.toastCtrl.create({
    //   message,
    //   duration: 1800,
    //   position: 'top',
    // });
    // await t.present();
  }

  ngOnInit() {
  }

}
