import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  WaitlistEntry: a
    .model({
      email: a.string().required(),
    })
    .authorization((allow) => [allow.guest().to(['create'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
