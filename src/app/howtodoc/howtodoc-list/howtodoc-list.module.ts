import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowtodocListComponent } from './howtodoc-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const howtodocListRoutes: Routes = [
  {
    path: '',
    component: HowtodocListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [HowtodocListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(howtodocListRoutes)
  ]
})

export class HowtodocListModule { }
