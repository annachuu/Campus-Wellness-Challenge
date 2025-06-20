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
import background from '../images/background.jpg';


function PickRole() {
  const navigate = useNavigate();

  return (
    <Box>
    <Container component="main" maxWidth="sm" className="page-container">
      {/* Back Arrow */}
      <IconButton onClick={() => navigate('/')} sx={{position: 'absolute', left: 450, mt: 6}}>
                <ArrowBackIosNewIcon sx={{color: 'white', fontSize: '3rem'}}/>
      </IconButton>

      <Paper className="homepage-container"  sx={{backgroundColor: 'rgba(255, 255, 255, 0.90)'}}>
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
    <img src={background} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, pointerEvents: 'none',}}/>
    </Box>
  );
}

export default PickRole;
