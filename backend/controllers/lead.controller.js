// backend/controllers/lead.controller.js
const Lead = require('../models/lead'); // Import model

const leadController = {
    getLeads: async (req, res) => {
        try {
            const leads = await Lead.find();
            res.json(leads);
        } catch (error) {
            console.error('Error fetching leads from MongoDB:', error);
            res.status(500).json({ error: 'Failed to fetch leads', details: error.message });
        }
    },
    // ... other lead controller functions if needed ...
};

module.exports = leadController;