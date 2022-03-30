import * as sst from "@serverless-stack/resources";
import { ApiStack } from "./Api";
import { TableStack } from "./Table";
import { AuthStack } from "./Auth";
import { StorageStack } from "./StorageStack";
import { FrontendStack } from "./Frontend";
export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });
  const tableStack = new TableStack(app, "table");

  const apiStack = new ApiStack(app, "api", { table: tableStack.table });
  const bucketStack = new StorageStack(app, "bucket");
  const authStack = new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: bucketStack.bucket,
  });

  new FrontendStack(app, "frontend", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: bucketStack.bucket,
  });
}
