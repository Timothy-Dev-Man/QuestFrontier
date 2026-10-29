# QuestFrontier

![QuestFrontier banner](frontend/assets/cover.png)

QuestFrontier is a gamified quest-tracking app for turning personal goals into quests. Complete quests to build progress, earn rewards, and keep a streak going.

The project contains an Expo React Native client and an Express API backed by PostgreSQL. The API also runs background workers for quest deadlines, rewards, and recurring quests, and streams live events to connected clients.

## Features

- Create quests, track progress, and view quest details
- Support for deadlines and recurring quests
- Earn experience and coins, and track levels, stats, and streaks
- Manage penalties and blocked-app rules
- Collect badges and browse the in-app shop
- Register, sign in, and reset passwords by email
- Receive live updates through server-sent events (SSE)

## Technology

- **Client:** React Native, Expo SDK 54, React Navigation
- **API:** Node.js, Express 5
- **Database:** PostgreSQL (`pg`)
- **Background work:** `pg-boss` and scheduled workers
- **Live updates:** Server-sent events

## Project Layout

```text
.
├── backend/
│   ├── DB/                 # PostgreSQL connection, schema migrations, and seed scripts
│   ├── src/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── routes/
│   │   └── services/
│   └── server.js
├── frontend/
│   ├── App.js
│   ├── app.json
│   └── src/
│       ├── 1_screens/
│       ├── 2_services/
│       ├── 3_components/
│       ├── 4_api/
│       └── Providers/
├── android/                # Android native project
└── ios/                    # iOS native project
```

## Requirements

- Node.js 20.19 or newer
- npm
- PostgreSQL
- Android Studio for Android builds, or Xcode on macOS for iOS builds

Expo Go can be used for development on supported devices. Native builds require the corresponding Android or iOS toolchain.

## Getting Started

### 1. Configure PostgreSQL and the API

Create a PostgreSQL database, then create `backend/.env`:

```dotenv
DATABASE_URL=postgresql://postgres:password@localhost:5432/questfrontier
JWT_SECRET=replace-with-a-long-random-secret
RESET_CODE_PEPPER=replace-with-a-separate-random-secret
PORT=4000

# Required only for password-reset emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM=no-reply@example.com
```

`DATABASE_URL` and `JWT_SECRET` are required for normal API operation. `PORT` defaults to `4000`. Configure all SMTP values and `RESET_CODE_PEPPER` to enable password reset; keep secrets out of version control.

Install backend dependencies, apply the schema, and start the API:

```bash
cd backend
npm install
node DB/migrate.js
npm run dev
```

The API is available at `http://localhost:4000`. A `GET /` request returns `API is running!`.

### 2. Configure and run the mobile client

Create `frontend/.env` and set the API base URL:

```dotenv
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000
```

Install dependencies and start Expo:

```bash
cd frontend
npm install
npm start
```

Use the Expo terminal shortcuts or run a platform script directly:

```bash
npm run android
npm run ios
npm run web
```

The API URL must be reachable from the device running the app. For a physical phone, replace `localhost` with your development computer's LAN IP address and ensure both devices can reach each other. Android emulators commonly reach the host computer at `10.0.2.2` instead of `localhost`.

## Database Seeds

After applying migrations, optional seed scripts are available from `backend/`:

```bash
npm run seed:shop
npm run seed:badges
npm run seed:badge-items
npm run seed:user-badge-inventory
```

## API Overview

The API listens on port `4000` by default. Routes are mounted under:

| Path | Purpose |
| --- | --- |
| `/auth` | Registration, login, logout, and password reset |
| `/quests` | Quest management and progress |
| `/penalties` | Penalty and blocked-app data |
| `/users` | User profile and stats |
| `/badges` | Badge data |
| `/shop` | Shop and inventory |
| `/events` | Authenticated server-sent event stream |

Authenticated requests use bearer tokens. The `/events` endpoint also requires authentication.

## Development Notes

- Run client commands from `frontend/` and API commands from `backend/`.
- The backend starts its deadline, reward, and recurring-quest workers with the server.
- The API's PostgreSQL connection uses the `DATABASE_URL` environment variable.
- There are no test scripts currently defined in the package manifests.
