import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router: Router = Router();

// MIDDLEWARES
import auth from '../middlewares/auth.middleware.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

router.get('/dashboard', auth, async (req: Request, res: Response) => {
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
                id: user.id,
                name: user.name,
                email: user.email,
            });
        }
    } catch (error: any) {
        console.log(error);
        res.sendStatus(500);
    }
});

export default router;
