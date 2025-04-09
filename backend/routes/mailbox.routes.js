// backend/routes/mailbox.routes.js
const express = require('express');
const mailboxController = require('../controllers/mailbox.controller'); // Import controller
const router = express.Router();

router.get('/', mailboxController.getMailboxes);
router.post('/', mailboxController.createMailbox);
router.get('/:mailboxId/emails/inbox', mailboxController.getInboxEmails); // New route

module.exports = router;