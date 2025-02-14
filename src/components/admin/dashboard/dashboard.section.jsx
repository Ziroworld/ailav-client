import React, { useState } from "react";
import Header from "./header.jsx";
import UpdateProfileModal from "./modals/UpdateProfileModal.jsx";
import DeleteAccountModal from "./modals/DeleteAccountModal.jsx";
import ChangePasswordModal from "./modals/ChangePasswordModal.jsx";
import { Outlet } from "react-router-dom";

function AdminDashboardSection() {
  const [openModal, setOpenModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleModal = (type) => setOpenModal(type);
  const closeModal = () => setOpenModal(null);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-base-200">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          <Outlet /> {/* ✅ Child Components Render Here */}
        </div>
      </div>

      {/* Modals */}
      <UpdateProfileModal isOpen={openModal === "update"} onClose={closeModal} />
      <DeleteAccountModal isOpen={openModal === "delete"} onClose={closeModal} />
      <ChangePasswordModal isOpen={openModal === "changePassword"} onClose={closeModal} />
    </div>
  );
}

export default AdminDashboardSection;
