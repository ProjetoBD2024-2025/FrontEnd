import './index.css';
import React from 'react';
import AppRoutes from './routers';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <React.StrictMode>
      <AppRoutes />
      <ToastContainer />
    </React.StrictMode>
  )
}

export default App
