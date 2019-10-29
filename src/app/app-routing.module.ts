import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { HackohireComponent } from './read-more/hackohire/hackohire.component';
import { SocialImpactComponent } from './read-more/social-impact/social-impact.component';
import { WellnessComponent } from './read-more/wellness/wellness.component';
import { TeamIqComponent } from './read-more/team-iq/team-iq.component';
import { StartupsComponent } from './read-more/startups/startups.component';
import { DreamJobComponent } from './read-more/dream-job/dream-job.component';
import { CodingExpertsComponent } from './read-more/coding-experts/coding-experts.component';
import { LocalBusinessComponent } from './read-more/local-business/local-business.component';
import { GovernmentComponent } from './read-more/government/government.component';
import { DiversityComponent } from './read-more/diversity/diversity.component';

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

  // {
  //   path: 'interview',
  //   loadChildren: () => import('./interview/interview.module').then(module => module.InterviewModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },
  // {
  //   path: 'requirement',
  //   loadChildren: () => import('./requirements/requirements.module').then(module => module.RequirementsModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },

  // {
  //   path: 'testing',
  //   loadChildren: () => import('./testing/testing.module').then(module => module.TestingModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },

  // {
  //   path: 'howtodoc',
  //   loadChildren: () => import('./howtodoc/howtodoc.module').then(module => module.HowtodocModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },

  // {
  //   path: 'design',
  //   loadChildren: () => import('./design/design.module').then(module => module.DesignModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },

  // {
  //   path: 'goal',
  //   loadChildren: () => import('./goal/goal.module').then(module => module.GoalModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },

  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then(module => module.PostModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'company',
    loadChildren: () => import('./companies/companies.module').then(module => module.CompaniesModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(module => module.EventModule),
    outlet: 'main',
    canLoad: [AuthGuard]
  },

  // {
  //   path: 'team-skill',
  //   loadChildren: () => import('./team-skill/teamskill.module').then(module => module.TeamskillModule),
  //   outlet: 'main',
  //   canLoad: [AuthGuard]
  // },


  {
    path: 'membership',
    loadChildren: () => import('./membership/membership.module').then(module => module.MembershipModule),
    outlet: 'main',
  },

  {
    path: 'hackathon',
    component: HackohireComponent,
    outlet: 'main',
  },

  {
    path: 'wellness',
    component: WellnessComponent,
    outlet: 'main',
  },

  {
    path: 'social-impact',
    component: SocialImpactComponent,
    outlet: 'main',
  },

  {
    path: 'team-iq',
    component: TeamIqComponent,
    outlet: 'main',
  },

  {
    path: 'dreamjob',
    component: DreamJobComponent,
    outlet: 'main',
  },

  {
    path: 'code-expert',
    component: CodingExpertsComponent,
    outlet: 'main',
  },

  {
    path: 'startups',
    component: StartupsComponent,
    outlet: 'main',
  },

  {
    path: 'local-business',
    component: LocalBusinessComponent,
    outlet: 'main',
  },

  {
    path: 'government',
    component: GovernmentComponent,
    outlet: 'main',
  },

  {
    path: 'diversity',
    component: DiversityComponent,
    outlet: 'main',
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
