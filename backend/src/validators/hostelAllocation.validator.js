import Joi from "joi";

export const createHostelAllocationSchema = Joi.object({
    studentId: Joi.number()
        .integer()
        .positive()
        .required(),

    roomId: Joi.number()
        .integer()
        .positive()
        .required(),

    bedNumber: Joi.number()
        .integer()
        .positive()
        .required()
});