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
  Link
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import '../styles/pages.css'

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
        <Container component="main" maxWidth="md" className="page-container">
            <Paper className="auth-container">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Typography component="h1" variant="h4" className="auth-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon sx={{ color: '#1976d2', fontSize: '1.5rem' }}>
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
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        className="primary-button"
                    >
                        Register
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" color="primary">
                                Sign in here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export default P_Register