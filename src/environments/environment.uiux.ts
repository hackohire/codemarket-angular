import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  ckEditor: {
    ckEditorEnvironMentId: 'qWCSnjZdhKZIm2BDeR6e',
    ckEditorSecretKey: 'vOhUDQFlGWDTaOpVQmaPPm47RA9zFQ00tB6dQRdIa6Dqtxn7Uf8iGEc8oCMb',
    ws: '71258.cke-cs.com/ws',
    developmentTokenUrl: 'https://71258.cke-cs.com/token/dev/qhNbD6xUjkeVtrEc7aD2PcMhDkgmirUJHunqRWESilB0mTzZ0RHcJYk68P6D'
  },
  production: true,
  serverless_url: 'https://uiuxapi.codemarket.io/',
  graphql_url: 'https://uiuxapi.codemarket.io/graphql',
  s3FilesBucketURL: 'https://uiux-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://tmpeua7g2l.execute-api.us-east-1.amazonaws.com/uiux',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'uiux-files',
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
