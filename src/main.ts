
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
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    region: awsconfig.aws_cognito_region,
    identityPoolRegion: awsconfig.aws_cognito_region,
    userPoolId: awsconfig.aws_user_pools_id,
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
  }
});
Storage.configure(awsconfig);

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
