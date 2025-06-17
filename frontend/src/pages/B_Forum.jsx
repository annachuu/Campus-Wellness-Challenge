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
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper, 
  Avatar,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FavoriteIcon from '@mui/icons-material/Favorite'
import '../styles/pages.css'
import axios from 'axios'

function Forum() {
  const {user} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [text, setText] = useState('')
  
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

      {/* Write a Post */}
      <Paper sx={{ p: 5, mb: 5, display: 'flex', gap: 3, alignItems: 'flex-start', width: 700}} >
        <Box textAlign="center">
          <Avatar sx={{backgroundColor: '#795663', mx: 'auto'}}>
            {user.name?.[0] || '?'}
          </Avatar>
          <Typography variant="caption">{user.name}</Typography>
        </Box>

        <TextField
          multiline fullWidth minRows={3}
          placeholder="Share your thoughts and experience !"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 1, backgroundColor: '#283D3B'}}
        >
          Post
        </Button>
      </Paper>

      <Divider sx={{ mb: 3}} />

      {/* List of Posts */}
      

      {/* Likes */}


    </Container>
  )
    
}

export default Forum;