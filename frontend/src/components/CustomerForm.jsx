import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pickupAddress: '',
    deliveryAddress: '',
    paymentMethod: 'credit card',
    totalAmount: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit the form data without the courier ID
      const response = await axios.post('http://localhost:5003/api/orders', formData);
      console.log(response.data);
      setSubmissionStatus('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting the order:', error);
      const errorMessage = error.response?.data?.error || 'Error submitting the order. Please try again.';
      setSubmissionStatus(errorMessage);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4">
      <h3>Customer Details</h3>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formPhone" className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formAddress" className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          name="address"
          placeholder="Enter address"
          rows={2}
          value={formData.address}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <h3>Order Details</h3>
      <Form.Group controlId="formPickupAddress" className="mb-3">
        <Form.Label>Pickup Address</Form.Label>
        <Form.Control
          as="textarea"
          name="pickupAddress"
          placeholder="Enter pickup address"
          rows={2}
          value={formData.pickupAddress}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDeliveryAddress" className="mb-3">
        <Form.Label>Delivery Address</Form.Label>
        <Form.Control
          as="textarea"
          name="deliveryAddress"
          placeholder="Enter delivery address"
          rows={2}
          value={formData.deliveryAddress}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formTotalAmount" className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control
          type="number"
          name="totalAmount"
          placeholder="Enter total amount"
          value={formData.totalAmount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <h3>Payment Details</h3>
      <Form.Group controlId="formPaymentMethod" className="mb-3">
        <Form.Label>Payment Method</Form.Label>
        <Form.Select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="credit card">Credit Card</option>
          <option value="debit card">Debit Card</option>
          <option value="net banking">Net Banking</option>
          <option value="cash on delivery">Cash on Delivery</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>

      {submissionStatus && (
        <p className={submissionStatus.includes('Error') ? 'text-danger' : 'text-success'}>
          {submissionStatus}
        </p>
      )}
    </Form>
  );
};

export default CustomerForm;
