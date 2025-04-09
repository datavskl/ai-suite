const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Email = require('../models/email'); // Corrected path to model

const imapService = {
    fetchInboxEmails: async (mailbox) => {
        // ... (rest of the imap-service.js code from previous response) ...
    },
};

module.exports = imapService;