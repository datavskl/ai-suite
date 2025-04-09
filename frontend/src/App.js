import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import EmailDraftingForm from './components/emails/EmailDraftingForm';
import EmailDraftPreview from './components/emails/EmailDraftPreview';
import LeadListPage from './components/leads/LeadListPage';
import SentEmailsPage from './components/emails/SentEmailsPage';
import MailboxList from './components/mailboxes/MailboxList';
import EmailList from './components/emails/EmailList';
import Sidebar from './components/ui/Sidebar';
import SettingsPage from './components/settings/SettingsPage';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

function App() {
    const [fullDraft, setFullDraft] = useState('');
    const [editedDraftText, setEditedDraftText] = useState('');
    const [currentLeadId, setCurrentLeadId] = useState(null);
    const [selectedMailboxId, setSelectedMailboxId] = useState('');

    const handleDraftChunk = (chunk, currentFullDraft) => {
        setFullDraft(currentFullDraft);
        setEditedDraftText(currentFullDraft);
    };

    const handleEditedDraftChange = (text) => {
        setEditedDraftText(text);
    };

    const handleLeadSelection = (leadId) => {
        setCurrentLeadId(leadId);
    };

    const handleMailboxSelection = (mailboxId) => {
        setSelectedMailboxId(mailboxId);
    };

    return (
        <Router>
            <div className="App">
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Sales & Marketing Suite
                        </Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search leads..."
                            sx={{ mr: 2, bgcolor: 'white', borderRadius: '4px' }}
                        />
                        <IconButton color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Sidebar />

                <Container maxWidth="lg" sx={{ mt: 8, ml: { md: 24 }, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path="/" element={<LeadListPage />} />
                        <Route path="/create-mail" element={<>
                            <EmailDraftingForm onDraftGenerated={handleDraftChunk} onLeadSelected={handleLeadSelection} onMailboxSelected={handleMailboxSelection} />
                            <EmailDraftPreview
                                initialDraftText={fullDraft}
                                onDraftTextChange={handleEditedDraftChange}
                                leadId={currentLeadId}
                                mailboxId={selectedMailboxId}
                            />
                            <div style={{ marginTop: '20px' }}>
                                <h2>Edited Draft</h2>
                                <div className="draft-preview">
                                    <p style={{ whiteSpace: 'pre-line' }}>{editedDraftText}</p>
                                </div>
                            </div>
                        </>} />
                        <Route path="/leads" element={<LeadListPage />} />
                        <Route path="/sent-emails" element={<SentEmailsPage />} />
                        <Route path="/mailboxes" element={<MailboxList />} />
                        <Route path="/mailboxes/:mailboxId/:folder" element={<EmailList />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;