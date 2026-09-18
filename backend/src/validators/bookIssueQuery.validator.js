import Joi from "joi";

export const bookIssueQuerySchema = Joi.object({

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

    bookId: Joi.number()
        .integer()
        .positive()
        .optional(),

    status: Joi.string()
        .valid(
            "Issued",
            "Returned"
        )
        .optional(),

    search: Joi.string()
        .trim()
        .max(100)
        .optional(),

    sortBy: Joi.string()
        .valid(
            "id",
            "issueDate",
            "dueDate",
            "returnDate",
            "status"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});