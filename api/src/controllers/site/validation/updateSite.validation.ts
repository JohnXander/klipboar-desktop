import Joi from 'joi';

export const updateSiteParamValidation = Joi.object({
  orgId: Joi
    .string()
    .required(),
  siteId: Joi
    .string()
    .required()
    .length(24)
    .alphanum()
    .hex()
});
