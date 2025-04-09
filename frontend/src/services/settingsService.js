// frontend/src/services/settingsService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const settingsService = {
    getSettings: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/settings`);
            return response.data;
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    },

    updateSettings: async (payload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/settings`, payload);
            return response;
        } catch (error) {
            console.error("Error saving settings:", error);
            throw error;
        }
    },
    // ... other settings related API calls ...
};

export default settingsService;