import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MakemoneylistComponent } from './makemoneylist/makemoneylist.component';
import { RouterModule, Routes } from '@angular/router';
import { MakemoneyonlineComponent } from './makemoneyonline.component';
import { SharedModule } from '../shared/shared.module';

const contactRoutes: Routes = [
  {
    path: '',
   
    // data: { noReuse: true },
    children: [
      {
        path:'',
        component: MakemoneyonlineComponent
      },
      {
        path: 'make-money-list',
        component: MakemoneylistComponent
      },
    ]
  }
];

@NgModule({
  declarations: [MakemoneyonlineComponent,MakemoneylistComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(contactRoutes)
  ],
  exports: [
    MakemoneyonlineComponent
  ],
})
export class MakemoneyonlineModule { }
