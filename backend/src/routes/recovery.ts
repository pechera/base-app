import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router: Router = Router();

import redisClient from '../config/redis.config.js';

redisClient.connect().then(() => {
    console.log('redis connected');
});

// DATABASE SCHEMAS
import User from '../models/User.model.js';

// VALIDATION
import { passwordSchema } from '../models/Validation.model.js';

// SERVICES
import sendEmail from '../services/sendEmail.service.js';

router.post('/recovery', async (req: Request, res: Response) => {
    const { email }: { email: string } = req.body;

    try {
        const user = await User.findOne({ email });

        console.log(user);

        if (!user || !user.activated) {
            throw new Error('User not found');
        }

        if (user.register_method) {
            throw new Error('Seems like you use Google for sing up');
        }

        const link = uuidv4();

        await redisClient.set(link, user.id, { EX: 1800 }); // EX - key lifetime in seconds 1800

        const html = `<div><a href="http:/localhost:3000/recovery/${link}">Reset password</a></div>`;
        sendEmail(email, 'Reset password', html);

        return res.json({ message: 'Link sent to your email' });
    } catch (error: any) {
        console.log(error);
        return res.json({ error: error.message });
    }
});

router.post('/password/is', async (req: Request, res: Response) => {
    const { link }: { link: string } = req.body;
    try {
        const id = await redisClient.get(link);

        if (!id) {
            return res.json({ link: false });
        }

        return res.json({ link: true });
    } catch (error: any) {
        console.log(error);
        return res.json({ error: error.message });
    }
});

router.post('/password', async (req: Request, res: Response) => {
    const { link, password }: { link: string; password: string } = req.body;

    try {
        await passwordSchema.validateAsync({
            password,
        });

        const id = await redisClient.get(link);

        if (!id) {
            return res.json({ error: 'Link not found or expiered' });
        }

        const user = await User.findOne({ id });

        if (!user) {
            return res.json({ error: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        await user.save();

        await redisClient.del(link);

        return res.status(200).json({ message: 'Password changes' });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
