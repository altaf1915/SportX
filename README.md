# SportX

SportX is a production-ready sports and indoor games partner finder platform. Users can discover nearby players, create or join matches, chat in real time, build communities, organize tournaments, and manage premium features.

## Stack

- React, Vite, Tailwind CSS, Bootstrap, Framer Motion, React Router, Axios, React Query
- Node.js, Express, MongoDB Atlas, Mongoose, JWT, Socket.io
- Cloudinary-ready media uploads
- Render/Railway-ready deployment

## Quick Start

1. Install dependencies:

```bash
npm run install:all
```

2. Copy `server/.env.example` to `server/.env` and fill in MongoDB Atlas, JWT, Cloudinary, and email credentials. Copy `client/.env.example` to `client/.env` if the API is not served through the Vite proxy.

3. Optional: seed admin/test data after MongoDB is configured:

```bash
npm run seed --workspace server
```

Seeded credentials:

- Admin: `admin@sportx.local` / `Admin@12345`
- Test player: `player@sportx.local` / `Player@12345`

4. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Production

```bash
npm run build
npm start
```

See [docs/API.md](docs/API.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Feature Coverage

- Auth: register, login, logout, OTP verify, forgot/reset password, refresh token, change password, Google profile handoff endpoint
- Platform: premium home, partners, matches, communities, chat, profile, premium, admin analytics
- Backend: REST APIs, validation, JWT protection, admin roles, Socket.io hooks, rate limiting, Helmet, compression, Mongo sanitization, HPP, CSRF for cookie writes
- Docs: API, deployment, environment variables, MongoDB collections
