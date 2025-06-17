// /*
//     CS 731/490AP Spring 2025
//     Group Members:
//                 Julia Hu
//                 Anna Chu
//     File Name: B_Logout.jsx
//     For: Both coordinator and participants
// */

import React from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper,
  IconButton
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import WavingHandIcon from '@mui/icons-material/WavingHand'
import '../styles/pages.css';

function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)

    const handleConfirmLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    const handleCancel = () => {
        navigate('/participant-dashboard')                      //works for coordinator even though says participant?
    }

    return (
        <Box
            sx={{
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: '#f5f5f5',
                }}
        >
            <Paper elevation={4} sx={{position: 'relative', p: 10, width: 700, height: 600, textAlign: 'center'}}>
                {/* X Icon */}
                <IconButton onClick={handleCancel} sx={{position: 'absolute', top: 30, right: 30}}>
                    <CloseIcon sx={{fontSize: 40}}/>
                </IconButton>

                {/* Hand Icon */}
                <WavingHandIcon sx={{fontSize: 100, mt: 9, mb: 2}}/>

                <Typography sx={{fontSize: 35}}>
                    Bye! {user?.name || 'User'}
                </Typography>

                <Button variant="contained" color="primary" onClick={handleConfirmLogout} fullWidth sx={{mt: 6, height: 55, width: 180, backgroundColor: '#283d3b'}}>
                    Confirm Logout
                </Button>
            </Paper>
        </Box>
    )
}

export default Logout