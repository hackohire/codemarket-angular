import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import Amplify from '@aws-amplify/core';
import awsconfig from './aws-exports';


import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Storage from '@aws-amplify/storage';
import Amplify from '@aws-amplify/core';

if (environment.production) {
  enableProdMode();
}
// Amplify.Logger.LOG_LEVEL = 'DEBUG'
Amplify.configure({
  Auth: {
    ...awsconfig,
    "oauth": environment.oauth,
    authenticationFlowType: 'USER_SRP_AUTH',
    identityPoolId: "us-east-1:b08baf8a-8de9-45bc-a2d8-d537e23d2426",
    region: "us-east-1",
    identityPoolRegion: "us-east-1",
    userPoolId: "us-east-1_B4xlOmGS0",
    userPoolWebClientId: "6b96cs2pmq0khunn6mth7r48td",
  }
});
Storage.configure(awsconfig);

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
