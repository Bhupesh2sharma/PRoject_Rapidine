import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { showToast } from '../../utils/toast';

const icons = {
  back: '←',
  add: '➕',
  edit: '✏️',
  delete: '🗑️',
  save: '💾',
  cancel: '❌'
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // First try the test route
      const testResponse = await axios.get('http://localhost:5000/test-menu');
      console.log('Test response:', testResponse.data);

      // Then try the actual menu route
      const response = await axios.get('http://localhost:5000/api/menu');
      console.log('Menu response:', response.data);
      
      if (Array.isArray(response.data)) {
        setMenuItems(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        showToast.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      showToast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Adding new menu item:', newItem);
      const response = await axios.post(
        'http://localhost:5000/api/menu',
        newItem,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Menu item added:', response.data);
      showToast.success('Menu item added successfully');
      setNewItem({ name: '', description: '', price: '', category: '', image: '' });
      setShowAddForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error adding menu item:', error);
      showToast.error('Failed to add menu item');
    }
  };

  const handleUpdateItem = async (itemId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/menu/${itemId}`,
        editingItem,
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
      );
      showToast.success('Menu item updated successfully');
      setEditingItem(null);
      fetchMenuItems();
    } catch (error) {
      showToast.error('Failed to update menu item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/menu/${itemId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
        );
        showToast.success('Menu item deleted successfully');
        fetchMenuItems();
      } catch (error) {
        showToast.error('Failed to delete menu item');
      }
    }
  };

  const MenuItemForm = ({ item, onSubmit, onCancel, isNew = false }) => (
    <form onSubmit={onSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => isNew 
            ? setNewItem({ ...newItem, name: e.target.value })
            : setEditingItem({ ...editingItem, name: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={item.description}
          onChange={(e) => isNew
            ? setNewItem({ ...newItem, description: e.target.value })
            : setEditingItem({ ...editingItem, description: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => isNew
              ? setNewItem({ ...newItem, price: e.target.value })
              : setEditingItem({ ...editingItem, price: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={item.category}
            onChange={(e) => isNew
              ? setNewItem({ ...newItem, category: e.target.value })
              : setEditingItem({ ...editingItem, category: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          value={item.image}
          onChange={(e) => isNew
            ? setNewItem({ ...newItem, image: e.target.value })
            : setEditingItem({ ...editingItem, image: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-700"
        >
          {icons.cancel} Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {icons.save} Save
        </button>
      </div>
    </form>
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
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {icons.add} Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showAddForm && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
            <MenuItemForm
              item={newItem}
              onSubmit={handleAddItem}
              onCancel={() => setShowAddForm(false)}
              isNew
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {editingItem?.id === item._id ? (
                <MenuItemForm
                  item={editingItem}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateItem(item._id);
                  }}
                  onCancel={() => setEditingItem(null)}
                />
              ) : (
                <>
                  <img
                    src={item.image || '/default-food-image.jpg'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                        {item.category}
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => setEditingItem({ ...item, id: item._id })}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {icons.edit}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          {icons.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
