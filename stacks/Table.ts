import * as sst from "@serverless-stack/resources";

export class TableStack extends sst.Stack {
  table: sst.Table;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    this.table = new sst.Table(this, "todos", {
      fields: {
        userId: sst.TableFieldType.STRING,
        todoId: sst.TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: "userId",
        sortKey: "todoId",
      },
    });
  }
}
