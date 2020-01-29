import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCapitalFundingComponent } from './add-capital-funding.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const addCapitalFundingRoutes: Routes = [
  {
    path: '',
    component: AddCapitalFundingComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [AddCapitalFundingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCapitalFundingRoutes)
  ]
})

export class AddCapitalFundingModule { }
