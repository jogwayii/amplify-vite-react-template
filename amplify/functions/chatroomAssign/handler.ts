import { Schema } from '../../data/resource';
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});
const TableName = process.env.TABLE_NAME;


export const handler: Schema["chatroomAssign"]["functionHandler"] = async (event) => {
  const challengeID = event.arguments.name;
  console.log(`Processing challenge: ${challengeID}`);

  if (typeof challengeID !== "string") {
    throw new Error("Invalid challengeID");
  }

  const command = new GetItemCommand({
    TableName,
    Key: {
      "id": { S: challengeID }
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
      console.log(`No challenge found with ID: ${challengeID}`);
      return `No challenge found with ID: ${challengeID}`;
    }
  } catch (error) {
    console.error("Error executing DynamoDB command:", error);
    throw error;
  }
};