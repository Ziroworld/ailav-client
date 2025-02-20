import React from 'react';

const DeleteModal = ({ onClose }) => {
  const handleDelete = () => {
    // TODO: Add API call to delete the account
    console.log("Account deletion confirmed");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Delete Account</h2>
        <p className="mb-4">Are you sure you want to delete your account?</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
