import Joi from "joi";

export const createBookSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required(),

    author: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    isbn: Joi.string()
        .trim()
        .max(20)
        .optional(),

    totalCopies: Joi.number()
        .integer()
        .positive()
        .required()
});

export const updateBookSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required(),

    author: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    isbn: Joi.string()
        .trim()
        .max(20)
        .optional(),

    totalCopies: Joi.number()
        .integer()
        .positive()
        .required()
});