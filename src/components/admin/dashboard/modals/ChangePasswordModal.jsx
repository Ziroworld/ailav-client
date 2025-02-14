import React from 'react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Change Password</h3>
        <form className="py-4 space-y-4">
          <div className="form-control">
            <label className="label">Enter your verified email id</label>
            <input type="email" className="input input-bordered" />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn btn-primary">Submit</button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ChangePasswordModal;
