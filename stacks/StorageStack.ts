import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

export class StorageStack extends sst.Stack {
  bucket: sst.Bucket;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    this.bucket = new sst.Bucket(this, "uploads", {
      s3Bucket: {
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: [
              HttpMethods.GET,
              HttpMethods.PUT,
              HttpMethods.POST,
              HttpMethods.DELETE,
              HttpMethods.HEAD,
            ],
          },
        ],
      },
    });
  }
}
