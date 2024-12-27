import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Site from '../../../models/sites';
import { createSiteDataValidation } from '../validation/createSite.validation';
import Organisation from '../../../models/organisations';
import { User } from '../../assignment/assignment.types';

export const getFavicon = async (url: string) => {
  try {
    const { hostname } = new URL(url);
    const faviconUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

    return faviconUrl;
  } catch (error) {
    console.error('Error fetching favicon:', error);
  }
};

export const createSite = async (request: Request, response: Response) => {
  try {
    await createSiteDataValidation.validateAsync(request.body);

    const { orgId } = request.params;
    const organisationData = await Organisation.findById(orgId);

    if (!request.user) {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: 'You must be logged in to create a site.' });
    }

    if (!organisationData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    const {
      url,
      launchCount,
    } = request.body;
    const favicon = await getFavicon(url);

    const { _id: userId } = request.user as User;
    const siteAlreadyExists = await Site.findOne({ url, owner: userId });

    if (siteAlreadyExists) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: 'A site with that url already exists' });
    }

    const siteData = {
      url,
      launchCount,
      favicon,
      organisation: orgId,
      owner: userId,
    };

    await Site.create(siteData);

    return response
      .status(status.CREATED)
      .json(siteData);
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
