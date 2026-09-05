import Joi from "joi";

export const createStudentSchema = Joi.object({
    rollNumber: Joi.number()
        .integer()
        .positive()
        .required(),

    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),
        
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),
      
    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required(),
     
    phoneNumber: Joi.string()
         .trim()
         .pattern(/^[0-9]{10}$/)
         .required(),

    departmentId: Joi.number()
         .integer()
         .positive()
         .required()     
}); 

export const updateStudentSchema = Joi.object({
    rollNumber: Joi.number()
        .integer()
        .positive()
        .required(),

    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required(),

    phoneNumber: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .required(),

    departmentId: Joi.number()
        .integer()
        .positive()
        .required()
});