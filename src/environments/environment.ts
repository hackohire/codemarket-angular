import { plans } from '../app/shared/constants/plan_details';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  braintree_client: 'sandbox_x6kwrbkb_hnwczpyytcggqqth',
  ckEditor: {
    ckEditorEnvironMentId: 'ZK5UoNVFJG2R3Kh4SrIC',
    ckEditorSecretKey: 'HP771KcTLlvStVbtvwAGz5d3LhLgDlY50uJqNQ6nkS18kVP43ZPB1zOSLseK',
    ws: '71258.cke-cs.com/ws',
    developmentTokenUrl: 'https://71258.cke-cs.com/token/dev/qhNbD6xUjkeVtrEc7aD2PcMhDkgmirUJHunqRWESilB0mTzZ0RHcJYk68P6D'
  },
  COGNITO_AUTH_DOMAIN: 'https://platform.auth.us-east-1.amazoncognito.com',
  serverless_url: 'http://localhost:3200/dev/',
  graphql_url: 'http://localhost:3200/dev/graphql',
  s3FilesBucketURL: 'https://codemarket-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'ws://localhost:3001',
  planDetails: plans.dev,
  fileS3Bucket: 'manav-files',
  oauth: {
    // Domain name
    domain: 'platform.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope: ['email', 'profile', 'openid'],

    // Callback URL
    redirectSignIn: 'http://localhost:4800', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // Sign out URL
    redirectSignOut: 'http://localhost:4800', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // 'code' for Authorization code grant,
    // 'token' for Implicit grant
    // Note that REFRESH token will only be generated when the responseType is code
    responseType: 'code',

    // optional, for Cognito hosted ui specified options
    options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag: true
    },
  },
  baseHref: '/',
  confirm: {
    email: '',
    password: '',
    name: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
