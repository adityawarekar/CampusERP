import Joi from "joi";

export const createFeeSchema = Joi.object({
    studentId: Joi.number()
        .integer()
        .positive()
        .required(),

    totalAmount: Joi.number()
        .min(0)
        .required(),

    dueDate: Joi.date()
        .required()
});

export const createPaymentSchema = Joi.object({
    amount: Joi.number()
        .greater(0)
        .required(),

    paymentMethod: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
});

export const updateFeeSchema = Joi.object({
    totalAmount: Joi.number()
        .min(0)
        .required(),

    dueDate: Joi.date()
        .required()
});