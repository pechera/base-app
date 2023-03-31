import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const router: Router = Router();

// VALIDATION
import { registerSchema } from '../models/Validation.model.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

// SERVICES
import renewTokens from '../services/renewTokens.service.js';

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

router.post('/registration', async (req: Request, res: Response) => {
    const { name, email, password }: RegisterData = req.body;

    try {
        // id пользователя
        const id: string = uuidv4();

        await registerSchema.validateAsync({
            id,
            name,
            email,
            password,
        });

        // Check that the user with the same email does not exist
        const user = await User.findOne({ email });

        if (user) {
            throw new Error('User already exists');
        }

        // Hashing the password
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        // Email activation link
        const link: string = uuidv4();
        // const html = `<div><a href="google.com/mail/${link}">Activate email</a></div>`;
        // sendMail(email, 'Email verification', html);

        const newUser = new User({
            id,
            name,
            email,
            password: hashedPassword,
            activation_link: link,
        });

        await newUser.save();

        const { newAccessToken, newRefreshToken } = renewTokens(id);

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
