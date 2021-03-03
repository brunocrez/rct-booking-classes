import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { ObjectId } from 'mongodb';

import connect from '../../config/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date: string; 
  teacher_name: string; 
  teacher_id: string; 
  student_name: string; 
  student_id: string; 
  course: string; 
  location: string; 
  appointment_link: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<ErrorResponseType | SuccessResponseType>): Promise<void> => {
  const session = await getSession({ req });

  if (!session) {
    res.status(400).json({ error: 'Please, sign in first!' });
    return;       
  }

  if(req.method == 'POST') {
    const { date, teacher_name, teacher_id, student_name, student_id, course, location, appointment_link } = req.body;

    if (!date || !teacher_name || !teacher_id || !student_id || !student_name || !course || !location) {
      res.status(400).json({ error: 'Some parameters are missing on request body.' });
      return;
    }

    const { db } = await connect();

    const teacher = await db.collection('users').findOne({ _id: new ObjectId(teacher_id) });

    if (!teacher) {
      res.status(400).json({ error: `Teacher ${teacher_name} with code ${teacher_id} does not exists in our database.` });
      return;      
    }

    const student = await db.collection('users').findOne({ _id: new ObjectId(student_id) });

    if (!student) {
      res.status(400).json({ error: `Student ${student_name} with code ${student_id} does not exists in our database.` });
      return;      
    }

    const appointment = {
      date, 
      teacher_name, 
      teacher_id, 
      student_name, 
      student_id, 
      course, 
      location, 
      appointment_link: appointment_link || ''
    }

    await db.collection('users').updateOne({ _id: new ObjectId(teacher_id)}, {$push: { appointments: appointment }});
    await db.collection('users').updateOne({ _id: new ObjectId(student_id)}, {$push: { appointments: appointment }});

    res.status(200).json(appointment);

  } else {
    res.status(400).json({ error: 'Method now allowed.' });
  }
  
}
