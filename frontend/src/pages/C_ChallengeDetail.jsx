/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_ChallengeDetail.jsx
    For: Coordinators
*/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createChallenge } from '../features/challenges/challengeSlice'
import { toast } from 'react-toastify'
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
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material'
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa'
import '../styles/pages.css'

function C_ChallengeDetail() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        achievement: '',
        resources: []
    })

    const achievements = [
        'First Place',
        'Second Place',
        'Third Place',
        'Most Improved',
        'Best Team Player',
        'Most Consistent',
        'Most Dedicated'
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddResource = () => {
        console.log('Add resource clicked')
    }

    const handleRemoveResource = (index) => {
        setFormData(prev => ({
            ...prev,
            resources: prev.resources.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const challengeData = {
                name: formData.title,
                description: formData.description,
                type: formData.achievement,
                goal: '0', // Default value
                frequency: 'daily', // Default value
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            }

            await dispatch(createChallenge(challengeData)).unwrap()
            toast.success('Challenge created successfully!')
            navigate('/view-challenge')
        } catch (error) {
            toast.error(error.message || 'Failed to create challenge')
        }
    }

    return (
        <Container component="main" className="page-container" sx={{ 
            mt: 4,
            maxWidth: '1800px !important',
            width: '100%'
        }}>
            {/* Back Button */}
            <IconButton 
                onClick={() => navigate('/view-challenge')} 
                sx={{ position: 'absolute', left: 20, top: 20 }}
            >
                <FaArrowLeft />
            </IconButton>

            {/* Form Title */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                color: '#1976d2',
                mb: 4,
                mt: 4,
                textAlign: 'center'
            }}>
                Challenge Details
            </Typography>

            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                px: 2
            }}>
                <Paper sx={{ 
                    p: 4,
                    width: '100%',
                    maxWidth: '800px'
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Challenge Title */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Challenge Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Challenge Description */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Challenge Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Achievements Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Achievement</InputLabel>
                                    <Select
                                        name="achievement"
                                        value={formData.achievement}
                                        onChange={handleChange}
                                        label="Select Achievement"
                                    >
                                        {achievements.map((achievement) => (
                                            <MenuItem key={achievement} value={achievement}>
                                                {achievement}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Resources Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Resources
                                </Typography>
                                <List>
                                    {formData.resources.map((resource, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={resource} />
                                            <ListItemSecondaryAction>
                                                <IconButton 
                                                    edge="end" 
                                                    onClick={() => handleRemoveResource(index)}
                                                >
                                                    <FaTrash />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="outlined"
                                    startIcon={<FaPlus />}
                                    onClick={handleAddResource}
                                    sx={{ mt: 2 }}
                                >
                                    Add Resource
                                </Button>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#1565c0'
                                        }
                                    }}
                                >
                                    Create Challenge
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default C_ChallengeDetail

