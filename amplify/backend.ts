import { defineBackend } from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatroomAssign } from './functions/chatroomAssign/resource';

const backend = defineBackend({
  auth,
  data,
  chatroomAssign
});

const challengeTableArn = backend.data.resources.tables["Challenge"].tableArn;
const challengeTableName = backend.data.resources.tables["Challenge"].tableName
// const challengeTable = backend.data.resources.tables["Challenge"];

const statement = new iam.PolicyStatement({
  sid: "AllowDynamoDBUsage",
  actions: ["dynamodb:*"],
  resources: [challengeTableArn],
})

backend.chatroomAssign.addEnvironment("TABLE_NAME",challengeTableName)
backend.chatroomAssign.resources.lambda.addToRolePolicy(statement)
