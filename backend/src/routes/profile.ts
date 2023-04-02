import { Router, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router: Router = Router();

// MIDDLEWARES
import auth from '../middlewares/auth.middleware.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

router.get('/profile', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;

    try {
        const { id } = jwt.decode(accessToken.split(' ')[1]) as JwtPayload;

        const user = await User.findOne({ id });

        if (!user)
            return res.sendStatus(500).json({ message: 'User not found' });

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
        const isPasswordCorrect: boolean = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect)
            return res.status(400).json({ message: 'Wrong password' });

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

export default router;
