export const environment = {
  production: true,
  COGNITO_AUTH_DOMAIN: 'https://platform.auth.us-east-1.amazoncognito.com',
  platform_graphql_url: 'https://qs3c3z6r40.execute-api.ap-south-1.amazonaws.com/prod/graphql',
  graphql_url: 'https://qnzhh56xx7.execute-api.ap-south-1.amazonaws.com/prod/graphql',
  codemarketFilesBucket: 'https://codemarket-files.s3.amazonaws.com/public/',
  paypalSandbox: 'https://api.sandbox.paypal.com',
  paypalLive: 'https://api.paypal.com',
  paypalClientId: 'AVR1oK5MHxZUx0Ikqva1nyHFIL6S1c1N_bAfStE2gcqyOabNrk6_zditFtnEUYwTGhEbLkOEvgyKlvXY',
  paypalSecret: 'EL11MdtgJ_qCyuhtzINcHmans8w3LvyrgouI_V-4LUqe_LmYOzsLTjKKCHKN9Wy_WLZAZXKP3Px969Mf',
  webSocketURL: 'wss://i8zthpq9j3.execute-api.ap-south-1.amazonaws.com/prod',
  applicationId: '5d2ef428bbfa6576b357d5d4',
  oauth: {
    // Domain name
    domain: 'platform.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope: ['email', 'profile', 'openid'],

    // Callback URL
    redirectSignIn: 'https://www.codemarket.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // Sign out URL
    redirectSignOut: 'https://www.codemarket.io', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

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
