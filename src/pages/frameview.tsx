import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/frameview.module.css';
import { Frame } from '@/lib/type';

const FrameView = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFrames = async () => {
      const response = await fetch('/api/framelist');
      if (response.ok) {
        const data: Frame[] = await response.json();
        setFrames(data);
      } else {
        console.error("Failed to fetch frames, redirecting to login.");
        router.push('/'); // Redirect to login if fetching fails
      }
    };

    fetchFrames();
  }, [router]);

  return (
    <div className={styles.container}>
      <h1>Frame View</h1>
      {frames.length > 0 ? (
        frames.map((frame) => (
          <div key={frame.frame_id} className={styles.frameContainer}>
            <h2>{frame.frame_name}</h2>
            <iframe
              src={frame.frame_url}
              width="600"
              height="400"
              title={frame.frame_name}
              frameBorder="0"
            />
          </div>
        ))
      ) : (
        <p>No frames available for your role.</p>
      )}
    </div>
  );
};

export default FrameView;