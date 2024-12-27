import status from 'http-status';
import { Request, Response } from 'express';

export const getOrg = (request: Request, response: Response) => {
  const { orgId } = request.params;
  
  if (!orgId) {
    return response
      .status(status.BAD_REQUEST)
      .json({ error: 'Organisation ID is required.' });
  }

  return orgId;
}
