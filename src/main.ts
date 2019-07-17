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

// Amplify.configure(awsconfig);

const oauth = {
  // Domain name
  domain : 'platform.auth.us-east-1.amazoncognito.comm',

  // Authorized scopes
  scope : ['email', 'profile', 'openid'],

  // Callback URL
  redirectSignIn : 'http://localhost:4800', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // Sign out URL
  redirectSignOut : 'http://localhost:4800', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // 'code' for Authorization code grant,
  // 'token' for Implicit grant
  // Note that REFRESH token will only be generated when the responseType is code
  responseType: 'token',

  // optional, for Cognito hosted ui specified options
  options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag : true
  },

  // urlOpener: urlOpener
};

Amplify.configure({
  ...awsconfig,
  oauth: oauth,
  Analytics: {
    disabled: true
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
