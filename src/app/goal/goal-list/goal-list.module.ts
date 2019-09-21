import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalListComponent } from './goal-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const goalListRoutes: Routes = [
  {
    path: '',
    component: GoalListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [GoalListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(goalListRoutes)
  ]
})

export class GoalListModule { }
