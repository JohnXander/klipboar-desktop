import Joi from 'joi';

export const createOrganisationDataValidation = Joi.object({
  name: Joi
    .string()
    .required(),
});
