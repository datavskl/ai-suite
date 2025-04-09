// backend/routes/lead.routes.js
const express = require('express');
const leadController = require('../controllers/lead.controller'); // Import controller
const router = express.Router();

router.get('/', leadController.getLeads); // Define routes and link to controller functions

module.exports = router;