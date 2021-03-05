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
  }  
}
