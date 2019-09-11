import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddHowtodocComponent } from './add-howtodoc.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addHowtodocRoutes: Routes = [
  {
    path: '',
    component: AddHowtodocComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddHowtodocComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addHowtodocRoutes)
  ]
})
export class AddHowtodocModule { }
