import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import 'zone.js/dist/zone-patch-rxjs';
import { PostDataResolver } from './core/resolver';
import { AboutUsComponent } from './about-us/about-us.component';
import { WebsiteComponent } from './website/website.component';
import { EmailMarketingComponent } from './email-marketing/email-marketing.component';
import { SocialMediaMarketingComponent } from './social-media-marketing/social-media-marketing.component';
import { LoaderComponent } from './auth/loader/loader.component';
import { AuthModule } from './auth/auth.module';
import {MakemoneyonlineModule} from './makemoneyonline/makemoneyonline.module';
import { FormioModule } from 'angular-formio';
import {FormBuilderModule} from './form-builder/form-builder.module';
import { registerSelecteDeselectComponent } from './shared/components/selecte-deselect/select-deselect.formio';
import { SelecteDeselectComponent } from './shared/components/selecte-deselect/selecte-deselect.component';
import { VideoChatHomeComponent } from './video-chat/video-chat-home/video-chat-home.component';
import { CameraComponent } from './video-chat/camera/camera.component';
import { RoomsComponent } from './video-chat/rooms/rooms.component';
import { ParticipantsComponent } from './video-chat/participants/participants.component';
import { DeviceSelectComponent } from './video-chat/settings/device-select/device-select.component';
import { SettingsComponent } from './video-chat/settings/settings.component';
import { DonateComponent } from './donate/donate.component';

// import { SignInComponent } from './core/amplify/sign-in-component';

@NgModule({
  declarations: [
    AppComponent,

    LoaderComponent,

    NavBarComponent,
    AboutUsComponent,
    WebsiteComponent,
    EmailMarketingComponent,
    SocialMediaMarketingComponent,
    SelecteDeselectComponent,

    VideoChatHomeComponent,
    CameraComponent,
    RoomsComponent,
    ParticipantsComponent,
    SettingsComponent,
    DeviceSelectComponent,
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
    FormBuilderModule,
    // MaterialFileInputModule
  ],
  providers: [PostDataResolver],
  bootstrap: [AppComponent],
  entryComponents: [LoaderComponent, SelecteDeselectComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    // registerSelecteDeselectComponent(this.injector);
  }
}
