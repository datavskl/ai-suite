const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: String,
    body: { type: String, required: true },
    recipientLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    senderMailboxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mailbox' },
    folder: { type: String, enum: ['sent', 'inbox', 'drafts'], default: 'sent' },
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', default: null },
    inReplyTo: String,
    references: [String],
    from: String,
    to: String,
    cc: String,
    bcc: String,
    receivedAt: Date,
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed', 'draft'], default: 'sent' }
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;