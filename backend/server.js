const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL user
  password: 'omchavan', // Replace with your MySQL password
  database: 'courier_management', // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CREATE: Route to create a new order with customer details
app.post('/api/orders', (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    pickupAddress,
    deliveryAddress,
    totalAmount,
    paymentMethod,
  } = req.body;

  // Validate the input
  if (!name || !email || !phone || !address || !pickupAddress || !deliveryAddress || !totalAmount || !paymentMethod) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the customer already exists
  db.query('SELECT * FROM Customers WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking customer:', err);
      return res.status(500).json({ error: 'Failed to check customer' });
    }

    let customerId;

    // If customer exists, get the customer_id
    if (results.length > 0) {
      customerId = results[0].customer_id;
      console.log(`Existing customer found with ID: ${customerId}`);
      insertOrder(customerId);
    } else {
      // Insert new customer
      db.query(
        'INSERT INTO Customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [name, email, phone, address],
        (err, result) => {
          if (err) {
            console.error('Error inserting customer:', err);
            return res.status(500).json({ error: 'Failed to create customer' });
          }
          customerId = result.insertId;
          console.log(`New customer created with ID: ${customerId}`);
          insertOrder(customerId);
        }
      );
    }

    // Function to insert order
    function insertOrder(customerId) {
      // Automatically fetch a courier_id from the Couriers table
      db.query('SELECT courier_id FROM Couriers ORDER BY RAND() LIMIT 1', (err, courierResults) => { // Randomly select a courier
        if (err || courierResults.length === 0) {
          console.error('Error fetching courier:', err || 'No couriers available');
          return res.status(500).json({ error: 'Failed to fetch courier' });
        }

        const courierId = courierResults[0].courier_id;

        db.query(
          'INSERT INTO Orders (customer_id, courier_id, pickup_address, delivery_address, total_amount) VALUES (?, ?, ?, ?, ?)',
          [customerId, courierId, pickupAddress, deliveryAddress, totalAmount],
          (err, result) => {
            if (err) {
              console.error('Error inserting order:', err);
              return res.status(500).json({ error: 'Failed to create order' });
            }
            const orderId = result.insertId;
            console.log(`Order created with ID: ${orderId}`);

            // Generate a transaction_id (you can customize this logic)
            const transactionId = `TXN${Date.now()}`; // Simple unique transaction ID

            // Insert payment details into the Payments table
            db.query(
              'INSERT INTO Payments (order_id, amount, payment_method, transaction_id) VALUES (?, ?, ?, ?)',
              [orderId, totalAmount, paymentMethod, transactionId],
              (err) => {
                if (err) {
                  console.error('Error inserting payment:', err);
                  return res.status(500).json({ error: 'Failed to create payment' });
                }

                // Insert tracking status into the Tracking table
                db.query(
                  'INSERT INTO Tracking (order_id, current_location, status) VALUES (?, ?, ?)',
                  [orderId, 'shipping yard', 'pending'],
                  (err) => {
                    if (err) {
                      console.error('Error inserting tracking status:', err);
                      return res.status(500).json({ error: 'Failed to create tracking status' });
                    }
                    console.log('Tracking status created successfully');
                    res.status(200).json({ message: 'Order created successfully', orderId });
                  }
                );
              }
            );
          }
        );
      });
    }
  });
});

// READ: Route to get all orders for the admin
app.get('/admin/orders', (req, res) => {
  db.query(
    `SELECT o.order_id, c.name AS customer_name, o.pickup_address, o.delivery_address, o.total_amount, o.status, p.payment_method, p.status AS payment_status
     FROM Orders o
     JOIN Customers c ON o.customer_id = c.customer_id
     JOIN Payments p ON o.order_id = p.order_id`,
    (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      res.status(200).json(results);
    }
  );
});

// UPDATE: Route to update order status
app.put('/admin/update-order-status/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  db.query(
    'UPDATE Orders SET status = ? WHERE order_id = ?',
    [status, orderId],
    (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: 'Failed to update order status' });
      }
      res.status(200).json({ message: 'Order status updated successfully' });
    }
  );
});

// UPDATE: Route to update payment status
app.put('/admin/update-payment-status/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const { payment_status } = req.body;

  db.query(
    'UPDATE Payments SET status = ? WHERE order_id = ?',
    [payment_status, orderId],
    (err, result) => {
      if (err) {
        console.error('Error updating payment status:', err);
        return res.status(500).json({ error: 'Failed to update payment status' });
      }
      res.status(200).json({ message: 'Payment status updated successfully' });
    }
  );
});

// DELETE: Route to delete an order (optional)
app.delete('/admin/delete-order/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  db.query('DELETE FROM Orders WHERE order_id = ?', [orderId], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ error: 'Failed to delete order' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
