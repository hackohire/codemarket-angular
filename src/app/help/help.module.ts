import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskforhelpComponent } from './askforhelp/askforhelp.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


const helpRoutes: Routes = [
  {
    path: '',
    component: AskforhelpComponent
  }
];


@NgModule({
  declarations: [AskforhelpComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(helpRoutes)
  ]
})
export class HelpModule { }
