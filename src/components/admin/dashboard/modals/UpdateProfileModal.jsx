import React from 'react';

const UpdateProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Update Profile</h3>
        <form className="py-4 space-y-4">
          <div className="form-control">
            <label className="label">Profile Image</label>
            <input type="file" className="file-input file-input-bordered w-full" />
          </div>
          <div className="form-control">
            <label className="label">Username</label>
            <input type="text" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Full Name</label>
            <input type="text" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Email</label>
            <input type="email" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Age</label>
            <input type="number" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Phone</label>
            <input type="tel" className="input input-bordered" />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn btn-primary">Update</button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default UpdateProfileModal;
