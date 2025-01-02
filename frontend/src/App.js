import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import QRPage from './components/QRPage';
import Menu from './components/Customer/Menu';
import Cart from './components/Customer/Cart';
import OrderConfirmation from './components/Customer/OrderConfirmation';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrderManagement from './components/Admin/OrderManagement';
import MenuManagement from './components/Admin/MenuManagement';
import StaffManagement from './components/Admin/StaffManagement';

function App() {
  return (
    <Router>
      <TableProvider>
        <CartProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<QRPage />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/menu" element={<MenuManagement />} />
              <Route path="/admin/staff" element={<StaffManagement />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </TableProvider>
    </Router>
  );
}

export default App;
