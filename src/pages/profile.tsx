import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';

import { api } from '../../config/api';
import { Nav } from '../../src/components/Nav';

import styles from '../../styles/pages/Profile.module.css';

export default function Profile() {
  const [ session, loading ] = useSession();

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

  const [loggedUserWithoutProfile, setLoggedUserWithoutProfile ] = useState(false);
  
  const { data, error } = useSWR(
    !loggedUserWithoutProfile && !loading ? `/api/user/${session?.user.email}` : null, 
    api);

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
        <>
          Favor fazer login para acessar essa página <br/>
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </>
      )}
      {session && data && (
        <>
          Signed in as {session.user.email} <br/>
          <button onClick={() => signOut()}>Sign out</button>
          <p>{data.data.name}</p>
          <p>{data.data.coins}</p>
        </>
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
    </div>
  )
}
