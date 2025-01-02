import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../context/TableContext';
import { showToast } from '../utils/toast';
import axios from 'axios';
import { motion } from 'framer-motion';

const icons = {
  qrcode: '📱',
  table: '🪑',
  user: '👤',
  users: '👥',
  utensils: '🍽️',
  check: '✅',
  error: '❌'
};

const QRPage = () => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    customerName: '',
    numberOfPeople: ''
  });
  const [loading, setLoading] = useState(false);
  const [tableStatus, setTableStatus] = useState(null);
  const navigate = useNavigate();
  const { setTableData } = useTable();

  const handleTableCheck = async (tableNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customer-session/check/${tableNumber}`);
      if (response.data.isOccupied) {
        setTableStatus({
          isOccupied: true,
          details: response.data.sessionDetails
        });
        showToast.error('This table is currently reserved');
      } else {
        setTableStatus({ isOccupied: false });
      }
    } catch (error) {
      console.error('Error checking table:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'tableNumber' && value) {
      handleTableCheck(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting form...');
      const response = await axios.post(
        'http://localhost:5000/api/customer-session',
        {
          tableNumber: formData.tableNumber.trim(),
          customerName: formData.customerName.trim(),
          numberOfPeople: parseInt(formData.numberOfPeople)
        }
      );

      console.log('Response received:', response.data);

      if (response.data) {
        setTableData({
          ...formData,
          sessionId: response.data._id
        });
        
        console.log('Navigation starting...');
        showToast.success('Welcome to Rapid Dine!');
        navigate('/menu');
        console.log('Navigation complete');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      const errorMessage = error.response?.data?.message || 'Error creating session';
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white text-4xl">{icons.utensils}</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Rapid Dine</h1>
            <p className="text-gray-600">Please enter your details to begin</p>
          </div>

          {tableStatus?.isOccupied && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center mb-2">
                <span className="mr-2">{icons.error}</span>
                <p className="text-red-600 font-medium">Table {formData.tableNumber} is currently reserved</p>
              </div>
              <div className="text-red-500 text-sm">
                <p className="flex items-center">
                  <span className="mr-2">{icons.user}</span>
                  Reserved by: {tableStatus.details.customerName}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">{icons.users}</span>
                  People: {tableStatus.details.numberOfPeople}
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {icons.table}
                </span>
                <input
                  name="tableNumber"
                  type="text"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter table number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {icons.user}
                </span>
                <input
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {icons.users}
                </span>
                <input
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How many people?"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || tableStatus?.isOccupied}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium text-lg transition-all duration-200
                ${loading || tableStatus?.isOccupied 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {loading ? 'Creating Session...' : 'Start Ordering'} {!loading && icons.utensils}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">{icons.qrcode}</span>
              Scan the QR code on your table or enter the table number manually
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRPage; 