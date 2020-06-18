import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { PostDataResolver } from './core/resolver';
import { AboutUsComponent } from './about-us/about-us.component';
import { WebsiteComponent } from './website/website.component';
import { EmailMarketingComponent } from './email-marketing/email-marketing.component';
import { SocialMediaMarketingComponent } from './social-media-marketing/social-media-marketing.component';
import { VideoChatHomeComponent } from './video-chat/video-chat-home/video-chat-home.component';
import { DonateComponent } from './donate/donate.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { AddTweetComponent } from './tweet/add-tweet/add-tweet.component';
import { TweetsListComponent } from './tweet/tweets-list/tweets-list.component';

// import { PostDataResolver } from './core/resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'donate',
    component: DonateComponent
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
  // Profile of LoggedIn User
  {
    path: 'profile/:slug',
    loadChildren: () => import('./dashboard/my-profile/my-profile.module').then(module => module.MyProfileModule),
  },
  {
    path: 'form-builder',
    loadChildren: () => import('./form-builder/form-builder.module').then(module => module.FormBuilderModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(module => module.UserModule),
    // outlet: 'main',
    canLoad: [AuthGuard]
  },
  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then(module => module.PostModule),
    // outlet: 'main',
    // canLoad: [AuthGuard]
  },

  {
    path: `send-email`,
    loadChildren: () => import('../app/email/send-email/send-email.module').then(module => module.SendEmailModule),
  },
  {
    path: 'company',
    loadChildren: () => import('./companies/companies.module').then(module => module.CompaniesModule),
    // outlet: 'main',
  },


  {
    path: 'membership',
    loadChildren: () => import('./membership/membership.module').then(module => module.MembershipModule),
    // outlet: 'main',
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
    path: 'company/:companyId',
    loadChildren: () => import('./companies/companies.module').then(module => module.CompaniesModule),
    data: { setPostMeta: true },
    pathMatch: 'full'
  },
  {
    path: 'makemoneyonline',
    loadChildren: () => import('./makemoneyonline/makemoneyonline.module').then(module => module.MakemoneyonlineModule),
  },
  {
    path: 'help-business-grow',
    loadChildren: () => import('./help-business-grow/help-business-grow.module').then(module => module.HelpBusinessGrowModule),
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },

  {
    path: 'video-chat',
    component: VideoChatHomeComponent
  },

  {
    path: 'messages',
    loadChildren: () => import('./core/messages/messages.module').then(module => module.MessagesModule),
  },

  /** Static routes starts here */
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
    path: 'appointment-booking',
    loadChildren: () => import('./appointment/appointment.module').then(module => module.AppointmentModule)
  },

  {
    path: 'privacy-policy',
    component: PrivacyComponent
  },
  
  {
    path: 'terms-of-service',
    component: TermsComponent
  },
  {
    path: 'add-tweet',
    component: AddTweetComponent
  },
  {
    path: 'tweets-list',
    component: TweetsListComponent
  }
  
  /** Static routes ends here */
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
