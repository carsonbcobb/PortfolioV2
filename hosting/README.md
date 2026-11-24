# Amplify redirect rules

`amplify-rules.json` is the full list of rewrites and redirects for the Amplify app (d3fh7gb9zd2b7e). Amplify keeps these rules on the app, not in the build, so changing this file does nothing until the rules are applied.

The file is generated. After adding or renaming pages, rebuild, regenerate and apply:

```bash
npm run build && node scripts/amplify-rules.mjs
```

```bash
aws amplify update-app --app-id d3fh7gb9zd2b7e --custom-rules file://hosting/amplify-rules.json
```

Every built page gets its own rule from "/page/" to "/page". A single sitewide rule doesn't work: Amplify adds a slash to any path it can't find, so stripping it again loops on missing pages. Old URLs get a trailing slash rule too, so they reach their new home in one 301. The 404 rule stays last.

The non www to www redirect runs at the domain level, before these rules, so carsoncobb.com/page/ takes two hops (www first, then the slash).
