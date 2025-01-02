import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const icons = {
  orders: '📋',
  menu: '🍽️',
  staff: '👥',
  logout: '🚪'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalMenuItems: 0,
    totalStaff: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const DashboardCard = ({ title, value, icon, link }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Link to={link} className="block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
            >
              <span className="mr-2">{icons.logout}</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={icons.orders}
            link="/admin/orders"
          />
          <DashboardCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={icons.orders}
            link="/admin/orders"
          />
          <DashboardCard
            title="Menu Items"
            value={stats.totalMenuItems}
            icon={icons.menu}
            link="/admin/menu"
          />
          <DashboardCard
            title="Staff Members"
            value={stats.totalStaff}
            icon={icons.staff}
            link="/admin/staff"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/orders">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Orders
              </motion.button>
            </Link>
            <Link to="/admin/menu">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Manage Menu
              </motion.button>
            </Link>
            <Link to="/admin/staff">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Manage Staff
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 