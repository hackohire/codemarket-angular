import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  production: true,
  tiny_api: '5fsqmw7kewxh0ljo1cfr46zhxre6demtcb67n0nzg736c1s4',
  serverless_url: 'https://nonprofitapi.codemarket.io/',
  graphql_url: 'https://nonprofitapi.codemarket.io/graphql',
  s3FilesBucketURL: 'https://nonprofit-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://wg5znmqvj4.execute-api.us-east-1.amazonaws.com/nonprofit',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'nonprofit-files',
  oauth: {
    // Domain name
    domain: 'platform.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope: ['email', 'profile', 'openid'],

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
    password: ''
  }
};