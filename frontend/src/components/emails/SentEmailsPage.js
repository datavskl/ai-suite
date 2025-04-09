import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailService from '../../services/emailService';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

//const API_BASE_URL = 'http://localhost:5000/api'; // While API_BASE_URL is defined here, service files are used for API calls

const SentEmailsPage = () => {
    const [sentEmails, setSentEmails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSentEmails();
    }, []);

    const fetchSentEmails = async () => {
        setLoading(true);
        setError(null);
        try {
            const sentEmailsData = await emailService.getSentEmails();
            setSentEmails(sentEmailsData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching sent emails:", err);
            setError("Error loading sent emails. Please refresh.");
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading sent emails...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="sent-emails-page">
            <Typography variant="h4" component="h2" gutterBottom>
                Sent Emails
            </Typography>
            <Button component={Link} to="/create-mail" variant="outlined" sx={{ mb: 2 }}>
                Back to Email Generator
            </Button>
            <Paper elevation={3}>
                <TableContainer>
                    <Table aria-label="sent emails table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell align="left">Recipient Lead</TableCell>
                                <TableCell align="left">Sent At</TableCell>
                                <TableCell align="left">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sentEmails.map(email => (
                                <TableRow key={email._id} hover>
                                    <TableCell component="th" scope="row">
                                        {email.subject}
                                    </TableCell>
                                    <TableCell align="left">{email.recipientLeadId.name} ({email.recipientLeadId.company})</TableCell>
                                    <TableCell align="left">{new Date(email.sentAt).toLocaleString()}</TableCell>
                                    <TableCell align="left">{email.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default SentEmailsPage;