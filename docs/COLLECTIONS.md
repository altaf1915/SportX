# MongoDB Collections

- `users` - accounts, roles, profile details, trust/fair-play scores, verification, password reset metadata
- `matches` - public/private games, venue data, players, waitlists, status, prices
- `communities` - sport groups, members, moderators, discussions
- `events` - tournaments, meetups, fixtures, brackets, attendees
- `conversations` - chat rooms linked to users, matches, or communities
- `messages` - chat messages, media payloads, read receipts
- `notifications` - match, chat, premium, and system notifications
- `reviews` - player ratings, fair-play feedback, match-linked reviews
- `reports` - safety reports and moderation status
- `grounds` - managed venues and availability metadata

Important indexes are declared in the Mongoose schemas for geospatial search, text search, and common listing screens.
