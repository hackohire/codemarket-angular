import { plans } from '../app/shared/constants/plan_details';

export const environment = {
  ckEditor: {
    ckEditorEnvironMentId: 'ZK5UoNVFJG2R3Kh4SrIC',
    ckEditorSecretKey: 'HP771KcTLlvStVbtvwAGz5d3LhLgDlY50uJqNQ6nkS18kVP43ZPB1zOSLseK',
    ws: '71258.cke-cs.com/ws',
    developmentTokenUrl: 'https://71258.cke-cs.com/token/dev/qhNbD6xUjkeVtrEc7aD2PcMhDkgmirUJHunqRWESilB0mTzZ0RHcJYk68P6D'
  },
  production: true,
  serverless_url: 'https://inc500api.codemarket.io/',
  graphql_url: 'https://inc500api.codemarket.io/graphql',
  s3FilesBucketURL: 'https://inc5000-files.s3.amazonaws.com/public/',
  stripe_public_key: 'pk_live_EYCoYtpLszr802sOl89WeuW1',
  // stripe_public_key: 'pk_test_ighmL2U9UqAx0O4b8dKkSvdq',
  webSocketURL: 'wss://vacf39zvdh.execute-api.us-east-1.amazonaws.com/inc500',
  // planDetails: plans.prod,
  planDetails: plans.prod,
  fileS3Bucket: 'inc5000-files',
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
