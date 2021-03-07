import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { Nav } from '../../components/Nav';

interface ITeacher {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

export default function TeacherProfile({ name, email, _id }: ITeacher) {
  return (
    <>
      <Nav />
      <div>
        <h1>{name}</h1>
        <h1>{email}</h1>
        <h1>{_id}</h1>
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