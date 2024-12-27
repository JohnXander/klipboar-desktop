import { Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';
import Site from '../../../models/sites';
import { updateSiteParamValidation } from '../validation/updateSite.validation';
import Organisation from '../../../models/organisations';

export const updateSite = async (request: Request, response: Response) => {
  try {
    await updateSiteParamValidation.validateAsync(request.params);

    const {
      orgId,
      siteId,
    } = request.params;

    const organisationData = await Organisation.findById(orgId);

    if (!organisationData) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Organisation not found.' });
    }

    const site = await Site.findOne({
      _id: siteId,
      organisation: orgId
  });

    if (!site) {
      return response
        .status(status.NOT_FOUND)
        .json({ error: 'Site not found' });
    }

    site.launchCount = site.launchCount + 1;
    await site.save();

    return response
      .status(status.OK)
      .json(site);
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
