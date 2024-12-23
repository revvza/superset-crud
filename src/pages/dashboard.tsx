import styles from '@/styles/dashboard.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const parseCookie = (cookieString: string): Record<string, string> => {
      return cookieString
        .split('; ')
        .reduce((acc, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
    };
  
    console.log("Cookies in client:", document.cookie); // Debug
    const cookies = parseCookie(document.cookie);
    const userRole = cookies.role || null;
    console.log("Role in client:", userRole); // Debug
    setRole(userRole);
  }, []);

  const handleLogout = async () => {
    // Panggil API logout
    const response = await fetch('/api/logout', {
      method: 'POST',
    });
  
    if (response.ok) {
      // Setelah logout, alihkan pengguna ke halaman login
      window.location.href = '/';
    } else {
      console.error('Logout failed');
    }
  };


  // Komponen Navbar
  const Navbar = () => (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>
      <Link href="/" className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </Link>
      </div>
    </div>
  );

  if (role !== 'Admin') {
    return (
      <div className={styles.container}>
      {/* Navbar */}
      <Navbar />
      <div className={styles.mainPageContainer}>
        {/* Header */}
        <header className={styles.mainPageHeader}>Dashboard</header>

        {/* Konten Utama */}
        <div className={styles.mainPageContent}>
          <Link href="/user" className={styles.card}>User Management</Link>
          <Link href="/frame" className={styles.card}>Frame Management</Link>
          <Link href="/framerole" className={styles.card}>Frame Role Management</Link>
          <Link href="/userrole" className={styles.card}>User Role Management</Link>
          <Link href="/role" className={styles.card}>Role Management</Link>
        </div>
        

        {/* Footer */}
        <footer className={styles.mainPagefooter}>
          <p>© 2024 Dashboard | Hak cipta dilindungi</p>
        </footer>
      </div>
      </div>
    );
  }

  return null; // Tampilkan halaman kosong jika role tidak valid
};

export default Dashboard;
