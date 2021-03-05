import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import connect from '../../../../config/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  teacher: boolean;
  courses: string[];
  coins: number;
  available_hours: object;
  available_locations: string[];
  reviews: object[];
  appointments: object[];
}

export default async (req: NextApiRequest, res: NextApiResponse<ErrorResponseType | SuccessResponseType>): Promise<void> => {
  if(req.method == 'GET') {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: 'Teacher ID is missing on request body.' });
      return;
    }

    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      res.status(400).send({ error: 'Wrong ObjectID format.'});
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!response) {
      res.status(400).send({ error: 'Teacher not found in our database.'});
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
