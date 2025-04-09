const mongoose = require('mongoose');

const mailboxSchema = new mongoose.Schema({
    mailboxName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    connectionType: { type: String, enum: ['SMTP', 'IMAP'], default: 'SMTP' },
    smtpSettings: {
        host: String,
        port: Number,
        secure: Boolean,
        auth: {
            user: String,
            pass: String
        }
    },
    imapSettings: {
        host: String,
        port: Number,
        secure: Boolean,
        auth: {
            user: String,
            pass: String
        }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Mailbox = mongoose.model('Mailbox', mailboxSchema);

module.exports = Mailbox;