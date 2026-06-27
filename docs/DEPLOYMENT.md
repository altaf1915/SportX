# SportX Deployment Guide

## MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user with least-privilege access.
3. Allow the deployment provider IP range or use Atlas network access rules.
4. Add the connection string as `MONGODB_URI`.

## Cloudinary

Create a Cloudinary account and add:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The project is already configured for Cloudinary-backed profile photos and media payloads.

## Render

This repo includes `render.yaml`.

1. Push the repo to GitHub.
2. In Render, create a Blueprint from the repository.
3. Set backend environment variables from `.env.example`.
4. Set `VITE_API_URL` on the static site to your API URL plus `/api`.
5. Set `CLIENT_URL` on the API to your frontend URL.

## Railway

1. Create a Railway project.
2. Add a Node service for `server`.
3. Set `server` as the root directory.
4. Add all backend environment variables.
5. Add a static frontend service or deploy `client/dist` to your preferred host.

## Local Production Check

```bash
npm run install:all
npm run seed --workspace server
npm run build
npm start
```

## Production Notes

- Use a long random `JWT_SECRET`.
- Keep `NODE_ENV=production`.
- Use HTTPS only.
- Configure domain-level CORS through `CLIENT_URL`.
- Store secrets only in the deployment provider environment settings.
- Enable MongoDB Atlas backups and alerts.
- Add a transactional email provider before enabling real password reset emails.
