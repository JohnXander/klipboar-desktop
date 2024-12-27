import status from 'http-status';
import { Request, Response } from 'express';

export const getAuth = (request: Request, response: Response) => {
  if (!request.user) {
    return response
      .status(status.UNAUTHORIZED)
      .json({ error: 'You must be logged in to create a guideline.' });
  }
  
  return request.user;
}
