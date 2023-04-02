import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectionMongo from './config/mongo.config.js';
import { connectionRedis } from './config/redis.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, 'env/.env') });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Temporary solution for Nodemailer

(async () => {
    // Connect to MongoDB
    await connectionMongo();

    // Connect to Redis
    await connectionRedis();
})();

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// ROUTES
import loginRoute from './routes/login.js';
import registerRoute from './routes/registration.js';
import dashboardRoute from './routes/dashboard.js';
import tokenRoute from './routes/token.js';
import emailRoute from './routes/email.js';
import recoveryRoute from './routes/recovery.js';
import profileRoute from './routes/profile.js';

app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', dashboardRoute);
app.use('/api', profileRoute);
app.use('/api', tokenRoute);
app.use('/api', emailRoute);
app.use('/api', recoveryRoute);

const port: string = process.env.PORT! || '4000';

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

server.on('close', (error: Error | undefined) => {
    mongoose.connection.close();
    process.exit(error ? 1 : 0);
});
