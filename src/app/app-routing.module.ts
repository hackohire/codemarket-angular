import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { PostDataResolver } from './core/resolver';
import { AboutUsComponent } from './about-us/about-us.component';
import { WebsiteComponent } from './website/website.component';
import { EmailMarketingComponent } from './email-marketing/email-marketing.component';
import { SocialMediaMarketingComponent } from './social-media-marketing/social-media-marketing.component';
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

  /** Static routes ends here */
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
