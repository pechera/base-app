import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router: Router = Router();

// MIDDLEWARES
import auth from '../middlewares/auth.middleware.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

router.get('/profile', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;

    try {
        const { id }: { id: string } = jwt.decode(
            accessToken.split(' ')[1]
        ) as {
            id: string;
        };

        const user = await User.findOne({ id });

        if (user) {
            return res.status(200).json({
                name: user.name,
                email: user.email,
                activated: user.activated,
            });
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/profile/password', auth, async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!;
    const { password }: { password: string } = req.body;

    try {
        const { id }: { id: string } = jwt.decode(
            accessToken.split(' ')[1]
        ) as {
            id: string;
        };

        const user = await User.findOne({ id });

        if (!user) return res.status(500).json({ message: 'User not found' });

        // Hashing the password
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

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
