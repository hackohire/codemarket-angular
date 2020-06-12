import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  braintree_client: 'sandbox_x6kwrbkb_hnwczpyytcggqqth',
  paypal_client: 'AWyqKpeiqQS6vUI7k7u2LpwhSZr0ikUzcbYLM50aBLmwo2fAtIsVkZrSn5tWZ_bElFtV34Lj5Q3ukeqA',
  ckEditor: {
    CKEDITOR_ENVIRONMENT_ID: "5OgsvqWDG6xC3VXY17lL",
    CKEDITOR_SECRET_KEY: 'nrKe5ANkb47Dcsxo8TwMNUwJXVrK1TSH2auQZhIcR7ZFrLyhrSPyQDYvcQSW',
    ws: '71258.cke-cs.com/ws',
    developmentTokenUrl: 'https://71258.cke-cs.com/token/dev/qhNbD6xUjkeVtrEc7aD2PcMhDkgmirUJHunqRWESilB0mTzZ0RHcJYk68P6D'
  },
  production: true,
  serverless_url: 'https://cancerapi.codemarket.io/',
  graphql_url: 'https://cancerapi.codemarket.io/graphql',
  s3FilesBucketURL: 'https://cancer-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://elncp90rvf.execute-api.us-east-1.amazonaws.com/cancer',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'cancer-files',
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
    password: '',
    name: ''
  }
};
