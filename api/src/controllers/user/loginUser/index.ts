import { Request, Response } from 'express';
import User from '../../../models/user';
import status from 'http-status';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
dotenv.config();

const { JWT_SECRET } = process.env;

export const loginUser = async (request: Request, response: Response) => {
  try {
    const {
      email,
      password
    } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Invalid credentials' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(
      payload, 
      JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    return response
      .status(status.OK)
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
