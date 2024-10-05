import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);

  // Fetch orders and couriers data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5003/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchCouriers = async () => {
      // Fetch couriers data from your API if you have one.
      // Placeholder for courier fetching logic if needed.
      const sampleCouriers = [
        { courier_id: 1, name: 'Courier A', vehicle_type: 'Bike' },
        { courier_id: 2, name: 'Courier B', vehicle_type: 'Van' },
        { courier_id: 3, name: 'Courier C', vehicle_type: 'Truck' },
      ];
      setCouriers(sampleCouriers);
    };

    fetchOrders();
    fetchCouriers();
    
    // Optionally, set an interval to fetch orders every few seconds for live updates
    const interval = setInterval(fetchOrders, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5003/admin/update-order-status/${orderId}`, { status });
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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, payment_status: paymentStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleVehicleTypeChange = async (orderId, vehicleType) => {
    // If you have a way to update the vehicle type in the database, implement it here.
    // For now, this just updates the local state.
    const updatedOrders = orders.map((order) =>
      order.order_id === orderId ? { ...order, vehicle_type: vehicleType } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="p-4">
      <h3>Admin Dashboard</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Pickup Address</th>
            <th>Delivery Address</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Vehicle Type</th>
            <th>Courier Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const courier = couriers.find(c => c.courier_id === order.courier_id);
            return (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.pickup_address}</td>
                <td>{order.delivery_address}</td>
                <td>{order.total_amount}</td>
                <td>{order.payment_method}</td>
                <td>{order.order_date}</td>
                <td>
                  <Dropdown onSelect={(status) => handleStatusChange(order.order_id, status)}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {order.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                      <Dropdown.Item eventKey="in transit">In Transit</Dropdown.Item>
                      <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Dropdown onSelect={(paymentStatus) => handlePaymentStatusChange(order.order_id, paymentStatus)}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {order.payment_status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                      <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Dropdown onSelect={(vehicleType) => handleVehicleTypeChange(order.order_id, vehicleType)}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {order.vehicle_type}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Bike">Bike</Dropdown.Item>
                      <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
                      <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>{courier ? courier.name : 'Unknown'}</td>
                <td>
                  <Button variant="primary">View Details</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
