import { Stack } from "aws-cdk-lib";
import { defineBackend } from '@aws-amplify/backend';
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatroomAssign } from './functions/chatroomAssign/resource';

const backend = defineBackend({
  auth,
  data,
  chatroomAssign
});

const challengeTableArn = backend.data.resources.tables["Challenge"].tableArn;
export const challengeTableName = backend.data.resources.tables["Challenge"].tableName
const challengeTable = backend.data.resources.tables["Challenge"];

const policy = new Policy(
  Stack.of(challengeTable),
  "MyDynamoDBFunctionPolicy2",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [challengeTableArn],
      }),
    ],
  }
);
backend.chatroomAssign.resources.lambda.role?.attachInlinePolicy(policy);

// backend.chatroomAssign.addEnvironment("TABLE_NAME",challengeTableName)
// backend.chatroomAssign.resources.lambda.addEventSource()
//backend.chatroomAssign.resources.lambda.
chatroomAssign.getInstance.bind({environment: { "TableName": challengeTableName}})
// backend.chatroomAssign.resources.lambda.addToRolePolicy(statement)
