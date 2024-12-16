import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { Frame } from '@/lib/type';
import Link from 'next/link';

// Komponen Navbar
function Navbar() {
  return (
    <div className={styles.navbar}>
      <Link href="/dashboard" className={styles.backButton}>
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}

// Komponen Modal
function EditFrameModal({
    showModal,
    onClose,
    frameToEdit,
    onSubmit,
  }: {
    showModal: boolean;
    onClose: () => void;
    frameToEdit: Frame | null;
    onSubmit: (frame_name: string, frame_url: string) => void;
  }) {
    const [frame_name, setFrameName] = useState('');
    const [frame_url, setFrameUrl] = useState('');
  
    useEffect(() => {
      if (frameToEdit) {
        setFrameName(frameToEdit.frame_name);
      }
    }, [frameToEdit]);
  
    const handleSubmit = () => {
      onSubmit(frame_name, frame_url);
      setFrameUrl('');
      setFrameName('');
    };
  
    if (!showModal) return null;
  
    return (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Frame</h2>
            <input
              type="text"
              placeholder="Frame Name"
              value={frame_name}
              onChange={(e) => setFrameName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Frame URL"
              value={frame_url}
              onChange={(e) => setFrameUrl(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.actionButton} onClick={handleSubmit}>
                Update
              </button>
              <button className={styles.actionButton} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    export default function FramePage() {
        const [frames, setFrames] = useState<Frame[]>([]);
        const [frame_name, setFrameName] = useState('');
        const [frame_url, setFrameURL] = useState('');
        const [editingFrameId, setEditingFrameId] = useState<number | null>(null);
        const [showModal, setShowModal] = useState(false);
      
        useEffect(() => {
          fetch('/api/frame')
            .then((res) => res.json())
            .then((data) => setFrames(data));
        }, []);
      
        const handleAddFrame = async () => {
            const response = await fetch('/api/frame', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ frame_name, frame_url }),
            });
        
            if (response.ok) {
              alert('Frame added successfully');
              setFrameName('');
              setFrameURL('');
              fetch('/api/frame')
                .then((res) => res.json())
                .then((data) => setFrames(data));
            } else {
              alert('Failed to add frame');
            }
          };
        

  const handleDeleteFrame = async (frameId: number) => {
    const response = await fetch(`/api/frame/id?id=${frameId}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Frame deleted successfully');
      fetch('/api/frame')
        .then((res) => res.json())
        .then((data) => setFrames(data));
    }
  };

  const handlePrepareEdit = (frame: Frame) => {
    setEditingFrameId(frame.frame_id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingFrameId(null);
    setShowModal(false);
  };

  const handleSubmitEdit = async (frameName: string, frameURL: string) => {
    const response = await fetch(`/api/frame/id?id=${editingFrameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frame_name: frameName, frame_url: frameURL }),
    });

    if (response.ok) {
      alert('Frame updated successfully');
      setShowModal(false);
      fetch('/api/frame')
        .then((res) => res.json())
        .then((data) => setFrames(data));
    } else {
        alert('Failed to update frame');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>Frame Management</h1>
      
      {/* Form untuk menambahkan frame */}
      <div className={styles.form}>
        <h2>Add New Frame</h2>
        <input
          type="text"
          placeholder="Frame Name"
          value={frame_name}
          onChange={(e) => setFrameName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Frame URL"
          value={frame_url}
          onChange={(e) => setFrameURL(e.target.value)}
        />
        <button onClick={handleAddFrame}>Add frame</button>
      </div>

      {/* Tabel Frame */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Frame Name</th>
              <th>Frame URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((frame) => (
              <tr key={frame.frame_id}>
                <td>{frame.frame_id}</td>
                <td>{frame.frame_name}</td>
                <td>{frame.frame_url}</td>
                <td>
                <button className={styles.tableButton} onClick={() => handlePrepareEdit(frame)}>Edit</button>
                  <button className={styles.tableButton} onClick={() => handleDeleteFrame(frame.frame_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit frame */}
      <EditFrameModal
        showModal={showModal}
        onClose={handleCancelEdit}
        frameToEdit={frames.find((frame) => frame.frame_id === editingFrameId) || null}
        onSubmit={handleSubmitEdit}
      />
    </div>
  );
}