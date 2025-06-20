/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_Dashboard.jsx
    For: Coordinators
*/

import React, { useEffect, useState } from 'react'
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
    CardActionArea,
    IconButton,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material'
import { FaUser, FaPlus, FaUserPlus, FaTrophy, FaTimes } from 'react-icons/fa'
import '../styles/pages.css'
import { getChallenges, deleteChallenge } from '../features/challenges/challengeSlice'

function C_Dashboard() {
    const { user } = useSelector((state) => state.auth)
    const { challenges } = useSelector((state) => state.challenge)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [challengeToDelete, setChallengeToDelete] = useState(null)

    useEffect(() => {
        dispatch(getChallenges())
    }, [dispatch])

    const handleChallengeClick = (challengeId) => {
        localStorage.setItem('selectedChallengeId', challengeId)
        navigate('/view-challenge')
    }

    const handleDeleteChallenge = async (challengeId, challengeName, e) => {
        e.stopPropagation() // Prevent triggering the card click
        setChallengeToDelete({ id: challengeId, name: challengeName })
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (challengeToDelete) {
            try {
                await dispatch(deleteChallenge(challengeToDelete.id)).unwrap()
                // Refresh the challenges list after deletion
                dispatch(getChallenges())
                setDeleteModalOpen(false)
                setChallengeToDelete(null)
            } catch (error) {
                console.error('Error deleting challenge:', error)
                alert('Failed to delete challenge. Please try again.')
            }
        }
    }

    const cancelDelete = () => {
        setDeleteModalOpen(false)
        setChallengeToDelete(null)
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
                    <Avatar sx={{ bgcolor: '#d9bcaf', width: 56, height: 56 }}>
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
                        color: '#795663',
                        mb: 2
                    }}>
                        <FaTrophy />
                        Your Challenges
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.isArray(challenges) && challenges.length > 0 ? (
                            challenges.map((challenge) => (
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
                                            position: 'relative',
                                            height: 360,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <IconButton
                                            onClick={(e) => handleDeleteChallenge(challenge._id, challenge.name, e)}
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 5, 
                                                right: 5, 
                                                zIndex: 1,
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                                }
                                            }}
                                        >
                                            <FaTimes />
                                        </IconButton>
                                        <CardActionArea onClick={() => handleChallengeClick(challenge._id)} sx={{ flexGrow: 1 }}>
                                            <CardContent sx={{backgroundColor: '#d9bcaf', height: '100%', display: 'flex', flexDirection: 'column'}}>
                                                <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF', mb: 1}} gutterBottom>
                                                    {challenge.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ color: '#FFFFFF', mb: 1.5, flexGrow: 1}} paragraph>
                                                    {challenge.description}
                                                </Typography>
                                                <Box sx={{ mb: 1.5 }}>
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
                                                </Box>

                                                <Divider sx={{ my: 1 }} />
                                                
                                                <Typography variant="caption" color="text.secondary" display="block" sx={{ color: '#FFFFFF'}}>
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
                        sx={{ width: '100%', maxWidth: 400, backgroundColor: '#8a9688'}}
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
                        color="#8a9688"
                        size="large"
                        startIcon={<FaUserPlus />}
                        onClick={() => navigate('/enroll-participant')}
                        sx={{ width: '100%', maxWidth: 400, color: '#8a9688'}}
                    >
                        Enroll Participant
                    </Button>
                </Box>
            </Paper>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={deleteModalOpen}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: '#283D3B' }}>
                    {"Confirm Challenge Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: '#795663' }}>
                        Are you sure you want to delete the challenge "{challengeToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cancelDelete}
                        sx={{ 
                            color: '#795663',
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        autoFocus
                        sx={{ 
                            backgroundColor: '#8a9688',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#6b7a6a'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default C_Dashboard