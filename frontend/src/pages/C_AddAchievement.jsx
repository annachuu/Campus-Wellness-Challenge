/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_AddAchievement.jsx
    For: Coordinators
*/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createAchievement } from '../features/achievements/achievementSlice'
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'

function C_AddAchievement() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        title: '',
        points: '',
        refreshTime: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate form data
        if (!formData.title || !formData.points || !formData.refreshTime) {
            setError('Please fill in all fields')
            return
        }

        // Validate points is a positive number
        if (isNaN(formData.points) || formData.points <= 0) {
            setError('Points must be a positive number')
            return
        }

        try {
            const challengeId = localStorage.getItem('selectedChallengeId')
            if (!challengeId) {
                setError('No challenge selected')
                return
            }

            // Create achievement data
            const achievementData = {
                ...formData,
                challenge: challengeId,
                points: Number(formData.points) // Convert to number
            }

            // Dispatch the create achievement action
            const result = await dispatch(createAchievement(achievementData)).unwrap()
            
            if (result) {
                // Navigate back to challenge view on success
                navigate('/view-challenge')
            }
        } catch (err) {
            setError(err.message || 'Error creating achievement')
        }
    }

    return (
        <Container component="main" className="page-container" sx={{ mt: 10 }}>
            {/* Back Arrow */}
            <IconButton onClick={() => navigate('/view-challenge')} sx={{position: 'absolute', left: 450}}>
                <ArrowBackIosNewIcon />
            </IconButton>

            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                color: '#283D3B',
                mb: 4,
                textAlign: 'center'
            }}>
                Add Achievement
            </Typography>

            <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Achievement Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!error && !formData.title}
                        helperText={error && !formData.title ? 'Title is required' : ''}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="points"
                        label="Points"
                        name="points"
                        type="number"
                        value={formData.points}
                        onChange={handleChange}
                        error={!!error && (!formData.points || formData.points <= 0)}
                        helperText={error && (!formData.points || formData.points <= 0) ? 'Points must be a positive number' : ''}
                    />

                    <FormControl fullWidth margin="normal" required error={!!error && !formData.refreshTime}>
                        <InputLabel id="refresh-time-label">Refresh Time</InputLabel>
                        <Select
                            labelId="refresh-time-label"
                            id="refreshTime"
                            name="refreshTime"
                            value={formData.refreshTime}
                            label="Refresh Time"
                            onChange={handleChange}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                        {error && !formData.refreshTime && (
                            <Typography color="error" variant="caption">
                                Refresh time is required
                            </Typography>
                        )}
                    </FormControl>

                    {error && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#283D3B',
                            '&:hover': {
                                backgroundColor: '#8a9688'
                            }
                        }}
                    >
                        Create Achievement
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default C_AddAchievement