import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../config/database';

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
    const { email } = req.query;
    console.log(email)

    if (!email) {
      res.status(400).json({ error: 'E-mail is missing on URL.' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ email });

    if (!response) {
      res.status(400).send({ error: `E-mail ${email} not found in our database.`});
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
