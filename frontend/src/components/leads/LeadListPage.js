import React, { useState, useEffect } from 'react';
import leadService from '../../services/leadService';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

//const API_BASE_URL = 'http://localhost:5000/api'; // While API_BASE_URL is defined here, service files are used for API calls

const LeadListPage = () => {
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            const leadsData = await leadService.getLeads();
            setLeads(leadsData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Error loading leads. Please refresh.");
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading leads...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div>
            <Typography variant="h4" component="h2" gutterBottom>
                Lead List
            </Typography>
            <Paper elevation={3}>
                <TableContainer>
                    <Table aria-label="lead table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Company</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Interests</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.map(lead => (
                                <TableRow key={lead._id} hover>
                                    <TableCell component="th" scope="row">
                                        {lead.name}
                                    </TableCell>
                                    <TableCell align="left">{lead.company}</TableCell>
                                    <TableCell align="left">{lead.role}</TableCell>
                                    <TableCell align="left">{lead.email}</TableCell>
                                    <TableCell align="left">{lead.interests.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default LeadListPage;