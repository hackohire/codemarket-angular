import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCompetitiveAdvantageComponent } from './add-competitive-advantage.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addCompetitiveAdvantageRoutes: Routes = [
  {
    path: '',
    component: AddCompetitiveAdvantageComponent,
  },
];

@NgModule({
  declarations: [AddCompetitiveAdvantageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCompetitiveAdvantageRoutes)
  ]
})
export class AddCompetitiveAdvantageModule { }
