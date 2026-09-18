import Joi from "joi";

export const enrollmentQuerySchema = Joi.object({

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

    courseId: Joi.number()
        .integer()
        .positive()
        .optional(),

    sortBy: Joi.string()
        .valid(
            "enrolledAt",
            "id"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});