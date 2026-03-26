import Link from 'next/link';
import { Home, User, FileText, Compass, Sparkles, Users } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navLinks}>
        <Link href="/" className={`${styles.navItem} ${styles.active}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/profile" className={styles.navItem}>
          <User size={20} />
          <span>Identity</span>
        </Link>
        <Link href="/discovery" className={styles.navItem}>
          <Compass size={20} />
          <span>Discovery</span>
        </Link>
        <Link href="/publishing" className={styles.navItem}>
          <FileText size={20} />
          <span>Publishing</span>
        </Link>
        <Link href="/community" className={styles.navItem}>
          <Users size={20} />
          <span>Community</span>
        </Link>
      </nav>

      <div className={styles.aiBadge}>
        <Sparkles size={16} className={styles.aiIcon} />
        <span>AI Features Active</span>
      </div>
    </aside>
  );
}
