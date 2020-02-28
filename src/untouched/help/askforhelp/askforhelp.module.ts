import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AskforhelpComponent } from './askforhelp.component';
import { SharedModule } from 'src/app/shared/shared.module';

const askForHelpRoutes: Routes = [
  {
    path: '',
    component: AskforhelpComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [AskforhelpComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(askForHelpRoutes)
  ]
})
export class AskforhelpModule { }
