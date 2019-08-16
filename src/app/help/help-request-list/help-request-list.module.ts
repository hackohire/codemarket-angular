import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HelpRequestListComponent } from './help-request-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

const helpRequestRoutes: Routes = [
  {
    path: '',
    component: HelpRequestListComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [HelpRequestListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(helpRequestRoutes)
  ]
})
export class HelpRequestListModule { }
