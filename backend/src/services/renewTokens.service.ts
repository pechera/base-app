import jwt from 'jsonwebtoken';

type Tokens = {
    newAccessToken: string;
    newRefreshToken: string;
};

const renewTokens = (id: string): Tokens => {
    // Create Access token
    const newAccessToken: string = jwt.sign({ id }, process.env.TOKEN_SECRET!, {
        expiresIn: '2h',
    });

    // Create Refresh token
    const newRefreshToken: string = jwt.sign(
        { id },
        process.env.TOKEN_SECRET!,
        {
            expiresIn: '24h',
        }
    );

    const tokens: Tokens = { newAccessToken, newRefreshToken };

    return tokens;
};

export default renewTokens;
