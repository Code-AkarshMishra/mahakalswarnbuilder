# Mahakal Swarn Builder

The public website and admin portal are deployed from this GitHub repository through Vercel. Hostinger manages the domain's DNS; the website's server-side code and API run on Vercel.

## Production setup

1. Create a Neon Postgres project and copy its pooled connection string.
2. In Vercel, open the project's **Settings → Environment Variables** and add `DATABASE_URL` with the Neon connection string. Enable it for Production (and Preview if needed).
3. Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a unique `ADMIN_SESSION_SECRET` in the same Vercel settings. Use a strong password and a randomly generated session secret; do not use the sample values from `.env.example`.
4. Redeploy the Vercel project so the new environment variables are available to its server functions.

The application creates its settings and admin-credential tables in Neon automatically. On the first request, the current checked-in rates are copied into the database if it has no saved settings. Admin updates to rates, materials, package specifications, tax settings, construction timeline, and company/bill details are then stored in Neon and immediately served to the public site; they do not require another deployment. Admin password changes are stored there as salted hashes as well.

The login API does not write credentials to the Vercel filesystem. Local development without `DATABASE_URL` continues to use `data/rates.json` and local credential storage. In production, admin edits are rejected with a configuration message until `DATABASE_URL` is set rather than appearing to save to temporary storage.

## Local development

Copy `.env.example` to `.env.local`, set the admin credentials and a unique session secret, and optionally set `DATABASE_URL` to a Neon development database. Without a database URL, rates and credentials use local files.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```
