# DevQuest Backend

Node.js + Express + MongoDB backend for DevQuest.

## Installation

```bash
cd backend
npm install
```

## Run

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

Server runs on: http://localhost:5000
