import Joi from "joi";

export const examQuerySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    courseId: Joi.number()
        .integer()
        .positive()
        .optional(),

    search: Joi.string()
        .trim()
        .max(100)
        .optional(),

    sortBy: Joi.string()
        .valid(
            "examName",
            "examDate",
            "courseName"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});