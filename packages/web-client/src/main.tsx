// packages/web-client/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // <-- Bước 1: Import component App
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BrowserRouter là component bắt buộc để React Router hoạt động */}
    <BrowserRouter>
      <UserProvider>
        <App /> {/* <-- Bước 2: Gọi component App ra để render */}
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);