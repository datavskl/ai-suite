import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import InboxIcon from '@mui/icons-material/Inbox';
import CampaignIcon from '@mui/icons-material/Campaign';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DraftsIcon from '@mui/icons-material/Drafts';
import ListSubheader from '@mui/material/ListSubheader';

const drawerWidth = 240;

const Sidebar = () => {
    const location = useLocation();

    const navGroups = [
        {
            subheader: 'Communication',
            items: [
                { text: 'Leads', path: '/', icon: <PeopleIcon /> },
            ],
        },
        {
            subheader: 'Email Management',
            items: [
                { text: 'Create Mail', path: '/create-mail', icon: <DashboardIcon /> },
                { text: 'Inbox', path: '/mailboxes/defaultMailboxId/inbox', icon: <InboxIcon /> },
                { text: 'Sent', path: '/mailboxes/defaultMailboxId/sent', icon: <SendIcon /> },
                { text: 'Drafts', path: '/mailboxes/defaultMailboxId/drafts', icon: <DraftsIcon /> },
            ],
        },
        {
            subheader: 'Automation & Analytics',
            items: [
                { text: 'Campaigns', path: '/campaigns', icon: <CampaignIcon /> },
                { text: 'Pending Approval', path: '/pending-approval', icon: <PendingActionsIcon /> },
                { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
            ],
        },
        {
            subheader: 'Settings',
            items: [
                { text: 'Mailboxes', path: '/mailboxes', icon: <EmailIcon /> },
                { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
            ],
        },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: 0,
                },
            }}
        >
            <Toolbar sx={{ justifyContent: 'center' }}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                    <BusinessCenterIcon fontSize="large" color="primary" />
                </ListItemIcon>
                <Typography variant="h6" noWrap component="div">
                    Sales Suite
                </Typography>
            </Toolbar>
            <List>
                {navGroups.map((group, index) => (
                    <React.Fragment key={index}>
                        {group.subheader && (
                            <ListSubheader component="div" id={`subheader-${index}`}>
                                {group.subheader}
                            </ListSubheader>
                        )}
                        {group.items.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(102, 51, 153, 0.1)',
                                            borderLeft: '3px solid purple',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;