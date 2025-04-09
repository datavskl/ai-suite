const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: String,
    role: String,
    interests: [String],
    email: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;