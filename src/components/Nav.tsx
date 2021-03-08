import Link from 'next/link';

import styles from '../../styles/components/Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.navContainer}>
      <ul>        
        <li>
          <Link href="/">
            <a className={styles.leftContainer}>
              <img src="logo.png" alt="Logo"/>
              <p>Booking Classes</p>
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