import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/(main:dashboard)',
    pathMatch: 'full'
  },
  {
    path: 'id_token',
    redirectTo: '/(main:dashboard)',
  },
  {
    path: 'access_token',
    redirectTo: '/(main:dashboard)',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
    outlet: 'main'
  },
  {
    path: 'sell',
    loadChildren: () => import('./selling/selling.module').then(module => module.SellingModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(module => module.UserModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'help-request',
    loadChildren: () => import('./help/help.module').then(module => module.HelpModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'interview',
    loadChildren: () => import('./interview/interview.module').then(module => module.InterviewModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },
  {
    path: 'requirement',
    loadChildren: () => import('./requirements/requirements.module').then(module => module.RequirementsModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'testing',
    loadChildren: () => import('./testing/testing.module').then(module => module.TestingModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'howtodoc',
    loadChildren: () => import('./howtodoc/howtodoc.module').then(module => module.HowtodocModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'design',
    loadChildren: () => import('./design/design.module').then(module => module.DesignModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'goal',
    loadChildren: () => import('./goal/goal.module').then(module => module.GoalModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then(module => module.PostModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(module => module.EventModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'team-skill',
    loadChildren: () => import('./team-skill/teamskill.module').then(module => module.TeamskillModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'membership',
    loadChildren: () => import('./membership/membership.module').then(module => module.MembershipModule),
    outlet: 'main',
    // canLoad: [AuthGuard]
  },

  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(module => module.CartModule),
    outlet: 'main'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
