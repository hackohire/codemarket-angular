import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { PostDataResolver } from './core/resolver';
import { AboutUsComponent } from './about-us/about-us.component';
import { InnovateComponent } from './innovate/innovate.component';
import { AffordableComponent } from './affordable/affordable.component';
import { GetWorkDoneComponent } from './get-work-done/get-work-done.component';
import { DedicatedTeamComponent } from './dedicated-team/dedicated-team.component';
import { WebsiteComponent } from './website/website.component';
import { EmailMarketingComponent } from './email-marketing/email-marketing.component';
import { SocialMediaMarketingComponent } from './social-media-marketing/social-media-marketing.component';
import { CrmComponent } from './crm/crm.component';
import { ReferralNetworkComponent } from './referral-network/referral-network.component';
import { SalesGrowthStrategyComponent } from './sales-growth-strategy/sales-growth-strategy.component';
import { AiStrategyComponent } from './ai-strategy/ai-strategy.component';
import { ExitStrategyComponent } from './exit-strategy/exit-strategy.component';
import { TrainingFromExpertsComponent } from './training-from-experts/training-from-experts.component';
import { RealProjectsComponent } from './real-projects/real-projects.component';
import { MockInterviewsComponent } from './mock-interviews/mock-interviews.component';
import { DreamJobMentorsComponent } from './dream-job-mentors/dream-job-mentors.component';
import { StressManagementComponent } from './stress-management/stress-management.component';
import { ResumeGapAnalysisComponent } from './resume-gap-analysis/resume-gap-analysis.component';
import { PeerNetworkingComponent } from './peer-networking/peer-networking.component';
import { LeadershipTrainingComponent } from './leadership-training/leadership-training.component';
import { StickyComponent } from './sticky/sticky.component';
import { ViralComponent } from './viral/viral.component';
import { CommunityImpactStoriesComponent } from './community-impact-stories/community-impact-stories.component';
import { AdvocatesInfluencersComponent } from './advocates-influencers/advocates-influencers.component';
// import { PostDataResolver } from './core/resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
 /*  {
    path: '',
    redirectTo: '/dashboard/bugfixes-all',
    pathMatch: 'full'
  }, */
  {
    path: 'id_token',
    redirectTo: '/dashboard',
  },
  {
    path: 'access_token',
    redirectTo: '/dashboard',
  },
  {
    path: 'add-post-type',
    loadChildren: () => import('./post-type/add-post-type/add-post-type.module').then(module => module.AddPostTypeModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
    // outlet: 'main'
  },
  {
    path: 'sell',
    loadChildren: () => import('./selling/selling.module').then(module => module.SellingModule),
    // outlet: 'main',
    canLoad: [AuthGuard]
  },

  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(module => module.UserModule),
    // outlet: 'main',
    canLoad: [AuthGuard]
  },
  {
    path: 'add-post',
    loadChildren: () => import('./post/add-post/add-post.module').then(module => module.AddPostModule),
    data: {
      noReuse: true
    }
  },
  {
    path: 'edit-post/:postId',
    loadChildren: () => import('./post/add-post/add-post.module').then(module => module.AddPostModule),
  },

  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then(module => module.PostModule),
    // outlet: 'main',
    // canLoad: [AuthGuard]
  },

  {
    path: 'company',
    loadChildren: () => import('./companies/companies.module').then(module => module.CompaniesModule),
    // outlet: 'main',
  },

  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(module => module.EventModule),
    // outlet: 'main',
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
    // outlet: 'main',
  },

  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(module => module.CartModule),
    // outlet: 'main'
  },
  {
    path: 'product/:slug',
    loadChildren: () => import('./dashboard/product-details/product-details.module').then(module => module.ProductDetailsModule),
    resolve: { seo: PostDataResolver },
    data: { noReuse: true, setPostMeta: true },
    // outlet: 'main',
    pathMatch: 'full'
  },
  {
    path: 'post/:slug',
    loadChildren: () => import('./detail/detail.module').then(module => module.DetailModule),
    resolve: { seo: PostDataResolver },
    data: { noReuse: true, setPostMeta: true },
    // outlet: 'main',
    pathMatch: 'full'
  },
  {
    path: 'dream-job/:slug',
    loadChildren: () => import('./dream-job/dream-job-details/dream-job-details.module').then(module => module.DreamJobDetailsModule),
    resolve: { seo: PostDataResolver },
    data: { noReuse: true, setPostMeta: true },
    // outlet: 'main',
    pathMatch: 'full'
  },
  {
    path: 'event/:slug',
    loadChildren: () => import('./event/event-details/event-details.module').then(module => module.EventDetailsModule),
    resolve: { seo: PostDataResolver },
    data: { noReuse: false, setPostMeta: true },
    pathMatch: 'full'
  },
  {
    path: 'company/:companyId',
    loadChildren: () => import('./companies/companies.module').then(module => module.CompaniesModule),
    data: { setPostMeta: true },
    pathMatch: 'full'
  },

  {
    path: 'about-us',
    component: AboutUsComponent
  },

  {
    path: 'messages',
    loadChildren: () => import('./core/messages/messages.module').then(module => module.MessagesModule),
  },

  /** Static routes starts here */
   {
    path: 'innovate',
     component: InnovateComponent
   },
   {
     path: 'affordable',
     component: AffordableComponent
   },
   {
    path: 'get-work-done',
    component: GetWorkDoneComponent
   },
   {
     path: 'dedicated-team',
     component: DedicatedTeamComponent
   },
   {
     path: 'website',
     component: WebsiteComponent
   },
   {
     path: 'email-marketing',
     component: EmailMarketingComponent
   },
   {
     path: 'social-media-marketing',
     component: SocialMediaMarketingComponent
   },
   {
     path: 'crm',
     component: CrmComponent
   },
   {
     path: 'referral-network',
     component: ReferralNetworkComponent
   },
   {
     path: 'sales-growth-strategy',
     component: SalesGrowthStrategyComponent
   },
   {
     path: 'ai-strategy',
     component: AiStrategyComponent
   },
   {
     path: 'exit-strategy',
     component: ExitStrategyComponent
   },
   {
     path: 'training-from-experts',
     component: TrainingFromExpertsComponent
   },
   {
     path: 'real-projects',
     component: RealProjectsComponent
   },
   {
     path: 'mock-interviews',
     component: MockInterviewsComponent
   },
   {
     path: 'dream-job-mentors',
     component: DreamJobMentorsComponent
   },
   {
     path: 'stress-management',
     component: StressManagementComponent
   },
   {
     path: 'resume-gap-analysis',
     component: ResumeGapAnalysisComponent
   },
   {
     path: 'peer-networking',
     component: PeerNetworkingComponent
   },
   {
     path: 'leadership-training',
     component: LeadershipTrainingComponent
   },
   {
     path: 'sticky',
     component: StickyComponent
   },
   {
     path: 'viral',
     component: ViralComponent
   },
   {
     path: 'community-impact-stories',
     component: CommunityImpactStoriesComponent
   },
   {
     path: 'advocates-influencers',
     component: AdvocatesInfluencersComponent
   }
  /** Static routes ends here */
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
