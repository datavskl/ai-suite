// backend/controllers/mailbox.controller.js
const Mailbox = require('../models/mailbox'); // Import model
const imapService = require('../services/imap-service'); // Import imap service
const mongoose = require('mongoose');


const mailboxController = {
    getMailboxes: async (req, res) => {
        try {
            const mailboxes = await Mailbox.find();
            res.json(mailboxes);
        } catch (error) {
            console.error('Error fetching mailboxes:', error);
            res.status(500).json({ error: 'Failed to fetch mailboxes', details: error.message });
        }
    },

    createMailbox: async (req, res) => {
        try {
            const mailboxData = req.body;
            const newMailbox = new Mailbox(mailboxData);
            const savedMailbox = await newMailbox.save();
            res.status(201).json(savedMailbox);
        } catch (error) {
            console.error('Error creating mailbox:', error);
            res.status(500).json({ error: 'Failed to create mailbox', details: error.message });
        }
    },
    getInboxEmails: async (req, res) => {
        try {
            const { mailboxId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(mailboxId)) {
                return res.status(400).json({ error: 'Invalid mailboxId format' });
            }

            const mailbox = await Mailbox.findById(mailboxId);
            if (!mailbox) {
                return res.status(404).json({ error: 'Mailbox not found' });
            }

            if (!mailbox.imapSettings || !mailbox.imapSettings.auth || !mailbox.imapSettings.auth.user || !mailbox.imapSettings.auth.pass) {
                return res.status(400).json({ error: 'IMAP settings are not properly configured for this mailbox.' });
            }


            const fetchedEmails = await imapService.fetchInboxEmails(mailbox);

            // ---  Saving to DB Logic (Example - Adapt as needed) ---
            const savedEmails = [];
            for (const emailData of fetchedEmails) {
                try {
                    // Check if email already exists (e.g., based on messageId or unique headers) - Important to avoid duplicates!
                    const existingEmail = await Email.findOne({ 'messageId': emailData.messageId, 'folder': 'inbox', 'senderMailboxId': mailboxId }); // Assuming messageId is available in parsed email and Email model

                    if (!existingEmail) {
                        const newEmail = new Email({
                            subject: emailData.subject,
                            body: emailData.text, // or emailData.html if you prefer HTML body
                            from: emailData.from.value[0].address, // Adjust based on mailparser output structure
                            to: emailData.to.value.map(item => item.address).join(', '), // Adjust similarly
                            receivedAt: emailData.date,
                            folder: 'inbox',
                            senderMailboxId: mailboxId,
                            messageId: emailData.messageId // Store messageId if available
                            // ... other fields from emailData you want to save ...
                        });
                        const savedEmail = await newEmail.save();
                        savedEmails.push(savedEmail);
                    } else {
                        console.log(`Email with messageId ${emailData.messageId} already exists in inbox for mailbox ${mailboxId}, skipping save.`);
                        savedEmails.push(existingEmail); // Still include existing email in response if you want to return already present emails.
                    }

                } catch (saveError) {
                    console.error('Error saving email to DB:', saveError, emailData);
                    // Decide how to handle save errors - continue, break, etc.
                }
            }
            // --- End Saving to DB Logic ---


            // Send back saved emails (or existing ones if you included them in savedEmails)
            res.json(savedEmails);


        } catch (error) {
            console.error('Error fetching inbox emails:', error);
            res.status(500).json({ error: 'Failed to fetch inbox emails', details: error.message });
        }
    },
};

module.exports = mailboxController;