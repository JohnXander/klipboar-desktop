import { Request, Response } from 'express';
import status from 'http-status';
import Organisation from '../../../models/organisations';
import { User } from '../../../models/user/user.types';

export const getAllOrganisations = async (request: Request, response: Response) => {
  try {
    const organisations = await Organisation.find();
    const userEmail = (request.user as User).email;

    if (organisations.length === 0) {
      return response
        .status(status.OK)
        .json({
          allOrganisations: [],
          userOrganisations: [],
        });
    }

    if (!userEmail) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You are not authorized to view this resource.' });
    }

     const userOrganisations = organisations.filter(org =>
      org.members.some(member => member.user === userEmail)
    );

    return response
      .status(status.OK)
      .json({
        allOrganisations: organisations,
        userOrganisations: userOrganisations,
      });
  } catch (error) {
    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
