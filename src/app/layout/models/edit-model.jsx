import React, { useState, useContext } from 'react';
import { updateUser } from '../../../server/customer-api.jsx'; // adjust the path as necessary
import { UserContext } from '../../../context/userContext.jsx';

const EditModal = ({ user, onClose }) => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: user?.age || "",
    email: user?.email || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Retrieve the userId from the user object or from localStorage if undefined
      const userId = user?._id || localStorage.getItem("userId");
      const updatedUser = await updateUser(userId, formData);
      setUser(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error updating user:", err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
