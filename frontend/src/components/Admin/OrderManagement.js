import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { showToast } from '../../utils/toast';

const icons = {
  back: '←',
  pending: '⏳',
  preparing: '👨‍🍳',
  ready: '✅',
  delivered: '🚀',
  cancelled: '❌',
  refresh: '🔄',
  table: '🪑',
  time: '⏰',
  money: '💰'
};

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch orders initially and set up refresh interval
  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    setRefreshInterval(interval);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching orders...'); // Debug log
      
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Orders response:', response.data); // Debug log
      
      if (Array.isArray(response.data)) {
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        console.error('Invalid response format:', response.data);
        showToast.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
      }
      showToast.error('Failed to fetch orders');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
      );
      showToast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      showToast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' ? true : order.status.toLowerCase() === filter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center">
              <span className="mr-2">{icons.back}</span>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Order Management</h1>
            <button
              onClick={handleManualRefresh}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              <span className="mr-2">{icons.refresh}</span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(order => order.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600">Preparing</h3>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(order => order.status === 'preparing').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600">Ready for Delivery</h3>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(order => order.status === 'ready').length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors
                ${filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {icons[order.status.toLowerCase()]} {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center">
                    <span className="mr-2">{icons.table}</span>
                    Table: {order.tableNumber}
                  </p>
                  <p className="text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-gray-600 flex items-center">
                    <span className="mr-2">{icons.time}</span>
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="flex justify-end">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={order.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-600">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>Total Amount</span>
                    <span className="flex items-center">
                      <span className="mr-2">{icons.money}</span>
                      ₹{calculateTotal(order.items)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
