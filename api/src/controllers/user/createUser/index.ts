import { Request, Response } from 'express';
import User from '../../../models/user';
import status from 'http-status';
import { createUserDataValidation } from '../validation/createUser.validation';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET } = process.env;

export const createUser = async (request: Request, response: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = await createUserDataValidation.validateAsync(request.body);

    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'A user with that email already exists' });
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    const user = await User.create(userData);

    const payload = { id: user.id };
    const token = jwt.sign(
      payload, 
      JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    return response
      .status(status.CREATED)
      .json({ token, userRole: user.role });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: error.details[0].message });
    }

    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
