import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatroomAssign } from './functions/chatroomAssign/resource';

defineBackend({
  auth,
  data,
  chatroomAssign
});
