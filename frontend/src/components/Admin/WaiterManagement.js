import React, { useState, useEffect } from 'react';
import { waiterApi } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import PageLoader from '../common/PageLoader';
import useAsync from '../../hooks/useAsync';
import { showToast } from '../../utils/toast';

const WaiterManagement = () => {
  const [waiters, setWaiters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    assignedTables: '',
    shift: 'day'
  });

  const {
    loading: fetchLoading,
    error: fetchError,
    execute: fetchWaiters
  } = useAsync(async () => {
    const response = await waiterApi.getAllWaiters();
    setWaiters(response.data);
  });

  const {
    loading: saveLoading,
    error: saveError,
    execute: saveWaiter
  } = useAsync(async (waiterData) => {
    if (editingWaiter) {
      await waiterApi.updateWaiter(editingWaiter.id, waiterData);
    } else {
      await waiterApi.createWaiter(waiterData);
    }
    await fetchWaiters();
  });

  const {
    loading: deleteLoading,
    error: deleteError,
    execute: deleteWaiter
  } = useAsync(async (waiterId) => {
    await waiterApi.deleteWaiter(waiterId);
    await fetchWaiters();
  });

  useEffect(() => {
    fetchWaiters();
  }, [fetchWaiters]);

  if (fetchLoading && waiters.length === 0) {
    return <PageLoader />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveWaiter(formData);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving waiter:', error);
    }
  };

  const handleEdit = (waiter) => {
    setEditingWaiter(waiter);
    setFormData({
      name: waiter.name,
      email: waiter.email,
      phone: waiter.phone,
      status: waiter.status,
      assignedTables: waiter.assignedTables,
      shift: waiter.shift
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (waiterId) => {
    if (window.confirm('Are you sure you want to remove this waiter?')) {
      const loadingToast = showToast.loading('Removing waiter...');
      try {
        await waiterApi.deleteWaiter(waiterId);
        await fetchWaiters();
        showToast.success('Waiter removed successfully');
      } catch (error) {
        showToast.error(error.message || 'Failed to remove waiter');
      } finally {
        showToast.dismiss(loadingToast);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWaiter(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'active',
      assignedTables: '',
      shift: 'day'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'break':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (waiterId, newStatus) => {
    const loadingToast = showToast.loading('Updating waiter status...');
    try {
      await waiterApi.updateStatus(waiterId, newStatus);
      await fetchWaiters();
      showToast.success(`Waiter status updated to ${newStatus}`);
    } catch (error) {
      showToast.error(error.message || 'Failed to update waiter status');
    } finally {
      showToast.dismiss(loadingToast);
    }
  };

  const handleDeleteWaiter = async (waiterId) => {
    if (window.confirm('Are you sure you want to delete this waiter?')) {
      try {
        await handleDelete(waiterId);
      } catch (error) {
        console.error('Error deleting waiter:', error);
      }
    }
  };

  const handleWaiterStatusChange = async (waiterId, status) => {
    try {
      await handleStatusChange(waiterId, status);
    } catch (error) {
      console.error('Error updating waiter status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {fetchError && (
        <ErrorMessage 
          message={fetchError} 
          onRetry={fetchWaiters}
        />
      )}

      {saveError && (
        <ErrorMessage 
          message={saveError}
        />
      )}

      {deleteError && (
        <ErrorMessage 
          message={deleteError}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Waiter Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          disabled={saveLoading}
        >
          {saveLoading ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Adding...</span>
            </div>
          ) : (
            'Add New Waiter'
          )}
        </button>
      </div>

      {/* Waiters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {waiters.map((waiter) => (
          <div key={waiter.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{waiter.name}</h3>
                  <p className="text-sm text-gray-500">{waiter.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(waiter.status)}`}>
                  {waiter.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{waiter.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Tables</p>
                  <p className="font-medium">{waiter.assignedTables}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shift</p>
                  <p className="font-medium capitalize">{waiter.shift}</p>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Active Orders</span>
                    <span className="font-medium">{waiter.activeOrders}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Orders Served</span>
                    <span className="font-medium">{waiter.performance.ordersServed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rating</span>
                    <span className="font-medium">{waiter.performance.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(waiter)}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteWaiter(waiter.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingWaiter ? 'Edit Waiter' : 'Add New Waiter'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="busy">Busy</option>
                  <option value="break">On Break</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Tables</label>
                <input
                  type="text"
                  name="assignedTables"
                  value={formData.assignedTables}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 2, 3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shift</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={saveLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">
                        {editingWaiter ? 'Saving...' : 'Adding...'}
                      </span>
                    </div>
                  ) : (
                    editingWaiter ? 'Save Changes' : 'Add Waiter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterManagement;
