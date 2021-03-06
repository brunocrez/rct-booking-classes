import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';

import { api } from '../../config/api';
import { Nav } from '../../src/components/Nav';

export default function Profile() {
  const [ session, loading ] = useSession();
  
  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api);

  return (
    <div>
      <Nav />
      <h1>Página Profile</h1>
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
      {error && <h1>O usuário com e-mail {session.user.email} não existe!</h1>}
    </div>
  )
}
