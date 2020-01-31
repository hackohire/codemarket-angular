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
import { HackohireComponent } from './read-more/hackohire/hackohire.component';
import { WellnessComponent } from './read-more/wellness/wellness.component';
import { SocialImpactComponent } from './read-more/social-impact/social-impact.component';
import { TeamIqComponent } from './read-more/team-iq/team-iq.component';
import { DreamJobComponent } from './read-more/dream-job/dream-job.component';
import { StartupsComponent } from './read-more/startups/startups.component';
import { LocalBusinessComponent } from './read-more/local-business/local-business.component';
import { CodingExpertsComponent } from './read-more/coding-experts/coding-experts.component';
import { GovernmentComponent } from './read-more/government/government.component';
import { DiversityComponent } from './read-more/diversity/diversity.component';
import { AmplifyModule } from './core/amplify/amplify.module';
import { PostDataResolver } from './core/resolver';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HackohireComponent,
    WellnessComponent,
    SocialImpactComponent,
    TeamIqComponent,
    DreamJobComponent,
    TeamIqComponent,
    StartupsComponent,
    LocalBusinessComponent,
    CodingExpertsComponent,
    GovernmentComponent,
    DiversityComponent
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
