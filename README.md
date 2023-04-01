# MVP base app with Typescript + React + NodeJS

Basic setup app template on MERN stack for your MVP. In this project implemeting:

✅ Autentification with JWT access and refresh tokens\
✅ Autentification via Google OAuth\
✅ Registration\
✅ Email activation\
✅ Logout\
✅ Password recovery function\
✅ Private routes\
✅ Form validation on frontend and backend both\
✅ State manager for saving user info around the app\
✅ React Hot Toasts notifications\
⬜️ Integrate React Query\
⬜️ Skeleton loaders\
⬜️ Email service via Amazon SES (now it's test SMTP)\
⬜️ Profile page where users can change account info

Stack: Typescript, React, Vite, React Router, Zustand, Express, MongoDB, Redis, Nodemailer\
Styles: Bootstrap

## Environment Variables

To run this project, you will need to add the following environment variables to your env/.env file

Backend:\
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

Frontend:\
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
  yarn install
```

Start project locally

```bash
  cd backend && npm run dev
  cd .. && cd frontend && yarn vite
```
