import Joi from 'joi';

export const createGuidelineDataValidation = Joi.object({
  name: Joi
    .string()
    .required(),
  description: Joi
    .string()
    .required(),
  wordLimit: Joi
    .number()
    .integer()
    .min(1)
    .required(),
  dueDate: Joi
    .date()
    .required(),
});
