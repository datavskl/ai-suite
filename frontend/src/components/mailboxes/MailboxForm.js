// frontend/src/components/mailboxes/MailboxForm.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import mailboxService from '../../services/mailboxService';

const MailboxForm = ({ onSubmit, initialValues, isEdit }) => { // onSubmit prop to handle form submission, initialValues for edit mode
    const [mailboxData, setMailboxData] = useState(initialValues || { // Use initialValues or default empty object
        mailboxName: '',
        emailAddress: '',
        imapServerName: '',
        imapPort: 993,
        imapEncryption: 'SSL/TLS',
        imapUsername: '',
        imapPassword: '',
        smtpServerName: '',
        smtpPort: 587,
        smtpConnectionEncryption: 'TLS (STARTTLS)',
        smtpUsername: '',
        smtpPassword: '',
        smtpPriority: 10,
        smtpFromFiltering: '',
        smtpDebugging: false,
    });
    const [saveStatus, setSaveStatus] = useState(null);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMailboxData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaveStatus(null);

        try {
            let response;
            if (isEdit) {
                response = await mailboxService.updateMailbox(initialValues._id, mailboxData); // Assuming initialValues has _id in edit mode
            } else {
                response = await mailboxService.createMailbox(mailboxData);
            }

            if (response.status >= 200 && response.status < 300) {
                setSaveStatus({ type: 'success', message: `Mailbox ${isEdit ? 'updated' : 'created'} successfully!` });
                if (onSubmit) {
                    onSubmit(response.data); // Pass back the saved mailbox data
                }
                // Optionally reset form or navigate away
            } else {
                setSaveStatus({ type: 'error', message: `Failed to ${isEdit ? 'update' : 'create'} mailbox. Status: ${response.status}` });
            }
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'creating'} mailbox:`, error);
            setSaveStatus({ type: 'error', message: `Error ${isEdit ? 'updating' : 'creating'} mailbox: ${error.message}` });
        }
    };

    return (
        <div>
            <Typography variant="h6" component="h4" gutterBottom>
                {isEdit ? 'Edit Mailbox Settings' : 'Configure New Mailbox'}
            </Typography>

            {saveStatus && (
                <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
                    {saveStatus.message}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mailbox Name"
                            name="mailboxName"
                            value={mailboxData.mailboxName}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="emailAddress"
                            type="email"
                            value={mailboxData.emailAddress}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                            required
                        />
                    </Grid>

                    <Grid item xs={12}><Typography variant="subtitle1">Incoming Mail Server (IMAP)</Typography></Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="IMAP Server Name" name="imapServerName" value={mailboxData.imapServerName} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="IMAP Port" name="imapPort" type="number" value={mailboxData.imapPort} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">IMAP Encryption</FormLabel>
                            <RadioGroup row name="imapEncryption" value={mailboxData.imapEncryption} onChange={handleChange}>
                                <FormControlLabel value="None" control={<Radio />} label="None" />
                                <FormControlLabel value="SSL/TLS" control={<Radio />} label="SSL/TLS" />
                                <FormControlLabel value="STARTTLS" control={<Radio />} label="STARTTLS" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="IMAP Username" name="imapUsername" value={mailboxData.imapUsername} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="IMAP Password" name="imapPassword" type="password" value={mailboxData.imapPassword} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>

                    <Grid item xs={12}><Typography variant="subtitle1">Outgoing Mail Server (SMTP)</Typography></Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="SMTP Server Name" name="smtpServerName" value={mailboxData.smtpServerName} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="SMTP Port" name="smtpPort" type="number" value={mailboxData.smtpPort} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">SMTP Encryption</FormLabel>
                            <RadioGroup row name="smtpConnectionEncryption" value={mailboxData.smtpConnectionEncryption} onChange={handleChange}>
                                <FormControlLabel value="None" control={<Radio />} label="None" />
                                <FormControlLabel value="TLS (STARTTLS)" control={<Radio />} label="TLS (STARTTLS)" />
                                <FormControlLabel value="SSL/TLS" control={<Radio />} label="SSL/TLS" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="SMTP Username" name="smtpUsername" value={mailboxData.smtpUsername} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="SMTP Password" name="smtpPassword" type="password" value={mailboxData.smtpPassword} onChange={handleChange} variant="outlined" margin="dense" required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="SMTP Priority" name="smtpPriority" type="number" value={mailboxData.smtpPriority} onChange={handleChange} variant="outlined" margin="dense" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="SMTP From Filtering" name="smtpFromFiltering" value={mailboxData.smtpFromFiltering} onChange={handleChange} variant="outlined" margin="dense" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={mailboxData.smtpDebugging} onChange={handleChange} name="smtpDebugging" />}
                            label="SMTP Debugging"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            {isEdit ? 'Update Mailbox' : 'Save Mailbox'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default MailboxForm;