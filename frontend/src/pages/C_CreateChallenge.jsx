/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_CreateChallenge.jsx
    For: Coordinators
*/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createChallenge } from '../features/challenges/challengeSlice'
import { toast } from 'react-toastify'
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid
} from '@mui/material'
import { FaPlus } from 'react-icons/fa'
import '../styles/pages.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

function C_CreateChallenge() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        type: '',
        goal: '',
        frequency: ''
    })

    const { name, description, startDate, endDate, type, goal, frequency } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        // Validate form data
        if (!name || !description || !startDate || !endDate || !type || !goal || !frequency) {
            toast.error('Please fill in all fields')
            return
        }

        const challengeData = {
            name,
            description,
            startDate,
            endDate,
            type,
            goal,
            frequency
        }

        try {
            await dispatch(createChallenge(challengeData)).unwrap()
            toast.success('Challenge created successfully!')
            navigate('/coordinator-dashboard')
        } catch (error) {
            toast.error(error.message || 'Failed to create challenge')
        }
    }

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{mt: 10}}>
            <Paper className="dashboard-container" sx={{ p: 4 }}>
                {/* Back Arrow */}
                <IconButton onClick={() => navigate(-1)} sx={{position: 'absolute', left: 450}}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Page Title */}
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                    color: '#1976d2',
                    mb: 4,
                    textAlign: 'center',
                    color: '#283D3B'
                }}>
                    Create Challenge
                </Typography>

                <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} sx={{width: 200}}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Challenge Name"
                                name="name"
                                value={name}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{width: 370}}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={description}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{width: 160}}>
                            <Grid container spacing={2}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <Grid item xs={12} sm={6}>
                                 <TextField
                                    required
                                    fullWidth
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                     }}
                                     sx={{mt: 2}}
                                 />
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required sx={{width: 250}}>
                                        <InputLabel>Challenge Type</InputLabel>
                                        <Select
                                            name="type"
                                            value={type}
                                            label="Challenge Type"
                                            onChange={onChange}
                                        >
                                            <MenuItem value="Physical Activity">Physical Activity</MenuItem>
                                            <MenuItem value="Nutrition">Nutrition</MenuItem>
                                            <MenuItem value="Mental Health">Mental Health</MenuItem>
                                            <MenuItem value="Sleep">Sleep</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                    <Grid item xs={12} sm={6} sx={{width: 230}}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Goal"
                                            name="goal"
                                            value={goal}
                                            onChange={onChange}
                                        />
                                    </Grid>

                            </Grid>
                            
                        </Grid>
                    
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required sx={{width: 250}}>
                                <InputLabel>Frequency</InputLabel>
                                <Select
                                    name="frequency"
                                    value={frequency}
                                    label="Frequency"
                                    onChange={onChange}
                                >
                                    <MenuItem value="Daily">Daily</MenuItem>
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: '#8a9688' }}
                        startIcon={<FaPlus />}
                    >
                        Create Challenge
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default C_CreateChallenge