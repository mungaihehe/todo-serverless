import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
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
    Key: {
      userId: user,
      todoId: event.pathParameters?.id,
    },
    UpdateExpression: "SET completed = :completed",
    ExpressionAttributeValues: {
      ":completed": data.completed || null,
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    await db.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ status: true }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
