import React from 'react';

function AdminDashboardSection() {
  return (
    <div className="drawer drawer-mobile">
      {/* Drawer toggle for mobile view */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-semibold">
            Admin Dashboard
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://placeimg.com/80/80/people" alt="Admin avatar" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between" href="#profile">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a href="#settings">Settings</a>
                </li>
                <li>
                  <a href="#logout">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-6">Welcome, Admin!</h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Total Users</h2>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Active Sessions</h2>
                <p className="text-2xl font-bold">456</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Monthly Revenue</h2>
                <p className="text-2xl font-bold">$78,910</p>
              </div>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Alice Johnson</td>
                    <td>User</td>
                    <td>alice@example.com</td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Bob Smith</td>
                    <td>User</td>
                    <td>bob@example.com</td>
                    <td>
                      <span className="badge badge-warning">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Charlie Davis</td>
                    <td>Moderator</td>
                    <td>charlie@example.com</td>
                    <td>
                      <span className="badge badge-error">Inactive</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-200 text-base-content">
          <li className="menu-title">
            <span>Navigation</span>
          </li>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#users">Users</a>
          </li>
          <li>
            <a href="#reports">Reports</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
          <li className="menu-title">
            <span>Management</span>
          </li>
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#orders">Orders</a>
          </li>
          <li>
            <a href="#analytics">Analytics</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboardSection;
