import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Faltaba esta importación
import App from './App.jsx';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Envuelve la App aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);