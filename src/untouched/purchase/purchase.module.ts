import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasedItemsListComponent } from './purchased-items-list/purchased-items-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const purchasedItemsRoutes: Routes = [
  {
    path: '',
    component: PurchasedItemsListComponent
  }
];


@NgModule({
  declarations: [PurchasedItemsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(purchasedItemsRoutes)
  ]
})
export class PurchaseModule { }
