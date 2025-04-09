// frontend/src/services/emailService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const emailService = {
    draftEmailWithGemini: async (payload) => {
        try {
            const response = await fetch(`${API_BASE_URL}/emails/draft-with-gemini`, { // Using fetch for SSE
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            return response; // Return the response object for stream handling in component
        } catch (error) {
            console.error("Error drafting email with Gemini:", error);
            throw error;
        }
    },

    sendEmail: async (payload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/emails/send`, payload);
            return response;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    },

    saveDraftEmail: async (payload) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/emails/save-draft`, payload);
            return response;
        } catch (error) {
            console.error("Error saving draft email:", error);
            throw error;
        }
    },

    getSentEmails: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/emails/sent`);
            return response.data;
        } catch (error) {
            console.error("Error fetching sent emails:", error);
            throw error;
        }
    },

    getEmailsByFolder: async (mailboxId, folder) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/mailboxes/${mailboxId}/emails/${folder}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching emails for folder ${folder} in mailbox ${mailboxId}:`, error);
            throw error;
        }
    },
    // ... other email related API calls ...
};

export default emailService;