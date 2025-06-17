/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: P_Register.jsx
    For: Participants
*/

import React from 'react'
import { useState, useEffect } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerParticipant, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Icon,
  Link,
  IconButton
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'
import background from '../images/background.jpg';


function P_Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })
    
    const [emailError, setEmailError] = useState('')
    
    const {name, email, password, password2} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)   

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/participant-dashboard')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const validateEmail = (email) => {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address'
        }
        return ''
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))

        // Validate email on change
        if (name === 'email') {
            const error = validateEmail(value)
            setEmailError(error)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        
        // Validate email before submission
        const emailValidationError = validateEmail(email)
        if (emailValidationError) {
            toast.error(emailValidationError)
            return
        }

        if (password !== password2) {
            toast.error('Passwords do not match')
        } else {
            const userData = {
                name,
                email,
                password,
                role: 'participant'
            }
            dispatch(registerParticipant(userData))
        }
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <Box>
        <Container component="main" maxWidth="md" className="page-container">
            <IconButton onClick={() => navigate('/')} sx={{position: 'absolute', left: 450, mt: 6}}>
                            <ArrowBackIosNewIcon sx={{color: 'white', fontSize: '3rem'}}/>
            </IconButton>

            <Paper className="auth-container">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Typography component="h1" variant="h4" className="auth-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon sx={{ color: '#795663', fontSize: '1.5rem' }}>
                            <FaUserPlus />
                        </Icon>
                        Register as Participant
                    </Typography>
                </Box>
                
                <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
                    Create a participant account and start tracking your wellness goals
                </Typography>

                <Box component="form" onSubmit={onSubmit} className="auth-form">
                    <TextField
                        fullWidth
                        label="Name"
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                        autoFocus
                        sx={{'& label.Mui-focused': {color: '#795663'}, 
                             '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#d9bcaf', }, }, 
                            }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        error={!!emailError}
                        helperText={emailError}
                        sx={{'& label.Mui-focused': {color: '#795663'}, 
                             '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#d9bcaf', }, }, 
                            }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        sx={{'& label.Mui-focused': {color: '#795663'}, 
                             '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#d9bcaf', }, }, 
                            }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        required
                        sx={{'& label.Mui-focused': {color: '#795663'}, 
                             '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#d9bcaf', }, }, 
                            }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        className="primary-button"
                        sx={{ backgroundColor: '#283D3B'}}
                    >
                        Register
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" color="#795663" sx={{color: '#795663'}}>
                                Sign in here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
        <img src={background} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, pointerEvents: 'none',}}/>
        </Box>
    )
}

export default P_Register