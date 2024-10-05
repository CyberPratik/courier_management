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
      console.log(`Fetching details for order ID: ${orderId}`); // Debugging log

      // Fetch order details from the backend API
      const response = await axios.get(`http://localhost:5003/api/orders/${orderId}`);
      console.log('Response from server:', response.data); // Debugging log

      const orderData = response.data;

      // Set order details
      setOrderDetails({
        order_id: orderData.order_id,
        tracking_id: orderData.tracking_id, // Assuming this field is returned
        customer_name: orderData.customer_name, // Assuming this field is returned
        customer_number: orderData.customer_number, // Assuming this field is returned
        current_location: orderData.current_location,
        tracking_status: orderData.tracking_status || 'pending', // Set default to 'pending'
        delivery_address: orderData.delivery_address,
        total_amount: orderData.total_amount,
      });
      setError('');
    } catch (err) {
      console.log('Error fetching order details:', err); // Debugging log
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
          <p><strong>Tracking ID:</strong> {orderDetails.tracking_id}</p>
          <p><strong>Customer Name:</strong> {orderDetails.customer_name}</p>
          <p><strong>Customer Number:</strong> {orderDetails.customer_number}</p>
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
