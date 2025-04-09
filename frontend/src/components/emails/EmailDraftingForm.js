import React, { useState, useEffect } from 'react';
import templateService from '../../services/templateService';
import leadService from '../../services/leadService';
import mailboxService from '../../services/mailboxService';
import emailService from '../../services/emailService';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

//const API_BASE_URL = 'http://localhost:5000/api'; // While API_BASE_URL is defined here, service files are used for API calls

const EmailDraftingForm = ({ onDraftGenerated, onLeadSelected, onMailboxSelected }) => {
    const [leads, setLeads] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [mailboxes, setMailboxes] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [selectedMailboxId, setSelectedMailboxId] = useState('');
    const [tone, setTone] = useState('professional');
    const [language, setLanguage] = useState('en');
    const [userInstructions, setUserInstructions] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeadsTemplatesMailboxes();
    }, []);

    const fetchLeadsTemplatesMailboxes = async () => {
        try {
            const leadsData = await leadService.getLeads();
            setLeads(leadsData);
            const templatesData = await templateService.getTemplates();
            setTemplates(templatesData);
            const mailboxesData = await mailboxService.getMailboxes();
            setMailboxes(mailboxesData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Error loading data. Please refresh.");
        }
    };

    const handleGenerateDraft = async () => {
        setIsGenerating(true);
        setError(null);
        onDraftGenerated('');

        try {
            const response = await emailService.draftEmailWithGemini({
                leadId: selectedLeadId,
                templateId: selectedTemplateId,
                tone,
                language,
                userInstructions,
            });

            const reader = response.body.getReader();
            let accumulatedResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const textChunk = new TextDecoder().decode(value);
                accumulatedResponse += textChunk;

                const events = accumulatedResponse.split('\n\n').filter(event => event.trim() !== '');
                for (const eventStr of events) {
                    if (eventStr.startsWith('data:')) {
                        try {
                            const eventData = JSON.parse(eventStr.substring(5).trim());
                            onDraftGenerated(eventData.chunk, eventData.fullDraft);
                        } catch (parseError) {
                            console.error("Error parsing SSE data:", parseError, eventStr);
                            setError("Error processing AI response.");
                            setIsGenerating(false);
                            return;
                        }
                    }
                }
                accumulatedResponse = accumulatedResponse.substring(accumulatedResponse.lastIndexOf('\n\n') + 2)
            }

        } catch (err) {
            console.error("Error generating draft:", err);
            setError(`Error generating email draft: ${err.message}`);
            onDraftGenerated('');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <Typography variant="h5" component="h2" gutterBottom>
                Generate AI Email Draft
            </Typography>
            {error && <p className="error">{error}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateDraft(); }}>
                <Grid container spacing={2} mb={2} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="mailbox-label">Sender Mailbox</InputLabel>
                            <Select
                                labelId="mailbox-label"
                                id="mailbox"
                                value={selectedMailboxId}
                                label="Sender Mailbox"
                                onChange={(e) => {
                                    setSelectedMailboxId(e.target.value);
                                    onMailboxSelected(e.target.value);
                                }}
                                required
                            >
                                <MenuItem value="">-- Select Mailbox --</MenuItem>
                                {mailboxes.map(mailbox => (
                                    <MenuItem key={mailbox._id} value={mailbox._id}>{mailbox.mailboxName} ({mailbox.emailAddress})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="lead-label">Recipient Lead</InputLabel>
                            <Select
                                labelId="lead-label"
                                id="lead"
                                value={selectedLeadId}
                                label="Recipient Lead"
                                onChange={(e) => {
                                    setSelectedLeadId(e.target.value);
                                    onLeadSelected(e.target.value);
                                }}
                                required
                            >
                                <MenuItem value="">-- Select Lead --</MenuItem>
                                {leads.map(lead => (
                                    <MenuItem key={lead._id} value={lead._id}>{lead.name} ({lead.company})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="template-label">Template (Optional)</InputLabel>
                            <Select
                                labelId="template-label"
                                id="template"
                                value={selectedTemplateId}
                                label="Template (Optional)"
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                            >
                                <MenuItem value="">-- No Template --</MenuItem>
                                {templates.map(template => (
                                    <MenuItem key={template._id} value={template._id}>{template.templateName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="tone-label">Tone</InputLabel>
                            <Select
                                labelId="tone-label"
                                id="tone"
                                value={tone}
                                label="Tone"
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <MenuItem value="professional">Professional</MenuItem>
                                <MenuItem value="friendly">Friendly</MenuItem>
                                <MenuItem value="persuasive">Persuasive</MenuItem>
                                <MenuItem value="informative">Informative</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="language-label">Language</InputLabel>
                            <Select
                                labelId="language-label"
                                id="language"
                                value={language}
                                label="Language"
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="de">German</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="instructions"
                            label="Specific Instructions (Optional)"
                            multiline
                            rows={3}
                            variant="outlined"
                            margin="dense"
                            value={userInstructions}
                            onChange={(e) => setUserInstructions(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" type="submit" disabled={isGenerating}>
                    {isGenerating ? "Generating Draft..." : "Generate Draft"}
                </Button>
            </form>
        </div>
    );
};

export default EmailDraftingForm;