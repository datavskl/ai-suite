// backend/routes/template.routes.js
const express = require('express');
const templateController = require('../controllers/template.controller'); // Import controller
const router = express.Router();

router.get('/', templateController.getTemplates); // Define routes and link to controller functions

module.exports = router;