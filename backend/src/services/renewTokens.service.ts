import jwt from 'jsonwebtoken';

type Tokens = {
    newAccessToken: string;
    newRefreshToken: string;
};

const renewTokens = (id: string): Tokens => {
    // Create Access token
    const newAccessToken: string = jwt.sign({ id }, process.env.TOKEN_SECRET!, {
        expiresIn: '1m', // 2h
    });

    // Create Refresh token
    const newRefreshToken: string = jwt.sign(
        { id },
        process.env.TOKEN_SECRET!,
        {
            expiresIn: '2m', //24h
        }
    );

    return { newAccessToken, newRefreshToken };
};

export default renewTokens;
