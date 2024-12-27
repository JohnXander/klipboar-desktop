import Joi from 'joi';

const submissionItemSchema = Joi.object({
  value: Joi
    .string()
    .required(),
  copiedAt: Joi
    .string()
    .allow(null)
    .required(),
  copiedFrom: Joi
    .string()
    .allow(null)
    .uri()
    .required(),
});

export const updateAssignmentDataValidation = Joi.object({
  title: Joi
    .string()
    .optional(),
  description: Joi
    .string()
    .optional(),
  wordCount: Joi
    .number()
    .optional(),
  isSubmitted: Joi
    .boolean()
    .default(false)
    .optional(),
  submittedAt: Joi
    .date()
    .allow(null)
    .default(null)
    .optional(),
  submission: Joi
    .array()
    .items(submissionItemSchema)
    .required()
    .optional(),
  isDeleted: Joi
    .boolean()
    .optional(),
});
