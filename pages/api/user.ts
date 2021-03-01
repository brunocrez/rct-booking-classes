import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../config/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  teacher: false;
}

export default async (req: NextApiRequest, res: NextApiResponse<ErrorResponseType | SuccessResponseType>): Promise<void> => {
  if (req.method == 'POST') {
    const { name, age, email, phone, teacher } = req.body;
    
    if (!name || !email || !phone || !teacher) {
      res.status(400).json({ error: 'Missing parameters.' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').insertOne({
      name,
      age,
      email,
      phone,
      teacher
    });

    res.status(201).json(response.ops[0]);
  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
