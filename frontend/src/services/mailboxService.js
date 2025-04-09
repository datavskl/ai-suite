// frontend/src/services/mailboxService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const mailboxService = {
    getMailboxes: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mailboxes`);
            return response.data;
        } catch (error) {
            console.error("Error fetching mailboxes:", error);
            throw error;
        }
    },
    // ... other mailbox related API calls ...
};

export default mailboxService;