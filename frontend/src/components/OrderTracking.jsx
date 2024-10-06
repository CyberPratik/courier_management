import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import '../styles/OrderTracking.css'; // Make sure to create this CSS file

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    try {
      console.log(`Fetching details for order ID: ${orderId}`); // Debugging log

      // Fetch order details from the tracking API
      const response = await axios.get(`http://localhost:5003/api/tracking/${orderId}`);
      console.log('Response from server:', response.data); // Debugging log

      // Set the order details to state
      setOrderDetails(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching order details:', err); // Debugging log
      setOrderDetails(null);
      setError('Order not found. Please check your Order ID.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Track Your Order</h2>
      <Form onSubmit={handleTrackOrder} className="mb-4">
        <Form.Group controlId="formOrderId">
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Track Order</Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {orderDetails && (
        <Card className="mt-4 shadow-sm">
          <Card.Body>
            <Card.Title>Order Details</Card.Title>
            <Card.Text>
              <strong>Customer Name:</strong> {orderDetails.customer_name}<br />
              <strong>Contact Number:</strong> {orderDetails.customer_number}<br />
              <strong>Delivery Address:</strong> {orderDetails.delivery_address}<br />
              <strong>Total Amount:</strong> ₹{typeof orderDetails.total_amount === 'number' ? orderDetails.total_amount.toFixed(2) : 'N/A'}<br />
              <strong>Current Location:</strong> {orderDetails.current_location || 'Not Available'}<br />
              <strong>Status:</strong> {orderDetails.tracking_status || 'Pending'}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;
