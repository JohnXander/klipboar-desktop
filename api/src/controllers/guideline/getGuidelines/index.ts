import { Request, Response } from 'express';
import status from 'http-status';
import Organisation from '../../../models/organisations';
import Guideline from '../../../models/guidelines';

export const getAllGuidelines = async (request: Request, response: Response) => {
  try {
    if (!request.params.orgId) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Organisation ID is required.' });
    }

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
        .json({ error: 'You must be logged in to create an assignment.' });
    }
    
    const guidelines = await Guideline.find({
      organisation: orgId,
      isDeleted: false
    }).sort({ createdAt: -1 });

    if (guidelines.length === 0) {
      return response
        .status(status.NO_CONTENT)
        .json({ message: 'No guidelines found.' })
    }

    return response
      .status(status.OK)
      .json(guidelines);
  } catch (error) {
    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
