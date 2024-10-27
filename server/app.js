require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const db = require('./utils/db');
const cors = require('cors'); 
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const deleteOldNotifications = require('./jobs/deleteOldNotifications');

app.use(cors());

// Parse incoming request bodies as JSON
app.use(express.json());  // Using express's built-in JSON parser

// Custom middleware to log request paths
app.use((req, res, next) => {
    console.log(`Received request for: ${req.method} ${req.path}`);
    next();
});

// All routes
app.use('/', routes);

cron.schedule('0 0 * * *', deleteOldNotifications);

// Start the server
app.listen(PORT, () => {
    db();
    console.log(`Server running at port ${PORT}`);
});
