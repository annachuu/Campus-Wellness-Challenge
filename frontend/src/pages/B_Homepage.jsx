/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_Homepage.jsx
    For: Both coordinator and participants
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper
} from '@mui/material';
import '../styles/pages.css';
import background from '../images/background.jpg';

function Homepage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Container component="main" maxWidth="sm" className="page-container">
        <Paper className="homepage-container">
          <Typography 
            component="h1" 
            variant="h2" 
            className="welcome-text"
          >
            Welcome to Campus Wellness Challenge!
          </Typography>

          <Box className="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              size="large"
              sx={{backgroundColor: '#283D3B'}}
              className="primary-button"
            >
              Login
            </Button>
            
            <Button
              variant="outlined"
              color="#283D3B"
              onClick={() => navigate('/pick-role')}
              size="large"
              sx={{color: '#283D3B'}}
              className="secondary-button"
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
      <img src={background} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, pointerEvents: 'none',}}/>
    </Box>
  );
}

export default Homepage;