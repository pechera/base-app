import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

const connectionRedis = async (): Promise<void> => {
    try {
        await redisClient.connect();
        console.log('Redis connected');
    } catch (error: any) {
        console.log('Redis', error);
    }
};

export { redisClient, connectionRedis };
