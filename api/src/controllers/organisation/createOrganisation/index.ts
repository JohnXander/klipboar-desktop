import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Organisation from '../../../models/organisations';
import { createOrganisationDataValidation } from '../validation/createOrganisation.validation';
import User from '../../../models/user';
import { User as UserType } from '../../assignment/assignment.types';

export const createOrganisation = async (request: Request, response: Response) => {
  try {
    await createOrganisationDataValidation.validateAsync(request.body);

    const { name } = request.body;

    const { _id: userId } = request.user as UserType;

    const user = await User.findById(userId);
    
    if (!user) {
      return response
      .status(status.NOT_FOUND)
      .json({ error: 'Owner not found.' });
    }

    const organisationData = {
      name,
      owner: userId,
      members: [
        {
          user: user.email,
          role: 'owner',
        },
      ],
      logoUrl: '',
    };

    await Organisation.create(organisationData);

    return response
      .status(status.CREATED)
      .json(organisationData);
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
