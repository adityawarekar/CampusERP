import Joi from 'joi';

export const createResultSchema = Joi.object({
    studentId : Joi.number()
        .integer()
        .positive()
        .required(),

    examId: Joi.number()
        .integer()
        .positive()
        .required(),
        
    marksObtained: Joi.number()
         .min(0)
         .required()
});

export const updateResultSchema = Joi.object({
    marksObtained: Joi.number()
         .min(0)
         .required()
});