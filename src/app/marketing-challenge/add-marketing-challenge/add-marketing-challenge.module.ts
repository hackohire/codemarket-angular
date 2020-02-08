import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketingChallengeComponent } from './add-marketing-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const addMarketingChallengeRoutes: Routes = [
  {
    path: '',
    component: AddMarketingChallengeComponent,
  },
];

@NgModule({
  declarations: [AddMarketingChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addMarketingChallengeRoutes)
  ]
})
export class AddMarketingChallengeModule { }
