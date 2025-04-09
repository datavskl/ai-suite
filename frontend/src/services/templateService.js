// frontend/src/services/templateService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const templateService = {
    getTemplates: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/templates`);
            return response.data;
        } catch (error) {
            console.error("Error fetching templates:", error);
            throw error;
        }
    },
    // ... other template related API calls ...
};

export default templateService;