import Joi from "joi";

export const createExamSchema = Joi.object({
    examName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    examDate: Joi.date()
        .required(),

    maxMarks: Joi.number()
        .positive()
        .required(),

    courseId: Joi.number()
        .integer()
        .positive()
        .required()
});

export const updateExamSchema = Joi.object({
    examName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    examDate: Joi.date()
        .required(),

    maxMarks: Joi.number()
        .positive()
        .required(),

    courseId: Joi.number()
        .integer()
        .positive()
        .required()
});