import { Request, Response } from 'express';
import status from 'http-status';
import Organisation from '../../../models/organisations';
import Joi from 'joi';
import { modifyUserInOrganisationValidation } from '../validation/updateOrganisaion.validation';
import User from '../../../models/user';
import { ModifyUserInOrganisationAction } from '../../../lib/enums/modifyUserInOrganisationAction.enum';
import { User as UserType } from '../../assignment/assignment.types';

export const modifyUserInOrganisation = async (request: Request, response: Response) => {
  try {
    await modifyUserInOrganisationValidation.validateAsync({
      params: request.params,
      query: request.query,
      body: request.body,
    });

    const { orgId } = request.params;
    const { action } = request.query;
    const { email } = request.body;

    const organisation = await Organisation.findById(orgId);

    if (!organisation) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found' });
    }

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to view assignments.' });
    }

    let emailToUse = email;

    if (action === ModifyUserInOrganisationAction.LEAVE) {
      emailToUse = (request.user as UserType).email;
    }
    
    if (action !== ModifyUserInOrganisationAction.LEAVE && !emailToUse) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: emailToUse });

    if (!user) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'User not found' });
    }

    if (action === ModifyUserInOrganisationAction.ADD) {
      const userExists = organisation.members.some(member => member.user === user.email);

      if (userExists) {
        return response
          .status(status.CONFLICT)
          .json({ error: 'User already exists in the organisation' });
      }

      const newMember = {
        user: user.email,
        role: user.role,
      };

      organisation.members.push(newMember);

      await organisation.save();

      return response
        .status(status.OK)
        .json(organisation);
    } else if (action === ModifyUserInOrganisationAction.REMOVE || action === ModifyUserInOrganisationAction.LEAVE) {
      const memberIndex = organisation.members.findIndex(member => member.user === user.email);

      if (memberIndex === -1) {
        return response
          .status(status.NOT_FOUND)
          .json({ error: 'User not found in the organisation' });
      }

      organisation.members.splice(memberIndex, 1);

      await organisation.save();

      return response
        .status(status.OK)
        .json(organisation);
    } else {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: `Invalid action specified. Use "${ModifyUserInOrganisationAction.ADD}" or "${ModifyUserInOrganisationAction.REMOVE}" or "${ModifyUserInOrganisationAction.LEAVE}" .` });
    }
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
