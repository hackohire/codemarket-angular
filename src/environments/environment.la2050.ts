import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  production: true,
  tiny_api: '5fsqmw7kewxh0ljo1cfr46zhxre6demtcb67n0nzg736c1s4',
  serverless_url: 'https://la2050api.codemarket.io/',
  graphql_url: 'https://la2050api.codemarket.io/graphql',
  s3FilesBucketURL: 'https://la2050-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: ' wss://2q88m6qblh.execute-api.us-east-1.amazonaws.com/la2050',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'la2050-files',
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
