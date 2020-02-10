import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import 'zone.js/dist/zone-patch-rxjs';
import { AmplifyModule } from './core/amplify/amplify.module';
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

@NgModule({
  declarations: [
    AppComponent,
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
    TrainingFromExpertsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    LayoutModule,
    AmplifyModule
  ],
  providers: [PostDataResolver],
  bootstrap: [AppComponent]
})
export class AppModule {}
