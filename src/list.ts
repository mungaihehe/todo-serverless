import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
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
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": user,
    },
  };
  try {
    const results = await db.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(results.Items),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
