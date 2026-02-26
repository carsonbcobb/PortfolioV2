# Amplify backend (Gen 2)

This folder follows the [Amplify “Add functions to this branch”](https://docs.aws.amazon.com/amplify/latest/userguide/serverless-functions.html) flow.

## 1. Initialize Amplify (if needed)

If you don’t have Amplify set up yet, from the **app root** run:

```bash
# If you use Yarn and get "node is incompatible" (Node 20 vs expo-cli):
yarn config set ignore-engines true

# Then run the scaffolder (interactive):
npx create-amplify@latest
```

When it asks **"Where should we create your project?"** press **Enter** to use the current directory (`.`). Use the defaults for other prompts. That will create/update `amplify/backend.ts` and add dependencies.

## 2. Auth and admin-auth are already registered

`amplify/backend.ts` already includes:
- **auth** – Amplify Auth (Cognito) with email sign-in. Use this in your React app to require sign-in before showing the admin form (see [Set up Amplify Auth](https://docs.amplify.aws/javascript/build-a-backend/auth/set-up-auth/)).
- **adminAuth** – Lambda that validates a password (for optional HTTP API login).

To add another function or resource later, import it in `amplify/backend.ts` and add it to the `defineBackend({ ... })` object.

## 3. Set the admin password

- **Local (sandbox):** set env before running sandbox, or use `npx ampx sandbox secret set ADMIN_PASSWORD`.
- **Amplify Hosting:** in the Amplify Console → **App settings** → **Environment variables**, add `ADMIN_PASSWORD` for the branch.

## 4. Deploy and connect the React app

- **Local:** `npx ampx sandbox` (deploys on save). When the sandbox finishes, it generates `amplify_outputs.json` in the **project root**. Copy it to **`src/amplify_outputs.json`** so the React app can use Auth:
  ```bash
  cp amplify_outputs.json src/amplify_outputs.json
  ```
- **CI/CD:** In Amplify Hosting, the build generates `amplify_outputs.json` automatically. Ensure your build copies it to `src/` (or that the app loads it from the path your build uses) so the `/admin` route gets real Auth config.

## 5. Call the function from the admin page (optional)

Right now the function is a Lambda only. To call it from the **static** `/admin` page over HTTP you need to add an **HTTP API** route that invokes this Lambda (e.g. `POST /admin/login` → `adminAuth`).

1. In `amplify/backend.ts`, use the CDK to create an `HttpApi` and add a route that uses `HttpLambdaIntegration` with `backend.adminAuth.resources.lambda`.
2. Add the API URL to your app config (e.g. `amplify_outputs.json` or env) and have the admin page `fetch` that URL with the password in the body.

Docs: [Set up Amplify HTTP API](https://docs.amplify.aws/react/build-a-backend/add-aws-services/rest-api/set-up-http-api/).

Once that’s in place, update the admin page to call this endpoint instead of relying on the client-only gate.
