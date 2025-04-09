// backend/routes/mailbox.routes.js
const express = require('express');
const mailboxController = require('../controllers/mailbox.controller');
const router = express.Router();

router.get('/', mailboxController.getMailboxes);
router.post('/', mailboxController.createMailbox);
router.put('/:mailboxId', mailboxController.updateMailbox); // New PUT route for updating mailbox
router.get('/:mailboxId/emails/inbox', mailboxController.getInboxEmails);

module.exports = router;