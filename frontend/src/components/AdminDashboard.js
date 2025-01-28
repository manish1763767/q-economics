import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/admin/tests">Manage Tests</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
