import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import { ServerJsonLdModule } from 'ngx-seo';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    FlexLayoutServerModule,
    ServerTransferStateModule,
    ServerJsonLdModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
