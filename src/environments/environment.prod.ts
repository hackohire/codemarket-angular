export const environment = {
  production: true,
  COGNITO_AUTH_DOMAIN: 'https://platform.auth.us-east-1.amazoncognito.com',
  platform_graphql_url: 'https://qs3c3z6r40.execute-api.ap-south-1.amazonaws.com/prod/graphql',
  graphql_url: 'https://qnzhh56xx7.execute-api.ap-south-1.amazonaws.com/prod/graphql',
  codemarketFilesBucket: 'https://codemarket-files.s3.amazonaws.com/public/',
  applicationId: '5d2ef428bbfa6576b357d5d4',
  oauth: {
    // Domain name
    domain: 'platform.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope: ['email', 'profile', 'openid'],

    // Callback URL
    redirectSignIn: 'https://codemarket.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // Sign out URL
    redirectSignOut: 'https://codemarket.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

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
};
