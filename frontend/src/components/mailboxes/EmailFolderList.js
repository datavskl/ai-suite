import React from 'react';
import { useParams, Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const EmailFolderList = () => {
    const { mailboxId } = useParams();

    return (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Typography variant="h6" component="div" sx={{ paddingLeft: 2, paddingTop: 1 }}>
                Folders
            </Typography>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={`/mailboxes/${mailboxId}/inbox`}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={`/mailboxes/${mailboxId}/sent`}>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sent" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={`/mailboxes/${mailboxId}/drafts`}>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Paper>
    );
};

export default EmailFolderList;