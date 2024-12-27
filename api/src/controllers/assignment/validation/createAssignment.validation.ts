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

export const createAssignmentDataValidation = Joi.object({
  title: Joi
    .string()
    .required(),
  description: Joi
    .string()
    .required(),
  guideline: Joi
    .string()
    .required(),
  wordCount: Joi
    .number()
    .required(),
  submittedTo: Joi
    .string()
    .required(),
  submission: Joi
    .array()
    .items(submissionItemSchema)
    .required()
});
