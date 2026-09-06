import Joi from "joi";

export const createBookIssueSchema = Joi.object({
    bookId: Joi.number()
        .integer()
        .positive()
        .required(),

    studentId: Joi.number()
        .integer()
        .positive()
        .required(),

    dueDate: Joi.date()
        .required()
});