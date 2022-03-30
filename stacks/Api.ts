import * as sst from "@serverless-stack/resources";

export class ApiStack extends sst.Stack {
  api: sst.Api;
  constructor(
    scope: sst.App,
    id: string,
    props: sst.StackProps & { table: sst.Table }
  ) {
    super(scope, id, props);
    const { table } = props;

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        "POST /todo": "src/create.handler",
        "GET /todos": "src/list.handler",
        "PUT /todo/{id}": "src/update.handler",
        "DELETE /todo/{id}": "src/delete.handler",
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
