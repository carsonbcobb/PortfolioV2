import { defineFunction } from "@aws-amplify/backend";

/**
 * Admin auth function: validates password server-side.
 * Set ADMIN_PASSWORD in Amplify Console > App settings > Environment variables for the branch.
 */
export const adminAuth = defineFunction({
  name: "admin-auth",
  entry: "./handler.ts",
});
