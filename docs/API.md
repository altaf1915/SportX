# SportX API Documentation

Base URL: `/api`

Authentication uses JWT through `Authorization: Bearer <token>` or a secure HTTP-only cookie. For cookie sessions, call `GET /api/csrf-token` and send `x-csrf-token` on unsafe requests.

## Auth

- `POST /auth/signup` - email signup with OTP generation
- `POST /auth/login` - login and receive JWT
- `POST /auth/google` - Google profile login handoff
- `POST /auth/forgot-password` - password reset initiation
- `POST /auth/reset-password` - complete reset with token and new password
- `POST /auth/verify-otp` - verify account OTP
- `POST /auth/change-password` - change password for an authenticated user
- `POST /auth/refresh` - rotate/refresh the current JWT session
- `POST /auth/logout` - clear auth cookie
- `GET /auth/me` - current user

## Users and Partners

- `PATCH /users/me/profile` - update profile, interests, city, availability, location, avatar
- `POST /users/me/premium` - enable premium on the authenticated profile
- `GET /users/partners?sport=&skillLevel=&gender=&city=&minAge=&maxAge=&lng=&lat=&distance=` - nearby and filtered partner search
- `GET /users/:id` - public player profile with reviews
- `POST /users/:id/reviews` - rating, review, fair-play score update

## Matches

- `GET /matches` - list public/open matches with sport, city, status, and geo filters
- `POST /matches` - create public or private match
- `GET /matches/mine` - match history and upcoming user matches
- `POST /matches/:id/join` - join or waitlist
- `POST /matches/:id/leave` - leave match

## Chat

- `GET /chat/conversations`
- `POST /chat/conversations`
- `GET /chat/conversations/:id/messages`
- `POST /chat/conversations/:id/messages`
- `PATCH /chat/conversations/:id/read`

Socket.io events:

- `conversation:join`
- `typing:start`
- `typing:stop`
- `message:new`
- `message:read`

## Communities and Events

- `GET /communities`
- `POST /communities`
- `POST /communities/:id/join`
- `POST /communities/:id/discussions`
- `GET /communities/events`
- `POST /communities/events`
- `POST /communities/tournament/generate`

## AI

- `GET /ai/recommendations` - match and partner suggestions plus fitness tips
- `POST /ai/chatbot` - sports assistant response

## Admin

Admin role required.

- `GET /admin/analytics`
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `GET /admin/grounds`
- `POST /admin/grounds`
- `GET /admin/reports`

## Security

SportX includes Helmet, CORS, rate limiting, Mongo query sanitization, XSS cleaning, HPP protection, secure JWT cookies, CSRF checks for cookie-authenticated writes, role-based access, input validation, and Mongoose schema validation.
