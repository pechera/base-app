import { Router, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router: Router = Router();

import { redisClient } from '../config/redis.config.js';

// MIDDLEWARES
import auth from '../middlewares/auth.middleware.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

// SERVICES
import sendEmail from '../services/sendEmail.service.js';

router.get('/profile', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;

    try {
        const { id } = jwt.decode(accessToken.split(' ')[1]) as JwtPayload;

        const user = await User.findOne({ id });

        if (!user) return res.sendStatus(500).json({ message: 'User not found' });

        return res.status(200).json({
            name: user.name,
            email: user.email,
            activated: user.activated,
            register_method: user.register_method,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

interface IPasswordsToSend {
    currentPassword: string;
    newPassword: string;
}

router.post('/profile/password', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;
    const { currentPassword, newPassword }: IPasswordsToSend = req.body;

    try {
        const { id } = jwt.decode(accessToken.split(' ')[1]) as JwtPayload;

        const user = await User.findOne({ id });

        if (!user) return res.status(500).json({ message: 'User not found' });

        // Checking if the current password is correct
        const isPasswordCorrect: boolean = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: 'Wrong password' });

        // Hashing the password
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: 'Password changed',
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/profile/email', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;
    const { email }: { email: string } = req.body;

    try {
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Checking if the email is already in use
        const userWithEmail = await User.findOne({ email });

        if (userWithEmail) return res.status(400).json({ message: 'Email already in use' });

        const { id } = jwt.decode(accessToken.split(' ')[1]) as JwtPayload;

        const user = await User.findOne({ id });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const tempLink: string = uuidv4();

        await redisClient.set(tempLink, email, { EX: 1800 }); // EX - key lifetime in seconds 1800

        const html = `<div>
                        <a href="${process.env.CLIENT_URL}/confirm/${tempLink}">Change email</a>
                      </div>`;

        sendEmail(email, 'Change email', html);

        return res.status(200).json({
            message: 'Confirmation email sent',
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/profile/email/confirm', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;
    const { tempLink }: { tempLink: string; newEmail: string } = req.body;

    try {
        const { id } = jwt.decode(accessToken.split(' ')[1]) as JwtPayload;

        const user = await User.findOne({ id });

        if (!user) return res.status(500).json({ message: 'User not found' });

        const newEmail = await redisClient.get(tempLink);

        if (!newEmail) return res.status(400).json({ message: 'Link expired' });

        user.email = newEmail;

        await user.save();

        await redisClient.del(tempLink);

        return res.status(200).json({
            message: 'Email changed',
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
