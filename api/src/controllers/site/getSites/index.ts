import { Request, Response } from 'express';
import status from 'http-status';
import Site from '../../../models/sites';
import Organisation from '../../../models/organisations';
import { User } from '../../assignment/assignment.types';

export const getAllSites = async (request: Request, response: Response) => {
  try {
    const { orgId } = request.params;
    const organisationData = await Organisation.findById(orgId);

    if (!organisationData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to view sites.' });
    }

    const { _id: userId } = request.user as User;

    const sites = await Site.find({ organisation: orgId, owner: userId });

    if (sites.length === 0) {
      return response
        .status(status.NO_CONTENT)
        .json({ message: 'No sites found.' })
    }

    return response
      .status(status.OK)
      .json(sites);
  } catch (error) {
    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
