import Joi from 'joi';
import { Role } from '../../../lib/enums/role.enum';

export const createUserDataValidation = Joi.object({
  name: Joi
    .string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 5 characters long.',
      'string.max': 'Name cannot exceed 30 characters.',
      'any.required': 'Name is required.',
    }),
  
  email: Joi
    .string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a valid email address.',
      'string.empty': 'Email is required.',
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),

  password: Joi
    .string()
    .min(8)
    .max(20)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[\W_]/)
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 20 characters.',
      'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),

  role: Joi
    .string()
    .valid(Role.TEACHER, Role.STUDENT)
    .required()
    .messages({
      'string.base': 'Role must be a valid string.',
      'string.empty': 'Role is required.',
      'any.only': 'Role must be one of the following: Teacher, Student.',
      'any.required': 'Role is required.',
    }),
});
