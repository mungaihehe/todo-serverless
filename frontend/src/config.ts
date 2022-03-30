export const config = {
  s3: {
    region: process.env.REACT_APP_REGION,
    bucket: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    region: process.env.REACT_APP_REGION,
    url: process.env.REACT_APP_API_URL,
  },
  cognito: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    appClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};
