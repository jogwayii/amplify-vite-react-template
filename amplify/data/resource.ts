import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { chatroomAssign } from '../functions/chatroomAssign/resource';

const schema = a
  .schema({
    User: a
      .model({
        id: a.id().required(),
        mobilePhone: a.string().required(),
        firstName: a.string(),
        lastName: a.string(),
        nickName: a.string(),
        emoji: a.string(),
        emojiNicknameEmoji: a.string(),
        email: a.string(),
        emailVerified: a.boolean(),
        coachFlag: a.boolean(),
        adminFlag: a.boolean(),
        expoPushToken: a.string(),
        expoPushSoundOn: a.boolean(),
        expoPushAdaptive: a.boolean(),
        expoPushMute: a.boolean(),
        notes: a.string().array(),
        TTPcustomer: a.boolean(),
        lastActivityTime: a.datetime(),
        mustUpgradeApp: a.boolean(),
        preferredTimezone: a.string().default('America/New_York'),
        typicalWeekdayWakeTime: a.string().default('7am'),
        magicWords: a.string().array(),
        prefDelayInHours: a.integer().default(0),
      }).identifier(['id'])
      .secondaryIndexes((index) => [
        index("mobilePhone"),
        index("email")
      ])
      .authorization(allow => [allow.publicApiKey()]),

    Challenge: a
    .model({
      id: a.id().required(),
      name: a.string(),
      shortName: a.string(),
      availableDate: a.date(),  // Making this required as it's now part of the primary key
      launchDate: a.date(),
      chatFreezeDate: a.date(),
      oneTimeOfferDate: a.date(),
      oneTimePrice: a.float(),
      oneTimePricePaywallId: a.string(),
      minDaysInAdvanceForTypicalPrice: a.integer().default(7),
      typicalPrice: a.float(),
      typicalPricePaywallId: a.string(),
      fullPrice: a.float(),
      fullPricePaywallId: a.string(),
      salesBullets: a.string().array(),
      backgroundImageUrl: a.string(),
      status: a.string().default('enabled'),  // You might want to add this field to track challenge status
      prefMinTeamSize: a.integer().default(3),
      prefMaxTeamSize: a.integer().default(20),
    })
    .identifier(['id'])  // Making availableDate part of the primary key
    .secondaryIndexes((index) => [
      index("status")
        .sortKeys(["launchDate"])
        .queryField("listChallengesByStatusAndLaunchDate"),
      index("status")
        .sortKeys(["availableDate"])
        .queryField("listChallengesByStatusAndAvailableDate")
    ])
    .authorization(allow => [allow.publicApiKey()]),
    // all the above list permissions are to enable subscirbe... not sure which one actually does it.
    
    UserEntitlementChal: a
      .model({
        name: a.string().required(),
        userID: a.string().required(),
        createDate: a.string(),
        startDate: a.string(),
        endDate: a.string(),
      })
    .identifier(['name', 'userID'])
    .secondaryIndexes((index) => [
      index("userID").sortKeys(["name"]).queryField("listEntitlementsByUser")
    ])
    .authorization(allow => [allow.publicApiKey()]),

    Chatroom: a
    .model({
      challengeID: a.string().required(),
      chatroomID: a.string().required(),
      name: a.string(),
      status: a.string(),
      latestMessageBody: a.string(),
      latestEmojiNickname: a.string(),
      latestExtLink: a.string(),
      latestImageURL: a.string(),
      latestBigImageURL: a.string(),
      latestMessageDate: a.datetime()
    })
    .identifier(['challengeID', 'chatroomID'])
    .authorization(allow => [allow.publicApiKey()]),
    
    UserChatroom: a
      .model({
        userID: a.string().required(),
        chatroomID: a.string().required(),
        challengeID: a.string(),
        role: a.string(),
        status: a.string(),
      })
      .identifier(['userID', 'chatroomID'])
      .secondaryIndexes((index) => [
        index("chatroomID").sortKeys(["userID"]).queryField("listUsersByChatroom"),
        index("challengeID").sortKeys(["userID"]).queryField("listUsersByChallenge")
      ])
      .authorization(allow => [allow.publicApiKey()]),

    LatestMessage: a
      .model({
        id: a.id().required(),
        messageBody: a.string(),
        emojiNickname: a.string(),
        extLink: a.string(),
        imageURL: a.string(),
        bigImageURL: a.string(),
      }).identifier(['id'])
      .authorization(allow => [allow.publicApiKey()]),
      
    chatroomAssign: a
      .query()
      .arguments({
        name: a.string(),
      })
      .returns(a.string())
      .handler(a.handler.function(chatroomAssign))
      .authorization(allow => [allow.publicApiKey()]),
  }).authorization(allow => [allow.resource(chatroomAssign)]);;


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
