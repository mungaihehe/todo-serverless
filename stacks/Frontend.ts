import * as sst from "@serverless-stack/resources";

export class FrontendStack extends sst.Stack {
  constructor(
    scope: sst.App,
    id: string,
    props: sst.StackProps & { api: sst.Api; auth: sst.Auth; bucket: sst.Bucket }
  ) {
    super(scope, id, props);

    const { api, auth, bucket } = props;

    const site = new sst.ReactStaticSite(this, "ReactSite", {
      path: "frontend",
      buildCommand: "CI=false npm run build",
      environment: {
        REACT_APP_API_URL: api.url,
        REACT_APP_REGION: scope.region,
        REACT_APP_BUCKET: bucket.bucketName,
        REACT_APP_USER_POOL_ID: auth.cognitoUserPool?.userPoolId || "",
        REACT_APP_IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
        REACT_APP_USER_POOL_CLIENT_ID:
          auth.cognitoUserPoolClient?.userPoolClientId || "",
      },
    });

    this.addOutputs({
      SiteUrl: site.url,
    });
  }
}
