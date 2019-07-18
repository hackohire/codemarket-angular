import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';


import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  ...awsconfig,
  oauth: environment.oauth,
  Analytics: {
    disabled: true
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
