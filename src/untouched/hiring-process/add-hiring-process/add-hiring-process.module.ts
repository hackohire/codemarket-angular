import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddHiringProcessComponent } from './add-hiring-process.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const addHiringProcessRoutes: Routes = [
  {
    path: '',
    component: AddHiringProcessComponent,
  },
];


@NgModule({
  declarations: [AddHiringProcessComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addHiringProcessRoutes)
  ]
})

export class AddHiringProcessModule { }
