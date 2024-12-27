import Joi from 'joi';

export const updateGuidelineDataValidation = Joi.object({
  name: Joi
    .string()
    .optional(),
  description: Joi
    .string()
    .optional(),
  wordLimit: Joi
    .number()
    .integer()
    .min(100)
    .max(10000)
    .optional()
    .messages({
      'number.base': 'Word limit must be a number.',
      'number.integer': 'Word limit must be an integer.',
      'number.min': 'Word limit must be at least 100.',
      'number.max': 'Word limit must be less than 10000.',
    }),
  dueDate: Joi
    .date()
    .greater('now')
    .optional()
    .messages({
      'date.base': 'Due date must be a date.',
      'date.greater': 'Due date must be in the future.',
    }),
  isDeleted: Joi
    .boolean()
    .optional(),
});
