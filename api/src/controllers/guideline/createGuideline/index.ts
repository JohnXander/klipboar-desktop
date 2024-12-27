import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import { createGuidelineDataValidation } from '../validation/createGuideline.validation';
import Guideline from '../../../models/guidelines';
import Organisation from '../../../models/organisations';
import { User } from '../../assignment/assignment.types';
import { getAuth } from '../../utils/getAuth';
import { getOrg } from '../../utils/getOrg';
import { authoriseRole } from '../../utils/authoriseRole';
import { Role } from '../../../lib/enums/role.enum';

export const createGuideline = async (request: Request, response: Response) => {
  try {
    await createGuidelineDataValidation.validateAsync(request.body);

    const user = getAuth(request, response);
    const orgId = getOrg(request, response);

    const { role } = user as User;

    if (authoriseRole(role, Role.TEACHER, response) === false) return;

    const orgData = await Organisation.findById(orgId);

    if (!orgData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    const {
      name,
      description,
      wordLimit,
      dueDate,
    } = request.body;

    const guidelineData = {
      name,
      description,
      wordLimit,
      dueDate,
      organisation: orgId,
      owner: (user as User)._id,
      isDeleted: false,
    };

    await Guideline.create(guidelineData);

    return response
      .status(status.CREATED)
      .json(guidelineData);
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
