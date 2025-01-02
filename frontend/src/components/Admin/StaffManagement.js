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
  cancel: '❌',
  staff: '👤',
  active: '✅',
  inactive: '❌'
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
    status: 'active'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/staff', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setStaff(response.data);
    } catch (error) {
      showToast.error('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/admin/staff',
        newStaff,
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
      );
      showToast.success('Staff member added successfully');
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        role: 'waiter',
        status: 'active'
      });
      setShowAddForm(false);
      fetchStaff();
    } catch (error) {
      showToast.error('Failed to add staff member');
    }
  };

  const handleUpdateStaff = async (staffId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/staff/${staffId}`,
        editingStaff,
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
      );
      showToast.success('Staff member updated successfully');
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      showToast.error('Failed to update staff member');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/staff/${staffId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }}
        );
        showToast.success('Staff member deleted successfully');
        fetchStaff();
      } catch (error) {
        showToast.error('Failed to delete staff member');
      }
    }
  };

  const StaffForm = ({ data, onSubmit, onCancel, isNew = false }) => (
    <form onSubmit={onSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => isNew 
            ? setNewStaff({ ...newStaff, name: e.target.value })
            : setEditingStaff({ ...editingStaff, name: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => isNew
            ? setNewStaff({ ...newStaff, email: e.target.value })
            : setEditingStaff({ ...editingStaff, email: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => isNew
            ? setNewStaff({ ...newStaff, phone: e.target.value })
            : setEditingStaff({ ...editingStaff, phone: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={data.role}
          onChange={(e) => isNew
            ? setNewStaff({ ...newStaff, role: e.target.value })
            : setEditingStaff({ ...editingStaff, role: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="waiter">Waiter</option>
          <option value="chef">Chef</option>
          <option value="manager">Manager</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={data.status}
          onChange={(e) => isNew
            ? setNewStaff({ ...newStaff, status: e.target.value })
            : setEditingStaff({ ...editingStaff, status: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {icons.add} Add Staff
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showAddForm && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Staff Member</h2>
            <StaffForm
              data={newStaff}
              onSubmit={handleAddStaff}
              onCancel={() => setShowAddForm(false)}
              isNew
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {editingStaff?.id === member._id ? (
                <StaffForm
                  data={editingStaff}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateStaff(member._id);
                  }}
                  onCancel={() => setEditingStaff(null)}
                />
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center">
                        {icons.staff} {member.name}
                      </h3>
                      <p className="text-gray-600">{member.email}</p>
                      <p className="text-gray-600">{member.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status === 'active' ? icons.active : icons.inactive} {member.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                      {member.role}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingStaff({ ...member, id: member._id })}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {icons.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        {icons.delete}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement; 