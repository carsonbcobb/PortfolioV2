import { defineAuth } from "@aws-amplify/backend";

/**
 * Amplify Auth (Cognito). Use this to protect /admin:
 * configure the React app with Amplify, then require sign-in before showing the admin form.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
