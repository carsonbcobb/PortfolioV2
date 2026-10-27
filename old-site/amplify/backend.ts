import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { adminAuth } from "./functions/admin-auth/resource";

const backend = defineBackend({
  auth,
  adminAuth,
});
