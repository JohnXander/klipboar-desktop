import status from 'http-status';
import { Response } from 'express';

export const authoriseRole = (
  role: string, 
  requestedRole: string,
  response: Response
) => {
  if (role !== requestedRole) {
    response
      .status(status.FORBIDDEN)
      .json({ error: 'You do not have permission to perform this action.' });

    return false;
  }
}
