import { Routes, Route, Navigate } from 'react-router-dom';
import Store from './Store';
import Admin from './Admin';
import Login from './Login';
import { Toaster } from 'react-hot-toast'; // Importación necesaria para las burbujas de texto
import Success from './Success';
// 1. Definimos la función de protección fuera de App para que esté ordenada
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      {/* 2. El Toaster debe estar aquí para que funcione en toda la página */}
      <Toaster position="top-right" reverseOrder={false} /> 

      <Routes>
        {/* Ruta pública para clientes */}
        <Route path="/" element={<Store />} />
        
        {/* Ruta para el acceso de administrador */}
        <Route path="/login" element={<Login />} />
        
        {/* 🔒 Ruta protegida: Solo accesible si hay sesión iniciada */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
}

export default App;