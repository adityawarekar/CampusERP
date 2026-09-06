import Joi from "joi";

export const createHostelSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    location: Joi.string()
        .trim()
        .max(200)
        .optional(),

    totalRooms: Joi.number()
        .integer()
        .positive()
        .required()
});

export const updateHostelSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    location: Joi.string()
        .trim()
        .max(200)
        .optional(),

    totalRooms: Joi.number()
        .integer()
        .positive()
        .required()
});