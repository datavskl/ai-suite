const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    googleModelName: { type: String, default: 'gemini-pro' }, // Default model name
    googleApiKey: { type: String, required: false, default: '' }, // API Key - store encrypted in real app
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;