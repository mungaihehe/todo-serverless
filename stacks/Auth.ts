import * as sst from "@serverless-stack/resources";
import * as iam from "aws-cdk-lib/aws-iam";
export class AuthStack extends sst.Stack {
  auth: sst.Auth;
  constructor(
    scope: sst.App,
    id: string,
    props: sst.StackProps & { api: sst.Api; bucket: sst.Bucket }
  ) {
    super(scope, id, props);
    const { api, bucket } = props;
    this.auth = new sst.Auth(this, "auth", {
      cognito: {
        userPool: {
          signInAliases: { email: true },
        },
      },
    });
    this.auth.attachPermissionsForAuthUsers([
      api,
      new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        ],
      }),
    ]);

    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool?.userPoolId || "",
      IdentityPool: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient?.userPoolClientId || "",
    });
  }
}
