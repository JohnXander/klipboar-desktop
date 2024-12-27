import { Request, Response } from 'express';
import status from 'http-status';
import Organisation from '../../../models/organisations';
import User from '../../../models/user';
import { Role } from '../../../lib/enums/role.enum';
import { User as UserType } from '../../assignment/assignment.types';

export const getAllUsers = async (request: Request, response: Response) => {
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

    const { role: userRole } = request.user as UserType;

    let users = [];

    if (userRole === Role.STUDENT) {
      users = await User.find({ role: Role.TEACHER });
    } else {
      users = await User.find();
    }

    if (users.length === 0) {
      return response
        .status(status.NO_CONTENT)
        .json({ message: 'No users found.' })
    }

    return response
      .status(status.OK)
      .json(users);
  } catch (error) {
    return response
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: 'An unexpected error occurred.' });
  }
};
