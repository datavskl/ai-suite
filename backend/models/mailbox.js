// backend/models/mailbox.js
const mongoose = require('mongoose');

const mailboxSchema = new mongoose.Schema({
    mailboxName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // --- Incoming Mail Server (IMAP) Settings ---
    imapServerType: { type: String, enum: ['IMAP Server'], default: 'IMAP Server' }, // For clarity, can be removed if only IMAP is supported
    imapServerName: { type: String },
    imapPort: { type: Number, default: 993 }, // Default IMAP SSL port
    imapEncryption: { type: String, enum: ['None', 'SSL/TLS', 'STARTTLS'], default: 'SSL/TLS' },
    imapUsername: { type: String },
    imapPassword: { type: String },

    // --- Outgoing Mail Server (SMTP) Settings ---
    smtpAuthenticateWith: { type: String, enum: ['Username'], default: 'Username' }, // For clarity, can be removed if only Username is supported
    smtpServerName: { type: String },
    smtpPort: { type: Number, default: 587 }, // Default SMTP STARTTLS port
    smtpConnectionEncryption: { type: String, enum: ['None', 'TLS (STARTTLS)', 'SSL/TLS'], default: 'TLS (STARTTLS)' },
    smtpUsername: { type: String },
    smtpPassword: { type: String },
    smtpPriority: { type: Number, default: 10 }, // Priority field from image
    smtpFromFiltering: { type: String }, // From Filtering field from image
    smtpDebugging: { type: Boolean, default: false } // Debugging option
});

const Mailbox = mongoose.model('Mailbox', mailboxSchema);

module.exports = Mailbox;