import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/client';

import { api } from '../../config/api';
import { Nav } from '../../src/components/Nav';
import { Footer } from '../components/Footer';

import styles from '../../styles/pages/Profile.module.css';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function Profile() {
  const [ session, loading ] = useSession();

  const [showStudent, setShowStudent] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [ isTeacher, setIsTeacher ] = useState(false);
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ courses, setCourses ] = useState('');
  const [ availableLocations, setAvailableLocations ] = useState('');
  const [ monday, setMonday ] = useState(null);
  const [ tuesday, setTuesday ] = useState(null);
  const [ wednesday, setWednesday ] = useState(null);
  const [ thursday, setThursday ] = useState(null);
  const [ friday, setFriday ] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [loggedUserWithoutProfile, setLoggedUserWithoutProfile ] = useState(false);
  
  const { data, error } = useSWR(
    !loggedUserWithoutProfile && !loading ? `/api/user/${session?.user.email}` : null, 
    api);

  const studentAppointments = useMemo(
    () =>
      data?.data?.appointments?.filter(
        (appointment) => appointment.teacher_email !== session.user.email
      ),
    [data]
  );

  const teacherAppointments = useMemo(
    () =>
      data?.data?.appointments?.filter(
        (appointment) => appointment.teacher_email === session.user.email
      ),
    [data]
  );

  useEffect(() => {
    setErrorCount((prevstate) => prevstate + 1);
    if (error && errorCount === 1) setLoggedUserWithoutProfile(true);
  }, [error, setErrorCount]);

  useEffect(() => {
    if (error) {
      setLoggedUserWithoutProfile(true);
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const available_hours = {
      monday: monday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
      tuesday: tuesday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
      wednesday: wednesday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
      thursday: thursday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
      friday: friday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),                                
    }

    const data = {
      name,
      email,
      phone,
      teacher: isTeacher,
      courses: courses.split(',').map(item => item.trim()),
      available_hours,
      available_locations: availableLocations.split(',').map(item => item.trim())
    }

    for (const day in available_hours) {
      if (!available_hours[day]) {
        delete available_hours[day];
      }
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, data);
      setLoggedUserWithoutProfile(false);
    } catch(err) {
      alert(err.response.data.error);
    }
  }

  return (
    <div>
      <Nav />
      {!session && (
        <div className={styles.warningMessage}>
          <img src="warning.svg" alt="Warning"/>
          <p>Sign in first to see this page!</p>
          <button onClick={() => signIn('auth0')}>Login</button>
        </div>
      )}
      {session && data && (
        <div className={styles.profileContainer}>
          <section>
            <div>
            <div className={styles.listItemProfile}>
              <img src="user.png" alt="User Image"/>
              <div className={styles.items}>
                <span className={styles.title}>Name</span>
                <span className={styles.description}>{data.data.name}</span>
              </div>
            </div>
            <div className={styles.listItemProfile}>
              <img src="email.png" alt="Coins Image"/>
              <div className={styles.items}>
                <span className={styles.title}>E-mail</span>
                <span className={styles.description}>{data.data.email}</span>
              </div>
            </div>
            <div className={styles.listItemProfile}>
              <img src="phone.png" alt="Coins Image"/>
              <div className={styles.items}>
                <span className={styles.title}>Phone</span>
                <span className={styles.description}>{data.data.phone}</span>
              </div>
            </div>
            <div className={styles.listItemProfile}>
              <img src="coins.png" alt="Coins Image"/>
              <div className={styles.items}>
                <span className={styles.title}>Coins</span>
                <span className={styles.description}>{data.data.coins}</span>
              </div>
            </div>
            </div>

            <div className={styles.groupButtons}>
              <div>
                <button onClick={() => setShowStudent((prevState) => !prevState)}>                
                  <span>Student</span>
                </button>
              </div>
              <div>
                <button onClick={() => setShowTeacher((prevState) => !prevState)}>
                  Teacher
                </button>
              </div>
            </div>
          </section>
          
          <section>
            {showStudent && (
              <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
                <p className="mb-4">Seus agendamentos:</p>
                <div>
                  {studentAppointments.map((appointment) => (
                    <div key={appointment.date} className="mb-2">
                      <p>{appointment.course}:</p>
                      <div className="flex flex-row space-x-10">
                        <div className="border-2 border-box w-1/3 text-center cursor-pointer">
                          <Link href={`/search/${appointment.teacher_id}`}>
                            <a>
                              <p>{appointment.teacher_name}</p>
                            </a>
                          </Link>
                        </div>
                        <div className="border-2 border-box w-1/3 text-center">
                          <p>
                            {`${new Date(appointment.date).getDate()} de ${
                              months[
                                new Date(appointment.date).getMonth()
                              ]
                            } de ${new Date(
                              appointment.date
                            ).getFullYear()} ${new Date(
                              appointment.date
                            ).getHours()}:00`}
                          </p>
                        </div>
                        <div
                          className="border-2 border-box w-1/3 text-center"
                          onClick={() => { appointment.appointment_link &&
                              alert('Link da reunião: ' + appointment.appointment_link);
                          }}>
                          <p className={appointment.appointment_link && 'cursor-pointer'}>
                            {appointment.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showTeacher && (
              <>
                <div className={styles.showTeacherContainer}>
                  <p className="">Seus agendamentos:</p>
                  <div>
                    {teacherAppointments.map((appointment) => (
                      <div key={appointment.date} className="mb-2">
                        <p>{appointment.course}:</p>
                        <div className="flex flex-row space-x-10">
                          <div className="border-2 border-box w-1/3 text-center cursor-pointer">
                            <Link href={`/search/${appointment.teacher_id}`}>
                              <a>
                                <p>{appointment.teacher_name}</p>
                              </a>
                            </Link>
                          </div>
                          <div className="border-2 border-box w-1/3 text-center">
                            <p>
                              {`${new Date(appointment.date).getDate()} de ${
                                months[
                                  new Date(appointment.date).getMonth()
                                ]
                              } de ${new Date(
                                appointment.date
                              ).getFullYear()} ${new Date(
                                appointment.date
                              ).getHours()}:00`}
                            </p>
                          </div>
                          <div
                            className="border-2 border-box w-1/3 text-center"
                            onClick={() => {
                              appointment.appointment_link &&
                                alert(
                                  'Link da reunião: ' +
                                    appointment.appointment_link
                                );
                            }}
                          >
                            <p
                              className={
                                appointment.appointment_link && 'cursor-pointer'
                              }
                            >
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-5/6 m-auto mt-12">
                  <span className="font-bold text-2xl mr-2">
                    Sua disponibilidade
                  </span>
                </div>
                <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
                  <div>
                    <div className="mb-2">
                      <p>Disciplinas:</p>
                      <div className="flex flex-row space-x-10">
                        <div className="border-2 border-box w-full text-center">
                          <p>{data.data.courses.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p>Locais:</p>
                      <div className="flex flex-row space-x-10">
                        <div className="border-2 border-box w-full text-center">
                          <p>{data.data.available_locations.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p>Horários:</p>
                      <div className="flex flex-row space-x-10">
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>Segunda</p>
                        </div>
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>
                            {data.data.available_hours?.monday?.join(', ') ||
                              'Não disponível'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row space-x-10 mt-4">
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>Terça</p>
                        </div>
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>
                            {data.data.available_hours?.tuesday?.join(', ') ||
                              'Não disponível'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row space-x-10 mt-4">
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>Quarta</p>
                        </div>
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>
                            {data.data.available_hours?.wednesday?.join(', ') ||
                              'Não disponível'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row space-x-10 mt-4">
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>Quinta</p>
                        </div>
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>
                            {data.data.available_hours?.thursday?.join(', ') ||
                              'Não disponível'}
                          </p>
                        </div>
                      </div>     
                      <div className="flex flex-row space-x-10 mt-4">
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>Sexta</p>
                        </div>
                        <div className="border-2 border-box w-1/2 text-center">
                          <p>
                            {data.data.available_hours?.friday?.join(', ') ||
                              'Não disponível'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>              
              </>
            )}
          </section>
        </div>
      )}
      
      {loggedUserWithoutProfile && session && (
        <div className={styles.container}>
          <h1>Welcome to Booking Classes!</h1>
          <h2>Please, complete your profile registration</h2>

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name" />
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail" />
            <input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number" />

            <div className={styles.teacherContainer}>
              <h4>Are you a Teacher?</h4>
              <div>
                <div onClick={() => setIsTeacher(true)}>Yes</div>
                <div onClick={() => setIsTeacher(false)}>No</div>
              </div>
            </div>

            {isTeacher && (
              <>
                <h3>Which disciplines will you teach?</h3>
                <input
                  value={courses}
                  onChange={(e) => setCourses(e.target.value)} 
                  type="text"
                  placeholder="Funcional, Data" 
                />
                <h3>Where can you teach?</h3>
                <input
                  value={availableLocations}
                  onChange={(e) => setAvailableLocations(e.target.value)} 
                  type="text"
                  placeholder="Home, Lab Y" 
                />
                <h3>When can you teach?</h3>
                <h4>Monday:</h4>
                <input
                  value={monday}
                  onChange={(e) => setMonday(e.target.value)} 
                  type="text"
                  placeholder="7, 20, 21" 
                />
                <h4>Tuesday:</h4>
                <input
                  value={tuesday}
                  onChange={(e) => setTuesday(e.target.value)} 
                  type="text"
                  placeholder="7, 20, 21" 
                />   
                <h4>Wednesday:</h4>
                <input
                  value={wednesday}
                  onChange={(e) => setWednesday(e.target.value)} 
                  type="text"
                  placeholder="7, 20, 21" 
                />   
                <h4>Thursday:</h4>
                <input
                  value={thursday}
                  onChange={(e) => setThursday(e.target.value)} 
                  type="text"
                  placeholder="7, 20, 21" 
                />   
                <h4>Friday:</h4>
                <input
                  value={friday}
                  onChange={(e) => setFriday(e.target.value)} 
                  type="text"
                  placeholder="7, 20, 21" 
                />                                                                            
              </>
            )}


            <button className={styles.submitButton} type="submit">Create Profile</button>
          </form>
        </div>
      )}
      <Footer />
    </div>
  )
}
