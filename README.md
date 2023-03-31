# MVP base app on React + NodeJS + Typescript

Basic setup on MERN stack for your MVP. In this project implemets:

✅ Autentification with JWT access and refresh tokens\
✅ Autentification via Google OAuth\
✅ Registration\
✅ Logout\
✅ Email activation\
✅ Password recovery function\
✅ Private routes\
⬜️ Form validation on frontend and backend both
⬜️ Email service via Amazon SES (now it's local SMTP)\
⬜️ Profile page where users can change account info
⬜️ State manager for saving user info around the app

Stack: Typescript, React, React Router, NodeJS, Express, MongoDB, Redis, Nodemailer\
Styles: Bootstrap

## Environment Variables

To run this project, you will need to add the following environment variables to your env/.env file

Backend:
`PORT`\
`DATABASE` // MongoDB connection string\
\
`CLIENT_URL`\
\
`TOKEN_SECRET` // JWT Tokent secret phrase\
\
NODEMAILER\
`MAIL_HOST`\
`MAIL_USER`\
`MAIL_PASS`\
`MAIL_PORT`\
\
REDIS\
`REDIS_PASS`\
`REDIS_HOST`\
`REDIS_PORT`\
\
GOOGLE AUTH\
`GOOGLE_CLIENT_ID`

Frontend:
Create .env.development file for dev or .env for prod version

SERVER URL\
`VITE_SERVE_URL`

GOOGLE AUTH\
`VITE_GOOGLE_CLIENT_ID`

## Run Locally

Clone the project

```bash
  git clone https://github.com/pechera/base-app.git
```

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start project locally

```bash
  cd backend && npm run dev
  cd .. && cd frontend && npm start
```
