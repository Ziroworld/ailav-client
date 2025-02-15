import React, { useState } from 'react';
import { Search, Filter, Upload, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteUser } from '../../../server/admin-api'; // Adjust the path as needed
import useUsers from '../../../hooks/useUser.jsx'; // Adjust the path as needed

const UserSection = () => {
  const { users, setUsers, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Safely filter based on the keys returned from your backend.
  const filteredUsers = users.filter(user =>
    Object.values(user)
      .filter(val => val !== null && val !== undefined)
      .some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm opacity-70">Manage and monitor user accounts</p>
        </div>
        <div className="flex gap-2">
          <button className="btn bg-black text-white hover:bg-gray-800 w-full md:w-auto">
            <Upload size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="hidden md:table-cell">Phone</th>
              <th className="hidden lg:table-cell">Role</th>
              <th className="hidden lg:table-cell">Username</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="hidden md:table-cell">{user.phone}</td>
                <td className="hidden lg:table-cell">{user.role}</td>
                <td className="hidden lg:table-cell">{user.username}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete(user)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
          </select>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="join-item btn btn-sm">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button className="btn" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSection;
