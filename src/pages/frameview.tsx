import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/frameview.module.css';
import { Frame } from '@/lib/type'; // Pastikan path ini sesuai dengan lokasi file type.ts
// import Link from 'next/link';

const FrameView = () => {
  const [frames, setFrames] = useState<Frame[]>([]); // Menyimpan daftar frames
  const [activeFrame, setActiveFrame] = useState<string | null>(null); // Menyimpan frame aktif
  const router = useRouter();

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const response = await fetch('/api/framelist'); // Mengambil data frame dari API
        if (response.ok) {
          const data: Frame[] = await response.json();
          setFrames(data);
          if (data.length > 0) {
            setActiveFrame(data[0].frame_url); // Set frame pertama sebagai default
          }
        } else {
          console.error('Failed to fetch frames, redirecting to login.');
          router.push('/'); // Redirect ke login jika gagal
        }
      } catch (error) {
        console.error('Error fetching frames:', error);
        router.push('/'); // Redirect ke login jika ada error
      }
    };

    fetchFrames();
  }, [router]);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2>Menu</h2>
        {frames.map((frame) => (
          <button
            key={frame.frame_id}
            className={`${styles.sidebarButton} ${
              activeFrame === frame.frame_url ? styles.activeButton : ''
            }`}
            onClick={() => setActiveFrame(frame.frame_url)}
          >
            {frame.frame_name}
          </button>
        ))}
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Area tampilan frame */}
      <div className={styles.frameContainer}>
        {activeFrame ? (
          <iframe
            src={activeFrame}
            title="Active Frame"
            className={styles.iframe}
            frameBorder="0"
          />
        ) : (
          <p>No frame selected</p>
        )}
      </div>
    </div>
  );
};

export default FrameView;