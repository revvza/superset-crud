// pages/index.tsx (Frontend)
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Redirect ke halaman dashboard setelah login sukses
      router.push('/dashboard');
    } else {
      setError(data.error || 'Invalid credentials');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainPageContainer}>
      <header className={styles.mainPageHeader}>Login</header>
      <form onSubmit={handleLogin} className={styles.form}>
        <div>
          <label className={styles.label}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
