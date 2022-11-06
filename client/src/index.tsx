import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
        
        </Route>
        <Route path="/about">
          
        </Route>
        <Route path="/post">
          
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);