import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const productDetailRoutes: Routes = [
  {
    path: '',
    component: ProductDetailsComponent,
    // resolve: { seo: PostDataResolver },
    // data: { noReuse: true, setPostMeta: true },
  }
];


@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(productDetailRoutes)
  ]
})
export class ProductDetailsModule { }
