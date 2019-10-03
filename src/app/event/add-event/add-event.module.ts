import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './add-event.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addEventRoutes: Routes = [
  {
    path: '',
    component: AddEventComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddEventComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addEventRoutes)
  ]
})
export class AddEventModule { }
