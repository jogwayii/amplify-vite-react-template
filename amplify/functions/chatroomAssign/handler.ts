import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { env } from '$amplify/env/chat-room-assign'; // the import is '$amplify/env/<function-name>'

const ddbClient = new DynamoDBClient({});
const { TableName } = env;


export const handler = async (event: any) => {
  const { name } = event.arguments;
  console.log(`Processing challenge: ${name}`);

  if (typeof name !== "string") {
    throw new Error("Invalid challengeID");
  }

  const command = new GetItemCommand({
    TableName,
    Key: {
      "id": { S: name }
    }
  });

  try {
    const response = await ddbClient.send(command);
    console.log("DynamoDB response:", JSON.stringify(response, null, 2));

    if (response.Item) {
      const challengeName = response.Item.name?.S || "Unknown";
      console.log(`Challenge name: ${challengeName}`);
      return `Successfully retrieved challenge: ${challengeName}`;
    } else {
      console.log(`No challenge found with ID: ${name}`);
      return `No challenge found with ID: ${name}`;
    }
  } catch (error) {
    console.error("Error executing DynamoDB command:", error);
    throw error;
  }
};