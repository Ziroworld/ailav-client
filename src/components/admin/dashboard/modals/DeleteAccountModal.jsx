
import React from 'react';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Account</h3>
        <form className="py-4 space-y-4">
          <p className="text-error">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="form-control">
            <label className="label">Enter your password to confirm</label>
            <input type="password" className="input input-bordered" />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn btn-error">Delete Account</button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteAccountModal;
