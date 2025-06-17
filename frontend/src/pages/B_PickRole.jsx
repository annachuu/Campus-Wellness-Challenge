/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_PickRole.jsx
    For: Role selection page
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css';

function PickRole() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm" className="page-container">
      {/* Back Arrow */}
      <IconButton onClick={() => navigate('/')} sx={{position: 'absolute', left: 400, mt: 6}}>
          <ArrowBackIosNewIcon />
      </IconButton>

      <Paper className="homepage-container">
        <Typography 
          component="h1" 
          variant="h2" 
          className="welcome-text"
          sx={{ mb: 4 }}
        >
          Select Your Role
        </Typography>
        
        <Box className="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
            size="large"
            className="primary-button"
            sx={{ mb: 2, width: '200px', height: '48px', backgroundColor: '#283D3B'}}
          >
            Participant
          </Button>
          
          <Button
            variant="outlined"
            color="#283D3B"
            onClick={() => navigate('/coordinator-register')}
            size="large"
            className="secondary-button"
            sx={{ width: '200px', height: '48px', color: '#283D3B'}}
          >
            Coordinator
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PickRole;
