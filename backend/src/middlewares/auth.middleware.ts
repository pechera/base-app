import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type AuthData = {
    exp: number;
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (accessToken == null) return res.sendStatus(401);

    try {
        const { exp }: AuthData = jwt.decode(
            accessToken.split(' ')[1]
        ) as AuthData;

        const accessExp = exp;

        const isAccessExpired: boolean = Date.now() >= accessExp * 1000;

        if (isAccessExpired) {
            console.log('Access Token expired');
            return res.status(401).json({ error: 'Access Token is expired' });
        }

        return next();
    } catch (error: any) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

export default auth;
