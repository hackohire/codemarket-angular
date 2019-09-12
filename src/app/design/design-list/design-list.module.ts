import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignListComponent } from './design-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const designListRoutes: Routes = [
  {
    path: '',
    component: DesignListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [DesignListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(designListRoutes)
  ]
})

export class DesignListModule { }
