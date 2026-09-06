import Joi from "joi";

export const createRoomSchema = Joi.object({
    hostelId: Joi.number()
        .integer()
        .positive()
        .required(),

    roomNumber: Joi.string()
        .trim()
        .min(1)
        .max(20)
        .required(),

    capacity: Joi.number()
        .integer()
        .positive()
        .required()
});

export const updateRoomSchema = Joi.object({
    roomNumber: Joi.string()
        .trim()
        .min(1)
        .max(20)
        .required(),

    capacity: Joi.number()
        .integer()
        .positive()
        .required()
});