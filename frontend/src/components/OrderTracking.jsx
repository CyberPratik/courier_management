import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5003/api/orders/${orderId}`);
      setOrderDetails(response.data);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Order not found. Please check the order ID.');
      } else {
        setError('Failed to fetch order details. Please try again later.');
      }
      setOrderDetails(null);
    }
  };

  return (
    <div className="p-4">
      <h3>Track Your Order</h3>
      <Form onSubmit={handleTrackOrder}>
        <Form.Group controlId="orderId">
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Track Order
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {orderDetails && (
        <div className="mt-4">
          <h5>Order Details</h5>
          <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
          <p><strong>Current Location:</strong> {orderDetails.current_location}</p>
          <p><strong>Status:</strong> {orderDetails.tracking_status}</p>
          <p><strong>Delivery Address:</strong> {orderDetails.delivery_address}</p>
          <p><strong>Total Amount:</strong> {orderDetails.total_amount}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
