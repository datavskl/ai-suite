import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const API_BASE_URL = 'http://localhost:5000/api';

const EmailDetailPage = () => {
    const { emailId } = useParams();
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmailDetails = async () => { // Move fetchEmailDetails inside useEffect
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/emails/sent/${emailId}`);
                setEmail(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching email details:", err);
                setError("Error loading email details. Please refresh.");
                setLoading(false);
            }
        };

        fetchEmailDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailId]); // Keep emailId in dependency array

    if (loading) {
        return <p>Loading email details...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!email) {
        return <p>Email not found.</p>;
    }

    return (
        <div className="email-detail-page">
            <Button component={Link} to="/sent-emails" variant="outlined" sx={{ mb: 2 }}>
                Back to Sent Emails
            </Button>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Email Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Subject:</b> {email.subject || 'No Subject'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>From:</b> {email.senderMailboxId ? `${email.senderMailboxId.mailboxName} (${email.senderMailboxId.emailAddress})` : 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>To:</b> {email.recipientLeadId ? `${email.recipientLeadId.name} (${email.recipientLeadId.email})` : 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Sent At:</b> {new Date(email.sentAt).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Status:</b> {email.status}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h3" style={{ marginTop: '20px' }}>
                            Body:
                        </Typography>
                        <Paper elevation={1} style={{ padding: '10px', whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
                            {email.body}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default EmailDetailPage;