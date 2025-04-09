import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';


//const API_BASE_URL = 'http://localhost:5000/api'; // While API_BASE_URL is defined here, service files are used for API calls

const SettingsPage = () => {
    const [googleModelName, setGoogleModelName] = useState('');
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [saveStatus, setSaveStatus] = useState(null);
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const settingsData = await settingsService.getSettings();
            setGoogleModelName(settingsData.googleModelName);
            setGoogleApiKey(settingsData.googleApiKey);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSaveStatus({ type: 'error', message: 'Failed to load settings.' });
        }
    };

    const handleSaveSettings = async () => {
        setSaveStatus(null);

        try {
            const response = await settingsService.updateSettings({
                googleModelName,
                googleApiKey,
            });

            if (response.status === 200) {
                setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
            } else {
                setSaveStatus({ type: 'error', message: `Failed to save settings. Status: ${response.status}` });
            }

        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus({ type: 'error', message: `Error saving settings: ${error.message}` });
        }
    };

    const handleClickShowApiKey = () => {
        setShowApiKey(!showApiKey);
    };

    const handleMouseDownApiKey = (event) => {
        event.preventDefault();
    };


    return (
        <div>
            <Typography variant="h4" component="h2" gutterBottom>
                Application Settings
            </Typography>

            {saveStatus && (
                <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
                    {saveStatus.message}
                </Alert>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                <Grid container spacing={2} maxWidth="md">
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="googleModelName"
                            label="Google Model Name"
                            variant="outlined"
                            margin="dense"
                            value={googleModelName}
                            onChange={(e) => setGoogleModelName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel htmlFor="googleApiKey">Google API Key</InputLabel>
                            <OutlinedInput
                                id="googleApiKey"
                                type={showApiKey ? 'text' : 'password'}
                                value={googleApiKey}
                                onChange={(e) => setGoogleApiKey(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowApiKey}
                                            onMouseDown={handleMouseDownApiKey}
                                            edge="end"
                                        >
                                            {showApiKey ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Google API Key"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Save Settings
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default SettingsPage;