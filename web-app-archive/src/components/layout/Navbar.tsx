import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoText}>Research<span className={styles.accent}>In</span></span>
        </Link>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder="Search papers, researchers..." className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}><Bell size={20} /></button>
        <button className={styles.profileBtn}><User size={20} /></button>
      </div>
    </nav>
  );
}
