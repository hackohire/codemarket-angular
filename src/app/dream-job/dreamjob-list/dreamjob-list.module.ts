import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DreamjobListComponent } from './dreamjob-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const dreamJobListRoutes: Routes = [
  {
    path: '',
    component: DreamjobListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [DreamjobListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dreamJobListRoutes)
  ]
})
export class DreamjobListModule { }
