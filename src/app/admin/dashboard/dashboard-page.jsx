import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboardSection from '../../../components/admin/dashboard/dashboard.section';

function DashboardPage () {
    return (
        <AdminDashboardSection>
          <Outlet /> 
        </AdminDashboardSection>
      );
}

export default DashboardPage;