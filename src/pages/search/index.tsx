import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import { Nav } from '../../components/Nav';
import { api } from '../../../config/api';

export default function Search() {
  const [ inputText, setInputText ] = useState('');

  const { data, error } = useSWR(
    inputText !== '' ? `/api/courses/${inputText}` : null,
    api
  );


  const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInputText(document.getElementsByTagName('input')[0].value);
  }, [setInputText]);
  
  return (
    <div>
      <Nav />
        <form onSubmit={handleSearch}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)} 
            type="text"
            placeholder="type some discipline"
          />
          <button type="submit" style={{ display: 'none' }}>
            Pesquisar
          </button>
        </form>

        {data && data.data.map(teacher => (
          <Link href={`/search/${teacher._id}`} key={teacher._id}>
            <a>
              <h1>{teacher.name}</h1>
            </a>
          </Link>
        ))}
        
        {error && <h1>Error trying to find discipline {inputText}</h1>}
    </div>
  )
}
