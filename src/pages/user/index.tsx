import styles from '@/styles/dashboard.module.css';
import { useState, useEffect } from 'react';
import { User } from '@/lib/type';
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
function EditUserModal({
  showModal,
  onClose,
  userToEdit,
  onSubmit,
}: {
  showModal: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onSubmit: (username: string, password: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username);
    }
  }, [userToEdit]);

  const handleSubmit = () => {
    onSubmit(username, password);
    setPassword('');
    setUsername('');
  };

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleAddUser = async () => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('User added successfully');
      setUsername('');
      setPassword('');
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else {
      alert('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const response = await fetch(`/api/user?id=${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('User deleted successfully');
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else {
      alert('Failed to delete user');
    }
  };

  const handlePrepareEdit = (user: User) => {
    setEditingUserId(user.user_id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setShowModal(false);
  };

  const handleSubmitEdit = async (username: string, password: string) => {
    if (!editingUserId) return;

    const response = await fetch(`/api/user?id=${editingUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('User updated successfully');
      setShowModal(false);
      setEditingUserId(null);
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else {
      alert('Failed to update user');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>User Management</h1>
      
      {/* Form untuk menambahkan user */}
      <div className={styles.form}>
        <h2>Add New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Tabel User */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>
                  <button className={styles.tableButton} onClick={() => handlePrepareEdit(user)}>Edit</button>
                  <button className={styles.tableButton} onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit User */}
      <EditUserModal
        showModal={showModal}
        onClose={handleCancelEdit}
        userToEdit={users.find((user) => user.user_id === editingUserId) || null}
        onSubmit={handleSubmitEdit}
      />
    </div>
  );
}