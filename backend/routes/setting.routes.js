// backend/routes/setting.routes.js
const express = require('express');
const settingController = require('../controllers/setting.controller'); // Import controller
const router = express.Router();

router.get('/', settingController.getSettings);
router.post('/', settingController.updateSettings);

module.exports = router;