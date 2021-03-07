import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { Nav } from '../../components/Nav';
import { useState } from 'react';
import { useSession } from 'next-auth/client';

interface ITeacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

const weekDayNumber = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}

const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export default function TeacherProfile({ name, email, available_hours, courses, phone, available_locations }: ITeacher) {
  const [ session, loading ] = useSession();

  const [date, setDate] = useState(() => {
    const validDaysNumber: number[] = [];

    for (const dayWeek in available_hours) {
      validDaysNumber.push(weekDayNumber[dayWeek]);
    }

    const minDay = Math.min(...validDaysNumber);
    
    const d = new Date();
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + minDay) % 7));
    const date = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      available_hours[weekdays[minDay]][0],
      0,
      0
    );

    return date;
  });

  const [allDates] = useState(() => {
    const startDate = new Date();
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

    const oneDay = 1000 * 60 * 60 * 24;

    const start = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    const end = Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    const daysBetween = (start - end) / oneDay;

    const validDaysNumber: number[] = [];
    for (const dayWeek in available_hours) {
      validDaysNumber.push(weekDayNumber[dayWeek]);
    }

    const invalidDates: Date[] = [];
    const validDates: Date[] = [];
    invalidDates.push(new Date());
    const loopDate = startDate;
    for (let i = 0; i < daysBetween; ++i) {
      const aux = loopDate.setDate(loopDate.getDate() + 1);

      if (!validDaysNumber.includes(loopDate.getDay())) {
        invalidDates.push(new Date(aux));
      } else {
        validDates.push(new Date(aux));
      }
    }

    return { validDates, invalidDates };
  });

  const [validHours] = useState(() => {
    const validHours: Date[] = [];

    allDates.validDates.forEach((validDate) => {
      const copyValidDate = validDate;

      const validDateDayNumber = copyValidDate.getDay();
      const validDateDay = weekdays[validDateDayNumber];
      const availableHours = available_hours[validDateDay];
      if (availableHours) {
        let i = 0;
        while (i < 24) {
          if (availableHours.includes(i)) {
            validHours.push(
              new Date(
                copyValidDate.getFullYear(),
                copyValidDate.getMonth(),
                copyValidDate.getDate(),
                i,
                0,
                0
              )
            );
          }
          i++;
        }
      }
    });

    return validHours;
  });

  return (
    <>
      <Nav />
      <div>
        <h1>Name: {name}</h1>
        <h1>E-mail: {email}</h1>
        <h1>Phone: {phone}</h1>


        <div>
          <p>Disciplines:</p>
          <p>{courses.join(', ')}</p>
        </div>
      </div>

      <div>
        <p>Meeting Places:</p>
        <p>{available_locations.join(', ')}</p>
      </div>

      <div>
        <p>Schedule:</p>
        <div>
          <p>Monday:</p>
          <p>{available_hours?.monday?.join(', ') || 'Not Available'}</p>
        </div>      

        <div>
          <p>Tuesday:</p>
          <p>{available_hours?.tuesday?.join(', ') || 'Not Available'}</p>
        </div>  

        <div>
          <p>Wednesday:</p>
          <p>{available_hours?.wednesday?.join(', ') || 'Not Available'}</p>
        </div>  

        <div>
          <p>Thursday:</p>
          <p>{available_hours?.thursday?.join(', ') || 'Not Available'}</p>
        </div>  

        <div>
          <p>Friday:</p>
          <p>{available_hours?.friday?.join(', ') || 'Not Available'}</p>
        </div>    
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  
  const _id = ctx.query._id as string;

  const response = await axios.get<ITeacher>(`${process.env.NEXT_PUBLIC_URL}/api/teacher/${_id}`)

  const teacher = response.data;

  return {
    props: teacher
  }
}