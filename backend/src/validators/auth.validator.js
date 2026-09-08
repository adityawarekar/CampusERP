import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required(),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required(),

    password: Joi.string()
        .required()
});