import Joi from "joi";

export const courseQuerySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    search: Joi.string()
        .trim()
        .max(100)
        .optional(),

    sortBy: Joi.string()
        .valid(
            "name",
            "code"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});