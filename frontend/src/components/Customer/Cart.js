import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTable } from '../../context/TableContext';
import { motion } from 'framer-motion';
import { showToast } from '../../utils/toast';
import axios from 'axios';

const icons = {
  back: '←',
  trash: '🗑️',
  plus: '➕',
  minus: '➖',
  cart: '🛒',
  table: '🪑',
  user: '👤',
  users: '👥'
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { tableData } = useTable();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showToast.error('Your cart is empty!');
      return;
    }

    try {
      // Create the order
      const orderData = {
        tableNumber: tableData.tableNumber,
        customerName: tableData.customerName,
        items: cartItems,
        total: calculateTotal()
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('Order created:', response.data); // Debug log

      showToast.success('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation', { 
        state: { orderDetails: response.data }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      showToast.error('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/menu')}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span className="mr-2">{icons.back}</span>
              Back to Menu
            </button>
            <h1 className="text-2xl font-bold">Your Cart {icons.cart}</h1>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="mr-2">{icons.table}</span>
              <span>Table {tableData.tableNumber}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{icons.user}</span>
              <span>{tableData.customerName}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{icons.users}</span>
              <span>{tableData.numberOfPeople} people</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/menu')}
              className="text-blue-600 hover:text-blue-700"
            >
              Return to menu to add items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || '/default-food-image.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-gray-600">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            {icons.minus}
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            {icons.plus}
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          {icons.trash}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-gray-600">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
