import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mailboxService from '../../services/mailboxService';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import InboxIcon from '@mui/icons-material/Inbox';
//import SendIcon from '@mui/icons-material/Send';
//import DraftsIcon from '@mui/icons-material/Drafts';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

//const API_BASE_URL = 'http://localhost:5000/api'; // While API_BASE_URL is defined here, service files are used for API calls

const MailboxList = () => {
    const [mailboxes, setMailboxes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMailboxes();
    }, []);

    const fetchMailboxes = async () => {
        setLoading(true);
        setError(null);
        try {
            const mailboxesData = await mailboxService.getMailboxes();
            setMailboxes(mailboxesData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching mailboxes:", err);
            setError("Error loading mailboxes. Please refresh.");
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading mailboxes...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="mailboxes-page">
            <Typography variant="h4" component="h2" gutterBottom>
                Mailboxes
            </Typography>
            <Paper elevation={3}>
                <List
                    subheader={
                        <ListSubheader component="div" id="subheader-mailboxes">
                            Configured Mailboxes
                        </ListSubheader>
                    }
                >
                    {mailboxes.length > 0 ? (
                        mailboxes.map(mailbox => (
                            <ListItem key={mailbox._id} disablePadding>
                                <ListItemButton component={Link} to={`/mailboxes/${mailbox._id}/inbox`}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`${mailbox.mailboxName} (${mailbox.emailAddress})`} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No mailboxes configured yet." />
                        </ListItem>
                    )}
                </List>
            </Paper>
            {/* <Link to="/mailboxes/create">Create New Mailbox</Link> -  Create Mailbox Page Link - Future */}
        </div>
    );
};

export default MailboxList;