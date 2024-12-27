import { Request, Response } from 'express';
import status from 'http-status';
import Assignment from '../../../models/assignments';
import Organisation from '../../../models/organisations';
import { User } from '../assignment.types';
import type { Assignment as IAssignment } from '../../../models/assignments/assignment.types';
import { Role } from '../../../lib/enums/role.enum';

export const getAllAssignments = async (request: Request, response: Response) => {
  try {
    if (!request.params.orgId) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Organisation ID is required.' });
    }

    const { orgId } = request.params;
    const { guideline } = request.query;
    const organisationData = await Organisation.findById(orgId);

    if (!organisationData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to view assignments.' });
    }
    
    let assignments: IAssignment[] = [];
    const { _id: userId, role: userRole } = request.user as User;
    
    if (userRole === Role.STUDENT) {
      assignments = await Assignment
        .find({
          submittedBy: userId,
          organisation: orgId,
          isDeleted: false
        })
        .populate([
          { path: 'submittedTo', select: 'name' },
          { path: 'guideline', select: 'dueDate wordLimit' }
        ])
        .sort({ updatedAt: -1 });
    } else if (userRole === Role.TEACHER) {
      assignments = await Assignment
        .find({
          submittedTo: userId,
          organisation: orgId,
          isSubmitted: true,
          guideline: guideline ? guideline : { $ne: null },
          isDeleted: false
        })
        .populate([
          { path: 'submittedBy', select: 'name' },
          { path: 'guideline', select: 'dueDate wordLimit' }
        ])
        .sort({ submittedAt: -1 });
    }

    if (assignments.length === 0) {
      return response
        .status(status.NO_CONTENT)
        .json({ message: 'No assignments found.' })
    }

    return response
      .status(status.OK)
      .json(assignments);
  } catch (error) {
    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
