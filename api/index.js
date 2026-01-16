const express = require('express');
const app = express();

// Import all routes
// Note: Adjust paths as needed based on actual file locations
app.use('/api/auth', require('../backend/src/routes/auth'));
app.use('/api/products', require('../backend/src/routes/products'));
app.use('/api/orders', require('../backend/src/routes/orders'));
app.use('/api/admin', require('../backend/src/routes/admin'));

module.exports = app;
