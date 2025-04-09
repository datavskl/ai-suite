// backend/controllers/template.controller.js
const Template = require('../models/template'); // Import model

const templateController = {
    getTemplates: async (req, res) => {
        try {
            const templates = await Template.find();
            res.json(templates);
        } catch (error) {
            console.error('Error fetching templates from MongoDB:', error);
            res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
        }
    },
    // ... other template controller functions if needed ...
};

module.exports = templateController;