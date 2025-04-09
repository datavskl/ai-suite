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

    createMailbox: async (mailboxData) => { // New createMailbox function
        try {
            const response = await axios.post(`${API_BASE_URL}/mailboxes`, mailboxData);
            return response; // Return the full response object
        } catch (error) {
            console.error("Error creating mailbox:", error);
            throw error;
        }
    },

    updateMailbox: async (mailboxId, mailboxData) => { // New updateMailbox function
        try {
            const response = await axios.put(`${API_BASE_URL}/mailboxes/${mailboxId}`, mailboxData);
            return response; // Return the full response object
        } catch (error) {
            console.error("Error updating mailbox:", error);
            throw error;
        }
    },
    // ... (rest of mailboxService - if any) ...
};

export default mailboxService;