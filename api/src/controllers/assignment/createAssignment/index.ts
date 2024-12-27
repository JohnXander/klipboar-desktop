import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Assignment from '../../../models/assignments';
import { createAssignmentDataValidation } from '../validation/createAssignment.validation';
import Organisation from '../../../models/organisations';
import { User } from '../assignment.types';

export const createAssignment = async (request: Request, response: Response) => {
  try {
    await createAssignmentDataValidation.validateAsync(request.body);

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to create an assignment.' });
    }

    if (!request.params.orgId) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Organisation ID is required.' });
    }
    
    const { email, _id: userId } = request.user as User;
    const { orgId } = request.params;

    const {
      title,
      description,
      guideline,
      wordCount,
      submittedTo,
      submission,
    } = request.body;

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

    const assignmentData = {
      title,
      description,
      guideline,
      wordCount,
      submittedBy: userId,
      submittedTo,
      organisation: orgId,
      isSubmitted: false,
      submittedAt: null,
      submission,
      isDeleted: false,
    };

    await Assignment.create(assignmentData);

    return response
      .status(status.CREATED)
      .json(assignmentData);
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
