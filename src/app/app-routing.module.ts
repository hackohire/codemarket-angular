import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/(side:dashboard)',
    pathMatch: 'full'
  },
  {
    path: 'id_token',
    redirectTo: '/(side:dashboard)',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
    outlet: 'side'
  },
  {
    path: 'sell',
    loadChildren: () => import('./selling/selling.module').then(module => module.SellingModule),
    outlet: 'side'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
