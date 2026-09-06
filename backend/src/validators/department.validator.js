import Joi from "joi";

export const createDepartmentSchema = Joi.object({
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
        .required()
});

export const updateDepartmentSchema = Joi.object({
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
        .required()
});