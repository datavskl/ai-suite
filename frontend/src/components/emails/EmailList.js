import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import emailService from '../../services/emailService';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const EmailList = () => {
    const { mailboxId, folder } = useParams();
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEmails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const emailsData = await emailService.getEmailsByFolder(mailboxId, folder);
            setEmails(emailsData);
            setLoading(false);
        } catch (err) {
            console.error(`Error fetching emails for folder ${folder} in mailbox ${mailboxId}:`, err);
            setError(`Error loading emails for ${folder}. Please refresh.`);
            setLoading(false);
        }
    }, [mailboxId, folder]);

    useEffect(() => {
        fetchEmails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchEmails, mailboxId, folder]); // Added fetchEmails, mailboxId, folder as dependencies

    if (loading) {
        return <p>Loading emails from {folder}...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    const getTableHeaderText = () => {
        if (folder === 'inbox') return "Received At";
        if (folder === 'sent') return "Sent At";
        return "Date"; // For drafts or fallback
    };

    const getEmailDateField = () => {
        if (folder === 'inbox') return email => email.receivedAt ? new Date(email.receivedAt).toLocaleString() : 'N/A';
        if (folder === 'sent') return email => email.sentAt ? new Date(email.sentAt).toLocaleString() : 'N/A';
        return email => 'N/A'; // For drafts or fallback
    };

    const getEmailRecipient = (email) => {
        if (folder === 'inbox') return email.from || 'N/A'; // Display sender for inbox
        return email.recipientLeadId ? `${email.recipientLeadId.name} (${email.recipientLeadId.company})` : 'N/A'; // Recipient for sent/drafts
    };

    return (
        <div className="email-list-page">
            <Typography variant="h5" component="h4" gutterBottom>
                Emails in {folder}
            </Typography>
            <Paper elevation={3}>
                <TableContainer>
                    <Table aria-label={`${folder} emails table`}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell align="left">
                                    {folder === 'inbox' ? 'From' : 'Recipient Lead'}
                                </TableCell>
                                <TableCell align="left">{getTableHeaderText()}</TableCell>
                                <TableCell align="left">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {emails.map(email => (
                                <TableRow key={email._id} hover>
                                    <TableCell component="th" scope="row">
                                        {email.subject || 'No Subject'}</TableCell>
                                    <TableCell align="left">{getEmailRecipient(email)}</TableCell>
                                    <TableCell align="left">{getEmailDateField()(email)}</TableCell>
                                    <TableCell align="left">{email.status || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default EmailList;