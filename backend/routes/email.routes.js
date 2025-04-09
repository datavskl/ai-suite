// backend/routes/email.routes.js
const express = require('express');
const emailController = require('../controllers/email.controller'); // Import controller
const router = express.Router();

router.post('/draft-with-gemini', emailController.draftEmailWithGemini);
router.post('/send', emailController.sendEmail);
router.post('/save-draft', emailController.saveDraft);
router.get('/sent', emailController.getSentEmails);
router.get('/mailboxes/:mailboxId/emails/:folder', emailController.getEmailsByFolder); // Modified path

module.exports = router;