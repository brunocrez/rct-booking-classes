import { signIn, signOut, useSession } from 'next-auth/client';

import { Nav } from '../../src/components/Nav';

export default function Search() {
  const [ session, loading ] = useSession();
  
  return (
    <>
    <Nav />
    <h1>Página Search</h1>
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
