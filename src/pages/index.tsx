import { signIn, signOut, useSession } from 'next-auth/client';

import { Nav } from '../../src/components/Nav';

export default function Home() {
  const [ session, loading ] = useSession();
  
  return (
    <>
    <Nav />
      {!session && <>
        Not signed in <br/>
        <button onClick={() => signIn('auth0')}>Sign in</button>
    </>}
      {session && <>
        Signed in as {session.user.email} <br/>
        <button onClick={() => signOut()}>Sign out</button>
      </>}
    </>
  )
}
