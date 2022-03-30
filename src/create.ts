import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const data = JSON.parse(event.body || "{}");
  if (!process.env.TABLE_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Table name not defined" }),
    };
  }
  const user: string = (event.requestContext as any).authorizer.iam
    .cognitoIdentity.identityId;
  if (!user) {
    return {
      statusCode: 403,
    };
  }
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: user,
      todoId: v4(),
      content: data.content,
      completed: data.completed,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };
  try {
    await db.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
