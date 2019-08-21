import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskforhelpComponent } from './askforhelp/askforhelp.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HelpRequestListComponent } from './help-request-list/help-request-list.component';
import { HelpComponent } from './help.component';


const helpRoutes: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: [
      {
        path: '',
        redirectTo: 'help-request-list',
        pathMatch: 'full',
      },
      {
        path: 'help-request-list',
        loadChildren: () => import('./help-request-list/help-request-list.module').then(module => module.HelpRequestListModule)
      },
      {
        path: 'add-help-request',
        loadChildren: () => import('./askforhelp/askforhelp.module').then(module => module.AskforhelpModule),
      },
      {
        path: 'edit-helpRequest/:helpRequestId',
        loadChildren: () => import('./askforhelp/askforhelp.module').then(module => module.AskforhelpModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(helpRoutes)
  ]
})
export class HelpModule { }
