import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddDreamjobComponent } from './add-dreamjob.component';
import { SharedModule } from '../../shared/shared.module';

const addDreamJobRoutes: Routes = [
  {
    path: '',
    component: AddDreamjobComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [AddDreamjobComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addDreamJobRoutes)
  ]
})
export class AddDreamjobModule { }
