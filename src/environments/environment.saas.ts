import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  braintree_client: 'sandbox_x6kwrbkb_hnwczpyytcggqqth',
  paypal_client: 'AWyqKpeiqQS6vUI7k7u2LpwhSZr0ikUzcbYLM50aBLmwo2fAtIsVkZrSn5tWZ_bElFtV34Lj5Q3ukeqA',
  ckEditor: {
    ckEditorEnvironMentId: 'qWCSnjZdhKZIm2BDeR6e',
    ckEditorSecretKey: 'vOhUDQFlGWDTaOpVQmaPPm47RA9zFQ00tB6dQRdIa6Dqtxn7Uf8iGEc8oCMb',
    ws: '71258.cke-cs.com/ws',
    developmentTokenUrl: 'https://71258.cke-cs.com/token/dev/qhNbD6xUjkeVtrEc7aD2PcMhDkgmirUJHunqRWESilB0mTzZ0RHcJYk68P6D'
  },
  production: true,
  tiny_api: '5fsqmw7kewxh0ljo1cfr46zhxre6demtcb67n0nzg736c1s4',
  serverless_url: 'https://saasapi.codemarket.io/',
  graphql_url: 'https://saasapi.codemarket.io/graphql',
  s3FilesBucketURL: 'https://saasfiles.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://bo6h6u8s7k.execute-api.us-east-1.amazonaws.com/saas',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'saasfiles',
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
