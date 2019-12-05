import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { UniversalRelativeInterceptor } from './core/universal-interceptor';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
  // providers: [{
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: UniversalRelativeInterceptor,
  //   multi: true
  // }],
})
export class AppServerModule {}
