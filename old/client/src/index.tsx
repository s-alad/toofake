import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { inject } from '@vercel/analytics';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <>
      {/* vercel analytics */}
      {inject()}

      <Router>
        <App />
      </Router>
    </>
  </React.StrictMode>
);