import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router: Router = Router();

// SERVICES
import renewTokens from '../services/renewTokens.service.js';

router.post('/token', (req: Request, res: Response) => {
    const { refreshToken }: { refreshToken: string } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is empty' });
    }

    console.log('start generate new token');

    try {
        const { id, exp }: { id: string; exp: number } = jwt.decode(
            refreshToken
        ) as { id: string; exp: number };

        const refreshExp = exp;

        const isRefreshExpired: boolean = Date.now() >= refreshExp * 1000;

        if (isRefreshExpired) {
            return res.sendStatus(401);
        }

        const { newAccessToken, newRefreshToken } = renewTokens(id);

        return res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(401).json({ error: 'Refresh token error' });
    }
});

export default router;
