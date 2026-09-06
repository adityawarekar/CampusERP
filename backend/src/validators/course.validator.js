import Joi from "joi";

export const createCourseSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    code: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .uppercase()
        .required(),

    credits: Joi.number()
        .integer()
        .positive()
        .required()
});

export const updateCourseSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    code: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .uppercase()
        .required(),

    credits: Joi.number()
        .integer()
        .positive()
        .required()
});