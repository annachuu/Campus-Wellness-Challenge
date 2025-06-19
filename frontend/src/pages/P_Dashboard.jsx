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
    const recentAchievements = Object.values(achievements)
        .flat()
        .filter(achievement => 
            challenges.some(challenge => challenge._id === achievement.challenge) &&
            achievement.lastClaimed !== null && achievement.lastClaimed !== undefined // Only show achievements that have been claimed
        )
        .sort((a, b) => new Date(b.lastClaimed) - new Date(a.lastClaimed)) // Sort by most recent first
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
                                            backgroundColor: '#8a9688',
                                            height: 360, // Increased height to accommodate coordinator info
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                                            <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF', mb: 1}} gutterBottom>
                                                {challenge.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 1.5, flexGrow: 1}} paragraph>
                                                {challenge.description}
                                            </Typography>
                                            <Box sx={{ mb: 1.5 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Points: {challenge.points}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Type: {challenge.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Goal: {challenge.goal}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Frequency: {challenge.frequency}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Participants: {challenge.participantCount || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}} gutterBottom>
                                                    Coordinator: {challenge.coordinatorName || 'Unknown'}
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
                    <Grid 
                        container 
                        spacing={3} 
                        sx={{ 
                            width: '100%',
                            margin: 0,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        {recentAchievements.length > 0 ? (
                            recentAchievements.map((achievement) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    sm={recentAchievements.length === 1 ? 12 : 6} 
                                    md={recentAchievements.length === 1 ? 12 : recentAchievements.length === 2 ? 6 : 4} 
                                    key={achievement._id} 
                                    sx={{ 
                                        display: 'flex',
                                        flex: 1
                                    }}
                                >
                                    <Card sx={{ 
                                        width: '100%',
                                        backgroundColor: '#8a9688',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%', // Ensure consistent height
                                        minHeight: 200 // Set minimum height for consistency
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF', mb: 1}} gutterBottom>
                                                {achievement.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 1}} paragraph>
                                                {achievement.description}
                                            </Typography>
                                            <Box sx={{ mt: 'auto' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}}>
                                                    Points: {achievement.points}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 0.5}}>
                                                    Challenge: {challenges.find(c => c._id === achievement.challenge)?.name || 'Unknown Challenge'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block" sx={{ color: '#FFFFFF', mt: 1 }}>
                                                    Claimed: {new Date(achievement.lastClaimed).toLocaleDateString()}
                                                </Typography>
                                            </Box>
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