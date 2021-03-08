import { signIn, signOut, useSession } from 'next-auth/client';

import { Nav } from '../../src/components/Nav';
import { Footer } from '../components/Footer';

import styles from '../../styles/pages/Index.module.css';

export default function Home() {
  const [ session, loading ] = useSession();
  
  return (
    <>
    <Nav />
      {!session &&
        <div className={styles.indexContainer}>          
          <button onClick={() => signIn('auth0')}>Login</button>
        </div>}
      {session && <>
        Signed in as {session.user.email} <br/>
        <button onClick={() => signOut()}>Sign out</button>
      </>}
      <Footer />
    </>
  )
}
