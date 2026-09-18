import Joi from "joi";

export const attendanceQuerySchema = Joi.object({

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
        .valid("Present", "Absent")
        .optional(),

    sortBy: Joi.string()
        .valid(
            "attendanceDate",
            "status",
            "id"
        )
        .optional(),

    order: Joi.string()
        .valid("ASC", "DESC")
        .insensitive()
        .optional()

});