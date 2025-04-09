// backend/controllers/setting.controller.js
const Setting = require('../models/setting'); // Import model

const settingController = {
    getSettings: async (req, res) => {
        try {
            let settings = await Setting.findOne();
            if (!settings) {
                settings = new Setting();
                await settings.save();
            }
            res.json(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
        }
    },

    updateSettings: async (req, res) => {
        try {
            const { googleModelName, googleApiKey } = req.body;

            let settings = await Setting.findOne();
            if (!settings) {
                settings = new Setting();
            }

            settings.googleModelName = googleModelName || settings.googleModelName;
            settings.googleApiKey = googleApiKey || settings.googleApiKey;
            await settings.save();

            res.json({ message: 'Settings updated successfully', settings: settings });
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Failed to update settings', details: error.message });
        }
    },
};

module.exports = settingController;