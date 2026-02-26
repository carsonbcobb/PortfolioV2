# Admin password and real protection

The admin page at `/admin` uses a **client-side only** gate: the form is hidden until you enter a password, which is stored in `sessionStorage`. That is **not security** — anyone can open devtools and bypass it or read the form from the page source.

## Options for real protection on Amplify

### 1. Amplify branch access control (no code change)

Use Amplify’s built-in password protection for a **branch**:

1. In **Amplify Console** → your app → **Hosting** → **Access control** → **Manage access**.
2. Turn off “Manage access for all branches” if you only want to protect one branch.
3. For the branch you use for admin (e.g. a dedicated `admin` branch, or a preview branch), set **Restricted – password required** and set a username and password.

Then use that branch’s URL (e.g. the Amplify-provided URL for that branch) to access the app; the whole deployment is behind HTTP auth. You can use that URL only when you need to use `/admin`. Your main production branch stays public.

### 2. Protect the whole app with one password

In **Access control**, enable “Manage access for all branches” and set one username/password. Every branch (including production) will require that password. Simple but affects the entire site.

### 3. Path-level protection (Lambda@Edge or separate backend)

To protect **only** `/admin` on the same domain (e.g. `carsoncobb.com/admin`), you need something that runs before the static file is served:

- **Lambda@Edge** (on the CloudFront distribution Amplify uses): check a cookie or header and return 401/403 for `/admin` when not authenticated; otherwise allow the request. Requires writing and deploying a small Lambda and attaching it to the Amplify/CloudFront behavior for `/admin`.
- **Separate backend**: host the admin app on a different subdomain or service (e.g. a small Node app behind HTTP Basic Auth or a real login) and link to it from your main site.

The current setup is fine for “don’t link to admin from the site and rely on obscurity,” but for real access control use one of the options above.
