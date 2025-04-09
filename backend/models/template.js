const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateName: { type: String, required: true },
    templateCategory: String,
    templateContent: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;