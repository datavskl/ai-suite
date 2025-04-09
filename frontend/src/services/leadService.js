// frontend/src/services/leadService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Make sure this is consistent

const leadService = {
    getLeads: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leads`);
            return response.data;
        } catch (error) {
            console.error("Error fetching leads:", error);
            throw error; // Re-throw to be handled in components
        }
    },
    // ... other lead related API calls (if you add more later) ...
};

export default leadService;