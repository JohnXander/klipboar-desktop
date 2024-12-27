import Joi from 'joi';
import { ModifyUserInOrganisationAction } from '../../../lib/enums/modifyUserInOrganisationAction.enum';

export const modifyUserInOrganisationValidation = Joi.object({
  params: Joi.object({
    orgId: Joi
      .string()
      .required()
      .length(24)
      .alphanum()
      .hex()
      .messages({
        'string.base': 'Organisation ID must be a string.',
        'string.empty': 'Organisation ID is required.',
        'string.length': 'Organisation ID must be exactly 24 characters long.',
        'string.alphanum': 'Organisation ID must only contain alphanumeric characters.',
        'string.hex': 'Organisation ID must be a valid hexadecimal string.',
      }),
  }),
  query: Joi.object({
    action: Joi
      .string()
      .required()
      .valid(ModifyUserInOrganisationAction.ADD, ModifyUserInOrganisationAction.REMOVE, ModifyUserInOrganisationAction.LEAVE)
      .messages({
        'string.base': 'Action must be a string.',
        'string.empty': 'Action is required.',
        'any.only': 'Action must be one of the following: ADD, REMOVE, or LEAVE.',
      }),
  }),
  body: Joi.object({
    email: Joi
      .string()
      .optional()
      .email()
      .messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
      }),
  }),
});
