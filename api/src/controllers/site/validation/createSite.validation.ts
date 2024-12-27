import Joi from 'joi';

export const createSiteDataValidation = Joi.object({
  url: Joi
    .string()
    .uri()
    .required(),
  launchCount: Joi
    .number()
    .integer()
    .min(1)
    .required(),
});
