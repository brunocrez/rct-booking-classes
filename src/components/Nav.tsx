import Link from 'next/link';

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Booking Classes</a>
          </Link>
        </li>
        <ul>
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
      </ul>
    </nav>
  );
}