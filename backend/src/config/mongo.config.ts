import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../env/.env') });

const connectionMongo = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DATABASE as string);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectionMongo;
