import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../../config/database';

interface ErrorResponseType {
  error: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<ErrorResponseType | object[]>): Promise<void> => {
  if(req.method == 'GET') {
    const courses  = req.query.courses as string;

    if (!courses) {
      res.status(400).json({ error: 'Course name is missing on URL.' });
      return;
    }

    const { db } = await connect();

    const response = await db
      .collection('users')
      .find({ courses: { $in: [new RegExp(`${courses}`, 'i')] } })
      .toArray();

    if (response.length == 0) {
      res.status(400).send({ error: 'Course not found in our database.'});
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }  
}
