import Joi from "joi";

export const createEnrollmentSchema = Joi.object({
    studentId: Joi.number()
        .integer()
        .positive()
        .required(),

    courseId: Joi.number()
        .integer()
        .positive()
        .required()
});