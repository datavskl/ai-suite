// frontend/src/components/mailboxes/MailboxList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mailboxService from '../../services/mailboxService';
import MailboxForm from './MailboxForm'; // Import MailboxForm

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import InboxIcon from '@mui/icons-material/Inbox';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'; // Import Modal for popup form
import Box from '@mui/material/Box'; // Import Box for Modal styling
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const modalStyle = { // Style for the Modal
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%', // Adjust width as needed
    maxWidth: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const MailboxList = () => {
    const [mailboxes, setMailboxes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for create modal visibility
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);     // State for edit modal visibility
    const [mailboxToEdit, setMailboxToEdit] = useState(null);       // State to hold mailbox being edited


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

    const handleCreateMailboxSubmit = (newMailbox) => { // Callback after successful mailbox creation
        setIsCreateModalOpen(false); // Close create modal
        fetchMailboxes(); // Refresh mailbox list
        // Optionally, you could update the mailboxes state directly with newMailbox for immediate update
    };

    const handleUpdateMailboxSubmit = (updatedMailbox) => { // Callback after successful mailbox update
        setIsEditModalOpen(false); // Close edit modal
        setMailboxToEdit(null);     // Clear mailbox to edit
        fetchMailboxes();         // Refresh mailbox list
        // Optionally, update mailboxes state directly
    };


    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleOpenEditModal = (mailbox) => {
        setMailboxToEdit(mailbox);  // Set the mailbox to be edited
        setIsEditModalOpen(true);   // Open the edit modal
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setMailboxToEdit(null);     // Clear mailbox to edit when closing modal
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
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal} sx={{ mb: 2 }}>
                Configure New Mailbox
            </Button>

            {/* Create Mailbox Modal */}
            <Modal
                open={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                aria-labelledby="create-mailbox-modal"
                aria-describedby="create-mailbox-form"
            >
                <Box sx={modalStyle}>
                    <MailboxForm onSubmit={handleCreateMailboxSubmit} isEdit={false} /> {/* Render MailboxForm in create mode */}
                </Box>
            </Modal>

            {/* Edit Mailbox Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-mailbox-modal"
                aria-describedby="edit-mailbox-form"
            >
                <Box sx={modalStyle}>
                    <MailboxForm onSubmit={handleUpdateMailboxSubmit} initialValues={mailboxToEdit} isEdit={true} /> {/* Render MailboxForm in edit mode */}
                </Box>
            </Modal>


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
                            <ListItem key={mailbox._id} disablePadding
                                secondaryAction={
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(mailbox)}>
                                        <EditIcon />
                                    </IconButton>
                                }
                            >
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
        </div>
    );
};

export default MailboxList;