import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Organisation from '../../../models/organisations';
import Guideline from '../../../models/guidelines';
import { User } from '../../assignment/assignment.types';
import { updateGuidelineDataValidation } from '../validation/updateGuideline.validation';

export const updateGuideline = async (request: Request, response: Response) => {
  try {
    await updateGuidelineDataValidation.validateAsync(request.body);

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to create a guideline.' });
    }

    const { orgId, guidelineId } = request.params;

    if (!orgId || !guidelineId) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Organisation ID and Guideline ID are required.' });
    }
    
    const { email } = request.user as User;

    const organisationData = await Organisation.findById(orgId);

    if (!organisationData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    const isMember = organisationData.members.some(
      (member: { user: string }) => member.user === email
    );

    if (!isMember) {
      return response
        .status(status.FORBIDDEN)
        .json({ error: 'You are not a member of this organisation.' });
    }

    const currentGuideline = await Guideline.findById(guidelineId);

    if (!currentGuideline) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Guideline not found.' });
    }

    const updatedGuideline = await Guideline.findByIdAndUpdate(
      guidelineId,
      request.body,
      { new: true }
    );

    return response
      .status(status.OK)
      .json(updatedGuideline);
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
