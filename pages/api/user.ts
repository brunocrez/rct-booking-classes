import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../config/database';

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
  if (req.method == 'POST') {
    const { name, email, phone, teacher, courses, available_hours, available_locations } = req.body;

    if (!teacher) {
      if (!name || !email || !phone) {
        res.status(400).json({ error: 'Missing parameters.' });
        return;
      }
    } else if (teacher) {
      if (!name || !email || !phone || !courses || !available_hours || !available_locations) {
        res.status(400).json({ error: 'Missing parameters.' });
        return;
      }
    }   

    const { db } = await connect();

    const response = await db.collection('users').insertOne({
      name,
      email,
      phone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: []
    });

    res.status(201).json(response.ops[0]);
  } else if(req.method == 'GET') {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'E-mail is missing on request body.' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ email });

    if (!response) {
      res.status(400).send({ error: 'User not found in our database.'});
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
