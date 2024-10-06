import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerForm from './components/CustomerForm';
import AdminDashboard from './components/AdminDashboard';
import OrderTracking from './components/OrderTracking';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler me-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand" to="/">
              Courier Management System
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Customer Form
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/track-order">
                  Track Order
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<CustomerForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
