import { Router, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const router: Router = Router();

// SERVICES
import renewTokens from '../services/renewTokens.service.js';

router.post('/token', (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401);
    }

    try {
        const { id, exp } = jwt.decode(refreshToken) as JwtPayload;

        const refreshExp = exp!;

        const isRefreshExpired: boolean = Date.now() >= refreshExp * 1000;

        if (isRefreshExpired) {
            console.log('refresh token expired');
            return res.sendStatus(401);
        }

        const { newAccessToken, newRefreshToken } = renewTokens(id);

        console.log('sent new tokens');

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
