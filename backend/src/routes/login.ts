import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router: Router = Router();

// VALIDATION
import { loginSchema } from '../models/Validation.model.js';
import { googleAuthSchema } from '../models/Validation.model.js';

// DATABASE SCHEMAS
import User from '../models/User.model.js';

// SERVICES
import renewTokens from '../services/renewTokens.service.js';

// TYPES
type LoginData = {
    email: string;
    password: string;
};

router.post('/login', async (req: Request, res: Response) => {
    const { email, password }: LoginData = req.body;

    try {
        await loginSchema.validateAsync({ email, password });

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            throw new Error('Incorrect password');
        }

        const { newAccessToken, newRefreshToken } = renewTokens(user.id);

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            username: user.name,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

router.post('/login/google', async (req: Request, res: Response) => {
    const { client_id, credential } = req.body;

    try {
        // Call the verifyIdToken to varify and decode it
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });

        // Get the JSON with all the user info
        const payload = ticket.getPayload();

        // This is a JSON object that contains all the user info
        const { name, email, email_verified } = payload!;

        const user = await User.findOne({ email });

        if (!user) {
            const id: string = uuidv4();

            await googleAuthSchema.validateAsync({
                id,
                name,
                email,
                activated: email_verified,
            });

            // Create a new user record in the database
            const newUser = new User({
                id,
                name,
                email,
                // password: hashedPassword,
                activated: email_verified,
                // activation_link: null,
                register_method: 'google',
            });

            await newUser.save();

            const { newAccessToken, newRefreshToken } = renewTokens(id);

            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                username: name,
            });
        }

        const { newAccessToken, newRefreshToken } = renewTokens(user.id);

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            username: name,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
