/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_Dashboard.jsx
    For: Coordinators
*/

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Divider,
    Avatar,
    Grid,
    Card,
    CardContent,
    CardActionArea
} from '@mui/material'
import { FaUser, FaPlus, FaUserPlus, FaTrophy } from 'react-icons/fa'
import '../styles/pages.css'
import { getChallenges } from '../features/challenges/challengeSlice'

function C_Dashboard() {
    const { user } = useSelector((state) => state.auth)
    const { challenges } = useSelector((state) => state.challenge)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getChallenges())
    }, [dispatch])

    const handleChallengeClick = (challengeId) => {
        localStorage.setItem('selectedChallengeId', challengeId)
        navigate('/view-challenge')
    }

    return (
        <Container component="main" maxWidth="lg" className="page-container" sx={{mt: 10}}>
            <Paper className="dashboard-container" sx={{ p: 4 }}>
                {/* User Info Section */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 4,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1
                }}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                        <FaUser size={24} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Welcome, {user?.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Role: Coordinator
                        </Typography>
                    </Box>
                </Box>

                {/* Created Challenges Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: '#1976d2',
                        mb: 2
                    }}>
                        <FaTrophy />
                        Your Challenges
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.isArray(challenges) && challenges.length > 0 ? (
                            challenges.map((challenge) => (
                                <Grid item xs={12} sm={6} key={challenge._id}>
                                    <Card>
                                        <CardActionArea onClick={() => handleChallengeClick(challenge._id)}>
                                            <CardContent>
                                                <Typography variant="h6" component="h3" gutterBottom>
                                                    {challenge.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {challenge.description}
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Type: {challenge.type}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Goal: {challenge.goal}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Frequency: {challenge.frequency}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {new Date(challenge.startDate).toLocaleDateString()} to {new Date(challenge.endDate).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" align="center">
                                    No challenges created yet. Click the button below to create your first challenge!
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Action Buttons Section */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<FaPlus />}
                        onClick={() => navigate('/create-challenge')}
                        sx={{ width: '100%', maxWidth: 400 }}
                    >
                        Create Challenge
                    </Button>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%', 
                        maxWidth: 400,
                        my: 1
                    }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                            OR
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                    </Box>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<FaUserPlus />}
                        onClick={() => navigate('/enroll-participant')}
                        sx={{ width: '100%', maxWidth: 400 }}
                    >
                        Enroll Participant
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default C_Dashboard