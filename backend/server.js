// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Updated path
const leadRoutes = require('./routes/lead.routes'); // New route imports
const templateRoutes = require('./routes/template.routes');
const emailRoutes = require('./routes/email.routes');
const mailboxRoutes = require('./routes/mailbox.routes');
const settingRoutes = require('./routes/setting.routes');

const app = express();
const port = process.env.PORT || 5000; // Use PORT from environment or default

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// --- Mount Routes ---
app.use('/api/leads', leadRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/mailboxes', mailboxRoutes);
app.use('/api/settings', settingRoutes);


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});