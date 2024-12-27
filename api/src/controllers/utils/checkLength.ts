import status from 'http-status';
import { Response } from 'express';
import { Document } from 'mongoose';

export const checkLength = (list: Document[], response: Response) => {
  if (list.length === 0) {
    return response
      .status(status.NO_CONTENT)
      .json({ message: 'No guidelines found.' })
  }
}
