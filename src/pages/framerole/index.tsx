import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard.module.css';
import { FrameRole } from '@/lib/type';
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

// Komponen Modal untuk Edit Frame Role
function EditFrameRoleModal({
  showModal,
  onClose,
  frameRoleToEdit,
  onSubmit,
  frameOptions, // frameOptions sekarang berisi { frame_id, frame_name }
  roleOptions,
}: {
  showModal: boolean;
  onClose: () => void;
  frameRoleToEdit: FrameRole | null;
  onSubmit: (frame_id: number, role_id: number) => void;
  frameOptions: Frame[]; // Perbarui tipe data frameOptions menjadi array Frame
  roleOptions: { role_id: number, role_name: string }[];
}) {
  const [frame_id, setFrameId] = useState<number | ''>('');
  const [role_id, setRoleId] = useState<number | ''>('');

  useEffect(() => {
    if (frameRoleToEdit) {
      setFrameId(frameRoleToEdit.frame_id);
      setRoleId(frameRoleToEdit.role_id);
    }
  }, [frameRoleToEdit]);

  const handleSubmit = () => {
    if (frame_id && role_id) {
      onSubmit(frame_id, role_id);
      setFrameId('');
      setRoleId('');
    } else {
      alert('Both Frame ID and Role ID are required');
    }
  };

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Frame Role</h2>
        <select
          value={frame_id}
          onChange={(e) => setFrameId(Number(e.target.value))}
        >
          <option value="">Select Frame</option>
          {frameOptions.map((frame) => (
            <option key={frame.frame_id} value={frame.frame_id}>
              {frame.frame_name} {/* Menampilkan frame_name di dropdown */}
            </option>
          ))}
        </select>
        <select
          value={role_id}
          onChange={(e) => setRoleId(Number(e.target.value))}
        >
          <option value="">Select Role</option>
          {roleOptions.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_name}
            </option>
          ))}
        </select>
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

// Halaman utama Frame Role Management
export default function FrameRolePage() {
  const [frameRoles, setFrameRoles] = useState<FrameRole[]>([]);
  const [frameOptions, setFrameOptions] = useState<Frame[]>([]); // frameOptions akan berisi array objek Frame
  const [roleOptions, setRoleOptions] = useState<{ role_id: number, role_name: string }[]>([]);
  const [frame_id, setFrameId] = useState<number | ''>('');
  const [role_id, setRoleId] = useState<number | ''>('');
  const [editingFrameRoleId, setEditingFrameRoleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch daftar frame roles
    fetch('/api/framerole')
      .then((res) => res.json())
      .then((data) => setFrameRoles(data));

    // Fetch daftar frame ID dan nama frame
    fetch('/api/frame')
      .then((res) => res.json())
      .then((data) => setFrameOptions(data));  // frameOptions sekarang berisi array objek frame { frame_id, frame_name }

    // Fetch daftar role options
    fetch('/api/role')
      .then((res) => res.json())
      .then((data) => setRoleOptions(data));
  }, []);

  const handleAddFrameRole = async () => {
    if (!frame_id || !role_id) {
      alert('Frame ID and Role ID are required');
      return;
    }

    const response = await fetch('/api/framerole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frame_id, role_id }),
    });

    if (response.ok) {
      alert('Frame Role added successfully');
      setFrameId('');
      setRoleId('');
      fetch('/api/framerole')
        .then((res) => res.json())
        .then((data) => setFrameRoles(data));
    } else {
      alert('Failed to add frame role');
    }
  };

  const handleDeleteFrameRole = async (frameRoleId: number) => {
    const response = await fetch(`/api/framerole/id?id=${frameRoleId}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Frame Role deleted successfully');
      fetch('/api/framerole')
        .then((res) => res.json())
        .then((data) => setFrameRoles(data));
    }
  };

  const handlePrepareEdit = (frameRole: FrameRole) => {
    setEditingFrameRoleId(frameRole.framerole_id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingFrameRoleId(null);
    setShowModal(false);
  };

  const handleSubmitEdit = async (frameId: number, roleId: number) => {
    const response = await fetch(`/api/framerole/id?id=${editingFrameRoleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frame_id: frameId, role_id: roleId }),
    });

    if (response.ok) {
      alert('Frame Role updated successfully');
      setShowModal(false);
      fetch('/api/framerole')
        .then((res) => res.json())
        .then((data) => setFrameRoles(data));
    } else {
      alert('Failed to update frame role');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>Frame Role Management</h1>

      {/* Form untuk menambahkan Frame Role */}
      <div className={styles.form}>
        <h2>Add New Frame Role</h2>
        <select
          value={frame_id}
          onChange={(e) => setFrameId(Number(e.target.value))}
        >
          <option value="">Select Frame</option>
          {frameOptions.map((frame) => (
            <option key={frame.frame_id} value={frame.frame_id}>
              {frame.frame_name} {/* Menampilkan nama frame di dropdown */}
            </option>
          ))}
        </select>
        <select
          value={role_id}
          onChange={(e) => setRoleId(Number(e.target.value))}
        >
          <option value="">Select Role</option>
          {roleOptions.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddFrameRole}>Add Frame Role</button>
      </div>

      {/* Tabel Frame Role */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Frame ID</th>
              <th>Role ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {frameRoles.map((frameRole) => (
              <tr key={frameRole.framerole_id}>
                <td>{frameRole.framerole_id}</td>
                <td>{frameRole.frame_id}</td> {/* Tabel tetap menggunakan ID */}
                <td>{frameRole.role_id}</td>
                <td>
                  <button
                    className={styles.tableButton}
                    onClick={() => handlePrepareEdit(frameRole)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.tableButton}
                    onClick={() => handleDeleteFrameRole(frameRole.framerole_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit Frame Role */}
      <EditFrameRoleModal
        showModal={showModal}
        onClose={handleCancelEdit}
        frameRoleToEdit={
          frameRoles.find((frameRole) => frameRole.framerole_id === editingFrameRoleId) || null
        }
        onSubmit={handleSubmitEdit}
        frameOptions={frameOptions} // Mengirim frameOptions yang berisi objek frame
        roleOptions={roleOptions}
      />
    </div>
  );
}
