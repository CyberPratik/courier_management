import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Dropdown, Button } from 'react-bootstrap';
import axios from 'axios';


const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5003/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5003/admin/update-order-status/${orderId}`, { status });
      // Update the local state for the order's status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    try {
      await axios.put(`http://localhost:5003/admin/update-payment-status/${orderId}`, { payment_status: paymentStatus });
      // Update the local state for the payment status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, payment_status: paymentStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleViewDetails = (orderId) => {
    // Redirect to the order details page if required
    console.log('View details for Order ID:', orderId);
  };

  return (
    <div className="dashboard-container">
      <Row>
        <Col md={4}>
          <Card className="info-card">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text>{orders.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card">
            <Card.Body>
              <Card.Title>Total Couriers</Card.Title>
              <Card.Text>{orders.length}</Card.Text> {/* Total couriers equal to the number of orders */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card">
            <Card.Body>
              <Card.Title>Pending Payments</Card.Title>
              <Card.Text>{orders.filter(order => order.payment_status === 'pending').length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="order-card">
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              {orders.map((order) => (
                <Card key={order.order_id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <p><strong>Order ID:</strong> {order.order_id}</p>
                        <p><strong>Customer:</strong> {order.customer_name}</p>
                        <p><strong>Pickup:</strong> {order.pickup_address}</p>
                        <p><strong>Delivery:</strong> {order.delivery_address}</p>
                      </Col>
                      <Col md={4}>
                        <div className="d-flex flex-column">
                          <Dropdown onSelect={(status) => handleStatusChange(order.order_id, status)} className="mb-2">
                            <Dropdown.Toggle variant="info" className="w-100">Status: {order.status}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                              <Dropdown.Item eventKey="in transit">In Transit</Dropdown.Item>
                              <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          <Dropdown onSelect={(paymentStatus) => handlePaymentStatusChange(order.order_id, paymentStatus)}>
                            <Dropdown.Toggle variant="warning" className="w-100">Payment: {order.payment_status}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                              <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button variant="primary" onClick={() => handleViewDetails(order.order_id)}>View Details</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
