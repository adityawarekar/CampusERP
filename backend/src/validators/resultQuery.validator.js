import Joi from "joi";

export const resultQuerySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    studentId: Joi.number()
        .integer()
        .positive()
        .optional(),

    examId: Joi.number()
        .integer()
        .positive()
        .optional(),

    sortBy: Joi.string()
        .valid(
            "marks",
            "grade",
            "studentName",
            "examName"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});