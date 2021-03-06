import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../../config/database';

interface ErrorResponseType {
  error: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<ErrorResponseType | Record<string, unknown>[]>): Promise<void> => {
  if(req.method == 'GET') {
    const { db } = await connect();

    const response = await db.collection('users').find({ teacher: true }).toArray();

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
