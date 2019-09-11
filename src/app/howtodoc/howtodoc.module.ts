import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HowtodocComponent } from './howtodoc.component';

const howtodocRoutes: Routes = [
  {
    path: '',
    component: HowtodocComponent,
    children: [
      {
        path: '',
        redirectTo: 'howtodoc-list',
        pathMatch: 'full',
      },
      {
        path: 'howtodoc-list',
        loadChildren: () => import('./howtodoc-list/howtodoc-list.module').then(module => module.HowtodocListModule)
      },
      {
        path: 'add-howtodoc',
        loadChildren: () => import('./add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'edit-howtodoc/:howtodocId',
        loadChildren: () => import('./add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [HowtodocComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(howtodocRoutes)
  ]
})
export class HowtodocModule { }
