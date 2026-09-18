import Joi from "joi";

export const hostelAllocationQuerySchema = Joi.object({

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

    roomId: Joi.number()
        .integer()
        .positive()
        .optional(),

    status: Joi.string()
        .valid(
            "Active",
            "Vacated"
        )
        .optional(),

    search: Joi.string()
        .trim()
        .max(100)
        .optional(),

    sortBy: Joi.string()
        .valid(
            "id",
            "allocationDate",
            "status",
            "studentName"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});