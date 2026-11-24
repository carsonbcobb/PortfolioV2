# Amplify redirect rules

`amplify-rules.json` is the full list of rewrites and redirects for the Amplify app (d3fh7gb9zd2b7e). Amplify keeps these rules on the app, not in the build, so changing this file does nothing until the rules are applied:

```bash
aws amplify update-app --app-id d3fh7gb9zd2b7e --custom-rules file://hosting/amplify-rules.json
```

Rules run top to bottom and the first match wins. Each old URL has its own trailing slash rule, so it reaches its new home in one 301. The generic rule removes a trailing slash from any other path, and the 404 rule stays last.
