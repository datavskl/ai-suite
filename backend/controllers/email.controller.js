// backend/controllers/email.controller.js
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const geminiService = require('../services/gemini-service'); // Import service
const imapService = require('../services/imap-service'); // Import imap service
const Lead = require('../models/lead'); // Import models
const Template = require('../models/template');
const Email = require('../models/email');
const Mailbox = require('../models/mailbox');


const emailController = {
    draftEmailWithGemini: async (req, res) => {
        try {
            const { leadId, tone, userInstructions, language, templateId } = req.body;

            if (!mongoose.Types.ObjectId.isValid(leadId)) {
                return res.status(400).json({ error: 'Invalid leadId format' });
            }

            const lead = await Lead.findById(leadId);
            const template = templateId ? await Template.findById(templateId) : null;

            if (!lead) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            const prompt = geminiService.createEmailDraftPrompt({
                lead,
                tone,
                userInstructions,
                language,
                template
            });

            const geminiStream = await geminiService.generateEmailDraftStream(prompt);

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            let accumulatedText = "";

            for await (const chunk of geminiStream) {
                const textChunk = chunk.text();
                accumulatedText += textChunk;
                res.write(`data: ${JSON.stringify({ chunk: textChunk, fullDraft: accumulatedText })}\n\n`);
            }
            res.end();

        } catch (error) {
            console.error('Error drafting email with Gemini:', error);
            res.status(500).json({ error: 'Failed to generate email draft', details: error.message });
        }
    },

    sendEmail: async (req, res) => {
        try {
            const { leadId, emailBody, subject, senderMailboxId } = req.body;

            if (!mongoose.Types.ObjectId.isValid(leadId)) {
                return res.status(400).json({ error: 'Invalid leadId format' });
            }
            const lead = await Lead.findById(leadId);
            if (!lead) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            const mailbox = await Mailbox.findById(senderMailboxId);
            if (!mailbox) {
                return res.status(400).json({ error: 'Invalid senderMailboxId' });
            }

            const recipientEmail = lead.email;
            if (!recipientEmail) {
                return res.status(400).json({ error: 'Lead email address not found' });
            }

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recipientEmail,
                subject: subject || "Email Subject",
                text: emailBody,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);

            const savedEmail = new Email({
                subject: mailOptions.subject,
                body: emailBody,
                recipientLeadId: leadId,
                senderMailboxId: senderMailboxId,
                folder: 'sent'
            });
            await savedEmail.save();

            res.status(200).json({ message: 'Email sent and saved successfully', emailInfo: info });

        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send and save email', details: error.message });
        }
    },

    saveDraft: async (req, res) => {
        try {
            const { leadId, emailBody, subject, senderMailboxId } = req.body;

            if (!mongoose.Types.ObjectId.isValid(leadId)) {
                return res.status(400).json({ error: 'Invalid leadId format' });
            }

            const savedEmail = new Email({
                subject: subject || "Draft Email Subject",
                body: emailBody,
                recipientLeadId: leadId,
                senderMailboxId: senderMailboxId,
                folder: 'drafts',
                status: 'draft'
            });
            await savedEmail.save();

            res.status(201).json({ message: 'Email draft saved successfully', email: savedEmail });

        } catch (error) {
            console.error('Error saving email draft:', error);
            res.status(500).json({ error: 'Failed to save email draft', details: error.message });
        }
    },

    getSentEmails: async (req, res) => {
        try {
            const sentEmails = await Email.find({ folder: 'sent' })
                .populate('recipientLeadId', 'name company email')
                .populate('senderMailboxId', 'mailboxName emailAddress')
                .sort({ sentAt: -1 })
                .limit(50);

            res.json(sentEmails);
        } catch (error) {
            console.error('Error fetching sent emails from MongoDB:', error);
            res.status(500).json({ error: 'Failed to fetch sent emails', details: error.message });
        }
    },

    getEmailsByFolder: async (req, res) => {
        try {
            const { mailboxId, folder } = req.params;
            if (!['inbox', 'sent', 'drafts'].includes(folder)) {
                return res.status(400).json({ error: 'Invalid folder name' });
            }

            const emails = await Email.find({ senderMailboxId: mailboxId, folder: folder })
                .populate('recipientLeadId', 'name company email')
                .sort({ sentAt: -1 }) // Or receivedAt for inbox
                .limit(100); // Adjust limit as needed

            res.json(emails);
        } catch (error) {
            console.error(`Error fetching emails for folder ${folder} in mailbox ${mailboxId}:`, error);
            res.status(500).json({ error: `Failed to fetch emails for folder ${folder}`, details: error.message });
        }
    },
};

module.exports = emailController;