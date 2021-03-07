import Link from 'next/link';

import styles from '../../styles/components/Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.navContainer}>
      <ul>        
        <li>
          <Link href="/">
            <a>
              <img src="logo.svg" alt="Logo" style={{ height: 20, width: 20, marginRight: '4px' }}/>
              Booking Classes
            </a>
          </Link>
        </li>   
      </ul>
      <ul className={styles.rightContainer}>
        <li>
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/search">
            <a>Search</a>
          </Link>
        </li>
      </ul>      
    </nav>
  );
}