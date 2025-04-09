import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import emailService from '../../services/emailService';

import Button from '@mui/material/Button';

const EmailDraftPreview = ({ initialDraftText, onDraftTextChange, leadId, mailboxId }) => {
    const [editableDraftText, setEditableDraftText] = useState(initialDraftText);
    const [sendStatus, setSendStatus] = useState(null);
    const [isSending, setIsSending] = useState(false);
   // const navigate = useNavigate();

    useEffect(() => {
        setEditableDraftText(initialDraftText);
    }, [initialDraftText]);

    const handleTextChange = (event) => {
        const newText = event.target.value;
        setEditableDraftText(newText);
        if (onDraftTextChange) {
            onDraftTextChange(newText);
        }
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        setSendStatus(null);

        try {
            const response = await emailService.sendEmail({
                leadId: leadId,
                emailBody: editableDraftText,
                subject: "Email Subject",
                senderMailboxId: mailboxId
            });

            if (response.status === 200) {
                setSendStatus({ type: 'success', message: 'Email sent and saved successfully!' });
            } else {
                setSendStatus({ type: 'error', message: `Failed to send email. Status: ${response.status}` });
            }

        } catch (error) {
            console.error("Error sending email:", error);
            setSendStatus({ type: 'error', message: `Error sending email: ${error.message}` });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <h2>Email Draft Preview & Editor</h2>
            <div className="draft-editor">
                <textarea
                    value={editableDraftText}
                    onChange={handleTextChange}
                    placeholder="Draft will appear here and you can edit it..."
                    rows="15"
                    cols="80"
                    style={{ width: '100%', fontFamily: 'monospace', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            {sendStatus && (
                <div className={`send-status ${sendStatus.type}`}>
                    {sendStatus.message}
                </div>
            )}

            <Button variant="contained" color="primary" onClick={handleSendEmail} disabled={isSending}>
                {isSending ? "Sending..." : "Send Email"}
            </Button>
        </div>
    );
};

export default EmailDraftPreview;