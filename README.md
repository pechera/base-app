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
✅ Profile page where users can change account info\
⬜️ Email service via Amazon SES (now it's test SMTP)

Stack: Typescript, React, Vite, React Router, React Query, Zustand, Express, MongoDB, Redis, Nodemailer\
Styles: Bootstrap

## Screenshots

![login page](https://raw.githubusercontent.com/pechera/base-app/master/login.png)\
Login page

![dashboard page](https://raw.githubusercontent.com/pechera/base-app/master/dashboard.png)\
Dashboard page

## Environment Variables

To run this project, you will need to add the following environment variables to your env/.env file

Backend:\
`CLIENT_URL` Client URL
\
`PORT` Server port (default 4000)
\
`DATABASE` MongoDB connection string\
\
`TOKEN_SECRET` JWT Tokent secret phrase\
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
  cd frontend && yarn vite
```
