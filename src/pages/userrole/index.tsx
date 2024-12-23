import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard.module.css';
import { UserRole } from '@/lib/type';
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

// Komponen Modal untuk Edit User Role
function EditUserRoleModal({
  showModal,
  onClose,
  userRoleToEdit,
  onSubmit,
  userOptions,
  roleOptions,
}: {
  showModal: boolean;
  onClose: () => void;
  userRoleToEdit: UserRole | null;
  onSubmit: (user_id: number, role_id: number) => void;
  userOptions: { user_id: number; username: string }[]; // Menggunakan user_id dan username
  roleOptions: { role_id: number; role_name: string }[]; // Role options with name and id
}) {
  const [user_id, setUserId] = useState<number | ''>('');
  const [role_id, setRoleId] = useState<number | ''>('');

  useEffect(() => {
    if (userRoleToEdit) {
      setUserId(userRoleToEdit.user_id);
      setRoleId(userRoleToEdit.role_id);
    }
  }, [userRoleToEdit]);

  const handleSubmit = () => {
    if (user_id && role_id) {
      onSubmit(user_id, role_id);
      setUserId(''); 
      setRoleId(''); 
    } else {
      alert('Both User ID and Role ID are required');
    }
  };

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit User Role</h2>
        <select
          value={user_id}
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {userOptions.map(({ user_id, username }) => (
            <option key={user_id} value={user_id}>
              {username}
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

// Halaman utama User Role Management
export default function UserRolePage() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userOptions, setUserOptions] = useState<{ user_id: number; username: string }[]>([]);
  const [roleOptions, setRoleOptions] = useState<{ role_id: number; role_name: string }[]>([]); // State untuk role options
  const [user_id, setUserId] = useState<number | ''>('');
  const [role_id, setRoleId] = useState<number | ''>('');
  const [editingUserRoleId, setEditingUserRoleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch daftar user roles
    fetch('/api/userrole')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserRoles(data);
        } else {
          console.error('Unexpected data format:', data);
          setUserRoles([]); // Set ke array kosong jika data tidak valid
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user roles:', error);
        setUserRoles([]); // Set ke array kosong jika terjadi error
      });

    // Fetch daftar User ID dan Username
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserOptions(data.map((user: { user_id: number; username: string }) => ({
            user_id: user.user_id,
            username: user.username,
          })));
        } else {
          console.error('Unexpected data format:', data);
          setUserOptions([]);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user options:', error);
        setUserOptions([]);
      });

    // Fetch daftar Roles (role_id dan role_name)
    fetch('/api/role')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRoleOptions(data);
        } else {
          console.error('Unexpected data format:', data);
          setRoleOptions([]);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch role options:', error);
        setRoleOptions([]);
      });
  }, []);

  const handleAddUserRole = async () => {
    if (!user_id || !role_id) {
      alert('User ID and Role ID are required');
      return;
    }

    const response = await fetch('/api/userrole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, role_id }),
    });

    if (response.ok) {
      alert('User Role added successfully');
      setUserId(''); 
      setRoleId(''); 
      fetch('/api/userrole')
        .then((res) => res.json())
        .then((data) => setUserRoles(data));
    } else {
      alert('Failed to add user role');
    }
  };

  const handleDeleteUserRole = async (userRoleId: number) => {
    const response = await fetch(`/api/userrole/id?id=${userRoleId}`, { method: 'DELETE' });

    if (response.ok) {
      alert('User Role deleted successfully');
      fetch('/api/userrole')
        .then((res) => res.json())
        .then((data) => setUserRoles(data));
    }
  };

  const handlePrepareEdit = (userRole: UserRole) => {
    setEditingUserRoleId(userRole.userrole_id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingUserRoleId(null);
    setShowModal(false);
  };

  const handleSubmitEdit = async (userId: number, roleId: number) => {
    const response = await fetch(`/api/userrole/id?id=${editingUserRoleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, role_id: roleId }),
    });

    if (response.ok) {
      alert('User Role updated successfully');
      setShowModal(false);
      fetch('/api/userrole')
        .then((res) => res.json())
        .then((data) => setUserRoles(data));
    } else {
      alert('Failed to update user role');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>User Role Management</h1>

      {/* Form untuk menambahkan User Role */}
      <div className={styles.form}>
        <h2>Add New User Role</h2>
        <select
          value={user_id}
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {userOptions.map(({ user_id, username }) => (
            <option key={user_id} value={user_id}>
              {username}
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
        <button onClick={handleAddUserRole}>Add User Role</button>
      </div>

      {/* Tabel User Role */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Role ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((userRole) => (
              <tr key={userRole.userrole_id}>
                <td>{userRole.userrole_id}</td>
                <td>{userRole.user_id}</td>
                <td>{userRole.role_id}</td>
                <td>
                  <button
                    className={styles.tableButton}
                    onClick={() => handlePrepareEdit(userRole)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.tableButton}
                    onClick={() => handleDeleteUserRole(userRole.userrole_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit User Role */}
      <EditUserRoleModal
        showModal={showModal}
        onClose={handleCancelEdit}
        userRoleToEdit={userRoles.find((userRole) => userRole.userrole_id === editingUserRoleId) || null}
        onSubmit={handleSubmitEdit}
        userOptions={userOptions}
        roleOptions={roleOptions}
      />
    </div>
  );
}
