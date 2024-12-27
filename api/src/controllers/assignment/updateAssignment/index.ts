import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Assignment from '../../../models/assignments';
import Organisation from '../../../models/organisations';
import { User } from '../assignment.types';
import { updateAssignmentDataValidation } from '../validation/updateAssignment.validation';
import { Role } from '../../../lib/enums/role.enum';

export const updateAssignment = async (request: Request, response: Response) => {
  try {
    await updateAssignmentDataValidation.validateAsync(request.body);

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to create an assignment.' });
    }

    const { orgId, assignmentId } = request.params;

    if (!orgId || !assignmentId) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Organisation ID and Assignment ID are required.' });
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

    const currentAssignment = await Assignment.findById(assignmentId);

    if (!currentAssignment) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Assignment not found.' });
    }

    const { role: userRole } = request.user as User;

    if ((userRole === Role.STUDENT && (currentAssignment.isSubmitted || currentAssignment.isDeleted)) ||
        (userRole === Role.TEACHER && currentAssignment.isDeleted)) {
      return response
        .status(status.FORBIDDEN)
        .json({ error: 'This assignment has been submitted or deleted and cannot be modified.' });
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      request.body,
      { new: true }
    );

    return response
      .status(status.OK)
      .json(updatedAssignment);
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
