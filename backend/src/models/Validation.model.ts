import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(3).max(255).required(),
});

export const registerSchema = Joi.object({
    id: Joi.string().min(36).required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(5).required(),
});

export const passwordSchema = Joi.object({
    password: Joi.string().min(3).required(),
});

export const googleAuthSchema = Joi.object({
    id: Joi.string().min(36).required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).email().required(),
    activated: Joi.boolean().required(),
});
