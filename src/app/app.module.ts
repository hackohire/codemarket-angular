import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import 'zone.js/dist/zone-patch-rxjs';
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
import { ResumeGapAnalysisComponent } from './resume-gap-analysis/resume-gap-analysis.component';
import { PeerNetworkingComponent } from './peer-networking/peer-networking.component';
import { LeadershipTrainingComponent } from './leadership-training/leadership-training.component';
import { StickyComponent } from './sticky/sticky.component';
import { ViralComponent } from './viral/viral.component';
import { CommunityImpactStoriesComponent } from './community-impact-stories/community-impact-stories.component';
import { AdvocatesInfluencersComponent } from './advocates-influencers/advocates-influencers.component';
import { LoaderComponent } from './auth/loader/loader.component';
import { AuthModule } from './auth/auth.module';
import { StressManagementComponent } from './stress-management/stress-management.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import {VolunteerComponent} from './volunteer/volunteer.component';
import {DonateComponent} from './donate/donate.component';
import {MakemoneyonlineModule} from './makemoneyonline/makemoneyonline.module';
import { FormioModule } from 'angular-formio';
import {FormBuilderModule} from './form-builder/form-builder.module';

// import { SignInComponent } from './core/amplify/sign-in-component';

@NgModule({
  declarations: [
    AppComponent,

    LoaderComponent,

    NavBarComponent,
    AboutUsComponent,
    InnovateComponent,
    AffordableComponent,
    GetWorkDoneComponent,
    DedicatedTeamComponent,
    WebsiteComponent,
    EmailMarketingComponent,
    SocialMediaMarketingComponent,
    CrmComponent,
    ReferralNetworkComponent,
    SalesGrowthStrategyComponent,
    AiStrategyComponent,
    ExitStrategyComponent,
    TrainingFromExpertsComponent,
    RealProjectsComponent,
    MockInterviewsComponent,
    DreamJobMentorsComponent,
    ResumeGapAnalysisComponent,
    PeerNetworkingComponent,
    LeadershipTrainingComponent,
    StickyComponent,
    ViralComponent,
    StressManagementComponent,
    CommunityImpactStoriesComponent,
    AdvocatesInfluencersComponent,
    NewsletterComponent,
    VolunteerComponent,
    DonateComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    LayoutModule,
    AuthModule,
    MakemoneyonlineModule,
    FormioModule,
    FormBuilderModule
  ],
  providers: [PostDataResolver],
  bootstrap: [AppComponent],
  entryComponents: [LoaderComponent]
})
export class AppModule {}
