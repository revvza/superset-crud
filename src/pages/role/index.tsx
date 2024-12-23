import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard.module.css';
import { Role } from '@/lib/type'; // Import interface Role
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

// Komponen Modal untuk Edit Role
function EditRoleModal({
  showModal,
  onClose,
  roleToEdit,
  onSubmit,
}: {
  showModal: boolean;
  onClose: () => void;
  roleToEdit: Role | null;
  onSubmit: (role_id: number, role_name: string, description: string) => void;
}) {
  const [role_name, setRoleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (roleToEdit) {
      setRoleName(roleToEdit.role_name);
      setDescription(roleToEdit.description);
    }
  }, [roleToEdit]);

  const handleSubmit = () => {
    if (role_name && description) {
      onSubmit(roleToEdit?.role_id || 0, role_name, description);
      setRoleName('');
      setDescription('');
    } else {
      alert('Role Name and Description are required');
    }
  };

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Role</h2>
        <input
          type="text"
          placeholder="Role Name"
          value={role_name}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

// Halaman utama Role Management
export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [role_name, setRoleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch daftar roles
    fetch('/api/role')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error('Unexpected data format:', data);
          setRoles([]); // Set ke array kosong jika data tidak valid
        }
      })
      .catch((error) => {
        console.error('Failed to fetch roles:', error);
        setRoles([]); // Set ke array kosong jika terjadi error
      });
  }, []);

  const handleAddRole = async () => {
    if (!role_name || !description) {
      alert('Role Name and Description are required');
      return;
    }

    const response = await fetch('/api/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_name, description }),
    });

    if (response.ok) {
      alert('Role added successfully');
      setRoleName('');
      setDescription('');
      fetch('/api/role')
        .then((res) => res.json())
        .then((data) => setRoles(data));
    } else {
      alert('Failed to add role');
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    const response = await fetch(`/api/role/id?id=${roleId}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Role deleted successfully');
      fetch('/api/role')
        .then((res) => res.json())
        .then((data) => setRoles(data));
    }
  };

  const handlePrepareEdit = (role: Role) => {
    setEditingRoleId(role.role_id);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setShowModal(false);
  };

  const handleSubmitEdit = async (roleId: number, roleName: string, description: string) => {
    const response = await fetch(`/api/role/id?id=${roleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_name: roleName, description }),
    });

    if (response.ok) {
      alert('Role updated successfully');
      setShowModal(false);
      fetch('/api/role')
        .then((res) => res.json())
        .then((data) => setRoles(data));
    } else {
      alert('Failed to update role');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>Role Management</h1>

      {/* Form untuk menambahkan Role */}
      <div className={styles.form}>
        <h2>Add New Role</h2>
        <input
          type="text"
          placeholder="Role Name"
          value={role_name}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddRole}>Add Role</button>
      </div>

      {/* Tabel Role */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.role_id}>
                <td>{role.role_id}</td>
                <td>{role.role_name}</td>
                <td>{role.description}</td>
                <td>
                  <button
                    className={styles.tableButton}
                    onClick={() => handlePrepareEdit(role)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.tableButton}
                    onClick={() => handleDeleteRole(role.role_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit Role */}
      <EditRoleModal
        showModal={showModal}
        onClose={handleCancelEdit}
        roleToEdit={roles.find((role) => role.role_id === editingRoleId) || null}
        onSubmit={handleSubmitEdit}
      />
    </div>
  );
}
