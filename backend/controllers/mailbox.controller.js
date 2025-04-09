// backend/controllers/mailbox.controller.js
const Mailbox = require('../models/mailbox');
const imapService = require('../services/imap-service'); // If you have imap service
const mongoose = require('mongoose');
const Email = require('../models/email'); // Make sure Email model is imported

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
            const newMailbox = new Mailbox(mailboxData); // Create Mailbox directly from request body
            const savedMailbox = await newMailbox.save();
            res.status(201).json(savedMailbox);
        } catch (error) {
            console.error('Error creating mailbox:', error);
            res.status(500).json({ error: 'Failed to create mailbox', details: error.message });
        }
    },

    updateMailbox: async (req, res) => {
        try {
            const { mailboxId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(mailboxId)) {
                return res.status(400).json({ error: 'Invalid mailboxId format' });
            }

            const mailboxData = req.body;

            const updatedMailbox = await Mailbox.findByIdAndUpdate(mailboxId, mailboxData, {
                new: true, // Return the modified document rather than the original
                runValidators: true // Ensure schema validation is run
            });

            if (!updatedMailbox) {
                return res.status(404).json({ error: 'Mailbox not found' });
            }

            res.json(updatedMailbox);
        } catch (error) {
            console.error('Error updating mailbox:', error);
            res.status(500).json({ error: 'Failed to update mailbox', details: error.message });
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

            if (!mailbox.imapServerName || !mailbox.imapPort || !mailbox.imapUsername || !mailbox.imapPassword) {
                return res.status(400).json({ error: 'IMAP settings are incomplete for this mailbox.' });
            }

            console.log("Fetching inbox emails for mailbox:", mailbox.mailboxName, mailboxId); // Log before fetching
            const fetchedEmails = await imapService.fetchInboxEmails(mailbox);
            console.log("Fetched emails (before processing):", fetchedEmails); // Log fetchedEmails value

            if (!Array.isArray(fetchedEmails)) { // Check if fetchedEmails is an array
                console.error("Error: fetchedEmails is NOT an array:", fetchedEmails);
                return res.status(500).json({ error: 'Fetched emails is not an array', details: 'imapService.fetchInboxEmails did not return an array.' });
            }


            // ---  Saving to DB Logic (Example - Adapt as needed) ---
            const savedEmails = [];
            for (const emailData of fetchedEmails) { // This is where the error occurs if fetchedEmails is not iterable
                try {
                    // Check if email already exists (e.g., based on messageId or unique headers) - Important to avoid duplicates!
                    const existingEmail = await Email.findOne({ 'messageId': emailData.messageId, 'folder': 'inbox', 'senderMailboxId': mailboxId }); // Assuming messageId is available in parsed email and Email model

                    if (!existingEmail) {
                        if (emailData && emailData.from && emailData.from.value && emailData.from.value[0]) {
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
                            console.warn("Skipping email save due to missing or invalid 'from' data:", emailData);
                        }
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

            res.json(savedEmails);


        } catch (error) {
            console.error('Error fetching inbox emails:', error);
            res.status(500).json({ error: 'Failed to fetch inbox emails', details: error.message });
        }
    },

    // ... rest of controller functions ...
};

module.exports = mailboxController;