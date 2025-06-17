/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_Forum.jsx
    For: Both coordinator and participants
*/

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector}from 'react-redux'
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper, 
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FavoriteIcon from '@mui/icons-material/Favorite'
import '../styles/pages.css'

function Forum() {
  const navigate = useNavigate()
  
  return (
    <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>
       {/* Back Arrow */}
        <IconButton onClick={() => navigate('/view-challenge')} sx={{position: 'absolute', left: 450}}>
            <ArrowBackIosNewIcon />
        </IconButton>

        {/* Page Title */}
        <Typography component="h1" variant="h4" className="page-title" sx={{ mb: 4, color: '#283d3b', mt: -1 }}>
            Forum Posts
        </Typography>

    </Container>
  )
    
}

export default Forum;