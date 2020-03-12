import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  production: true,
  COGNITO_AUTH_DOMAIN: 'https://platform.auth.us-east-1.amazoncognito.com',
  serverless_url: 'https://amber-api.codemarket.io/',
  graphql_url: 'https://amber-api.codemarket.io/graphql/graphql',
  s3FilesBucketURL: 'https://amber-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://198kf3924d.execute-api.us-east-1.amazonaws.com/amber',
  applicationId: '5d2ef428bbfa6576b357d5d4',
  googleAPIKey: 'AIzaSyAOpIXHUPA5bMssoAW3NDUGHveOf0N_tsY',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  oauth: {
    // Domain name
    domain: 'platform.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope: ['email', 'profile', 'openid'],

    // Callback URL
    redirectSignIn: 'https://www.amber.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // Sign out URL
    redirectSignOut: 'https://www.amber.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // 'code' for Authorization code grant,
    // 'token' for Implicit grant
    // Note that REFRESH token will only be generated when the responseType is code
    responseType: 'code',

    // optional, for Cognito hosted ui specified options
    options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag: true
    },
  }
,
	baseHref: '/'
};
