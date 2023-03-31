import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/data.js';

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        lenght: 36,
        index: { unique: true },
    },
    name: { type: String, required: true, min: 3, max: 255 },
    register_date: { type: Date, required: true, default: Date.now },
    password: { type: String, min: 5, max: 255 },
    email: { type: String, required: true, min: 6, max: 255 },
    activated: { type: Boolean, default: false },
    activation_link: { type: String, lenght: 64 },
    register_method: { type: String },
});

// type User = InferSchemaType<typeof schema>;

export default mongoose.model<IUser>('User', userSchema);
