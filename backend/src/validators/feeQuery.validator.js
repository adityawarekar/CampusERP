import Joi from "joi";

export const feeQuerySchema = Joi.object({

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

    status: Joi.string()
        .valid(
            "Pending",
            "Partial",
            "Paid"
        )
        .optional(),

    sortBy: Joi.string()
        .valid(
            "id",
            "totalAmount",
            "amountPaid",
            "dueDate",
            "status"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});