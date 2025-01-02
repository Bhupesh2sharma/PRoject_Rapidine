import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { motion } from 'framer-motion';

const icons = {
  success: '✅',
  table: '🪑',
  user: '👤',
  time: '⏰',
  waiter: '👨‍🍳',
  menu: '📋',
  order: '🧾'
};

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableData } = useTable();
  const [orderDetails] = useState(location.state?.orderDetails || {});
  const [estimatedTime] = useState('15-20');
  const [assignedWaiter] = useState('John');

  useEffect(() => {
    if (!location.state?.orderDetails) {
      navigate('/menu');
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-green-500 text-white p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-3xl">{icons.success}</span>
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p>Your order has been successfully placed</p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <span className="mr-2">{icons.table}</span>
                <span>Table {tableData.tableNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{icons.user}</span>
                <span>{tableData.customerName}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{icons.time}</span>
                <span>Estimated Time: {estimatedTime} minutes</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{icons.waiter}</span>
                <span>Assigned Waiter: {assignedWaiter}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">{icons.order}</span>
                Order Summary
              </h2>
              <div className="space-y-4">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Amount</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/menu')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="mr-2">{icons.menu}</span>
                Return to Menu
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
