import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Store from './Store';
import Admin from './Admin';
import Login from './Login';
import Success from './Success';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  const [cart, setCart] = useState([]); // Estado global del carrito

  const clearCart = () => {
    setCart([]); // Vacía el carrito en toda la app
  };

  return (
    <>
      <Toaster position="top-right" /> 
      <Routes>
        {/* AQUÍ ESTÁ EL TRUCO: Pasamos cart y setCart a Store */}
        <Route path="/" element={<Store cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        {/* Pasamos clearCart a Success */}
        <Route path="/success" element={<Success clearCart={clearCart} />} />
      </Routes>
    </>
  );
}

export default App;