import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddTeamskillComponent } from './add-teamskill.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addTeamskillRoutes: Routes = [
  {
    path: '',
    component: AddTeamskillComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddTeamskillComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTeamskillRoutes)
  ]
})
export class AddTeamskillModule { }
