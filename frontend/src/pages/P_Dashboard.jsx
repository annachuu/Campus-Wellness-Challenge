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
import { getChallengeAchievements } from '../features/achievements/achievementSlice'
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Card,
    CardContent,
    Divider,
    CircularProgress
} from '@mui/material'
import { FaUser, FaTrophy, FaMedal } from 'react-icons/fa'
import '../styles/pages.css'

function P_Dashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { challenges, isLoading, error } = useSelector((state) => state.participantChallenges)
    const { achievements } = useSelector((state) => state.achievements)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('Fetching participant challenges...')
        dispatch(getParticipantChallenges())
    }, [dispatch])

    // Get achievements from all enrolled challenges
    useEffect(() => {
        if (challenges && challenges.length > 0) {
            challenges.forEach(challenge => {
                dispatch(getChallengeAchievements(challenge._id))
            })
        }
    }, [challenges, dispatch])

    // Get the 3 most recent achievements from enrolled challenges only
    const recentAchievements = [...achievements]
        .filter(achievement => 
            challenges.some(challenge => challenge._id === achievement.challenge) &&
            achievement.lastClaimed // Only show achievements that have been claimed
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, 3)

    console.log('Enrolled challenges:', challenges) // Debug log
    console.log('All achievements:', achievements) // Debug log
    console.log('Filtered achievements:', recentAchievements) // Debug log

    useEffect(() => {
        console.log('Current challenges state:', challenges)
        console.log('Loading state:', isLoading)
        console.log('Error state:', error)
    }, [challenges, isLoading, error])

    const handleChallengeClick = (challengeId) => {
        localStorage.setItem('selectedChallengeId', challengeId)
        navigate('/participant/view-challenge')
    }

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
                                <Grid item xs={12} sm={6} key={challenge._id} sx={{width: 250}}>
                                    <Card  
                                        onClick={() => handleChallengeClick(challenge._id)}
                                        sx={{ 
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3
                                            },
                                            backgroundColor: '#8a9688'
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                {challenge.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} paragraph>
                                                {challenge.description}
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                    Points: {challenge.points}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                    Type: {challenge.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                    Goal: {challenge.goal}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                    Frequency: {challenge.frequency}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                    Participants: {challenge.participantCount || 0}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ color: '#FFFFFF'}}>
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
                        Recent Achievements
                    </Typography>
                    <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
                        {recentAchievements.length > 0 ? (
                            recentAchievements.map((achievement) => (
                                <Grid item xs={12} sm={6} md={4} key={achievement._id} sx={{ 
                                    display: 'flex',
                                    minWidth: 0 // Prevent overflow
                                }}>
                                    <Card sx={{ 
                                        width: '100%',
                                        backgroundColor: '#d9bcaf',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%' // Ensure consistent height
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF'}} gutterBottom>
                                                {achievement.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}} paragraph>
                                                {achievement.points} points
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF'}}>
                                                Refresh: {achievement.refreshTime}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mt: 1 }}>
                                                Challenge: {challenges.find(c => c._id === achievement.challenge)?.name || 'Unknown Challenge'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ color: '#FFFFFF', mt: 1 }}>
                                                Created: {new Date(achievement.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" align="center">
                                    No achievements available yet. Join a challenge to see achievements!
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}

export default P_Dashboard