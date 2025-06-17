/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: P_Dashboard.jsx
    For: Participants
*/

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getParticipantChallenges } from '../features/participantChallenges/participantChallengesSlice'
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Divider,
    CircularProgress
} from '@mui/material'
import { FaUser, FaTrophy, FaMedal } from 'react-icons/fa'
import '../styles/pages.css'

function P_Dashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { challenges, isLoading, error } = useSelector((state) => state.participantChallenges)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('Fetching participant challenges...')
        dispatch(getParticipantChallenges())
    }, [dispatch])

    useEffect(() => {
        console.log('Current challenges state:', challenges)
        console.log('Loading state:', isLoading)
        console.log('Error state:', error)
    }, [challenges, isLoading, error])

    const handleChallengeClick = (challengeId) => {
        localStorage.setItem('selectedChallengeId', challengeId)
        navigate('/participant/view-challenge')
    }

    // Mock data for achievements
    const achievements = [
        {
            id: 1,
            name: 'First Steps',
            description: 'Completed your first challenge',
            date: '2024-03-15'
        },
        {
            id: 2,
            name: 'Consistency King',
            description: 'Logged in for 7 consecutive days',
            date: '2024-03-20'
        }
    ]

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{mt: 10}}>
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
                    <Avatar sx={{ bgcolor: '#d9bcaf', width: 56, height: 56 }}>
                        <FaUser size={24} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Welcome, {user?.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Role: Participant
                        </Typography>
                    </Box>
                </Box>

                {/* Enrolled Challenges Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: '#795663'
                    }}>
                        <FaTrophy />
                        Enrolled Challenges
                    </Typography>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>
                            Error loading challenges: {error}
                        </Typography>
                    ) : challenges && challenges.length > 0 ? (
                        <Grid container spacing={2}>
                            {challenges.map((challenge) => (
                                <Grid item xs={12} sm={6} key={challenge._id}>
                                    <Card 
                                        onClick={() => handleChallengeClick(challenge._id)}
                                        sx={{ 
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {challenge.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {challenge.description}
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Points: {challenge.points}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Type: {challenge.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Goal: {challenge.goal}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Frequency: {challenge.frequency}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Participants: {challenge.participantCount || 0}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(challenge.startDate).toLocaleDateString()} to {new Date(challenge.endDate).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
                            You are not enrolled in any challenges yet.
                        </Typography>
                    )}
                </Box>

                {/* Achievements Section */}
                <Box>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: '#795663'
                    }}>
                        <FaMedal />
                        Achievements
                    </Typography>
                    <Grid container spacing={2}>
                        {achievements.map((achievement) => (
                            <Grid item xs={12} sm={6} key={achievement.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            {achievement.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {achievement.description}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Earned on {achievement.date}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}

export default P_Dashboard