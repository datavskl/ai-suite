import React, { useState } from 'react';
import mailboxService from '../../services/mailboxService';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MailboxConfigurationForm = () => {
    const [mailboxName, setMailboxName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [connectionType, setConnectionType] = useState('IMAP'); // Default to IMAP
    const [imapHost, setImapHost] = useState('');
    const [imapPort, setImapPort] = useState(993); // Default IMAP-SSL port
    const [imapSecure, setImapSecure] = useState(true); // Default to secure
    const [imapUser, setImapUser] = useState('');
    const [imapPassword, setImapPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        const mailboxData = {
            mailboxName,
            emailAddress,
            connectionType: 'IMAP', // Hardcoded to IMAP for now, expand later if needed
            imapSettings: {
                host: imapHost,
                port: parseInt(imapPort, 10),
                secure: imapSecure,
                auth: {
                    user: imapUser,
                    pass: imapPassword,
                },
            },
        };

        try {
            const response = await mailboxService.createMailbox(mailboxData);
            console.log('Mailbox created:', response.data);
            setSuccessMessage('Mailbox configured successfully!');
            // Reset form after successful submission (optional)
            setMailboxName('');
            setEmailAddress('');
            setImapHost('');
            setImapPort(993);
            setImapSecure(true);
            setImapUser('');
            setImapPassword('');
        } catch (error) {
            console.error('Error configuring mailbox:', error);
            setErrorMessage('Failed to configure mailbox. Please check your settings.');
            if (error.response && error.response.data && error.response.data.details) {
                setErrorMessage(`${errorMessage} Details: ${error.response.data.details}`);
            }
        }
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Configure Incoming Mail Server (IMAP)
            </Typography>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mailbox Name"
                            variant="outlined"
                            margin="dense"
                            required
                            value={mailboxName}
                            onChange={(e) => setMailboxName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            margin="dense"
                            required
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">Server Type</FormLabel>
                            <RadioGroup
                                aria-label="connection-type"
                                name="connectionType"
                                value={connectionType}
                                onChange={(e) => setConnectionType(e.target.value)}
                                row
                            >
                                <FormControlLabel value="IMAP" control={<Radio />} label="IMAP Server" />
                                {/* Add POP3 and other types later if needed */}
                                {/* <FormControlLabel value="POP3" control={<Radio />} label="POP Server" disabled /> */}
                                {/* <FormControlLabel value="LOCAL" control={<Radio />} label="Local Server" disabled /> */}
                                {/* <FormControlLabel value="GMAIL_OAUTH" control={<Radio />} label="Gmail OAuth Authentication" disabled /> */}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Server Name (IMAP Host)"
                            variant="outlined"
                            margin="dense"
                            required
                            value={imapHost}
                            onChange={(e) => setImapHost(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Port (IMAP)"
                            variant="outlined"
                            margin="dense"
                            type="number"
                            value={imapPort}
                            onChange={(e) => setImapPort(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={imapSecure} onChange={(e) => setImapSecure(e.target.checked)} />}
                                label="SSL/TLS"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username / Email Address (for IMAP)"
                            variant="outlined"
                            margin="dense"
                            required
                            value={imapUser}
                            onChange={(e) => setImapUser(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password (for IMAP)"
                            variant="outlined"
                            margin="dense"
                            type="password"
                            required
                            value={imapPassword}
                            onChange={(e) => setImapPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Save Mailbox Configuration
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default MailboxConfigurationForm;