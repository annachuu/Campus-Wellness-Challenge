/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_Enroll.jsx
    For: Coordinators
*/

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getParticipants } from '../features/participants/participantSlice'
import { getChallenges } from '../features/challenges/challengeSlice'
import { enrollParticipants } from '../features/leaderboard/leaderboardSlice'
import {
    Paper,
    Typography,
    Button,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material'
import { FaCheck, FaPlus } from 'react-icons/fa'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'

function EnrollParticipant() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { participants, isLoading: participantsLoading } = useSelector((state) => state.participants)
    const { challenges, isLoading: challengesLoading } = useSelector((state) => state.challenge)
    const { isLoading: enrollmentLoading, isError, message } = useSelector((state) => state.leaderboard)
    
    const [selectedUsers, setSelectedUsers] = useState([])
    const [selectedChallenges, setSelectedChallenges] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertSeverity, setAlertSeverity] = useState('success')

    useEffect(() => {
        console.log('Fetching participants and challenges...')
        dispatch(getParticipants())
            .unwrap()
            .then((data) => {
                console.log('Participants fetched successfully:', data)
            })
            .catch((error) => {
                console.error('Error fetching participants:', error)
            })
            
        dispatch(getChallenges())
            .unwrap()
            .then((data) => {
                console.log('Challenges fetched successfully:', data)
            })
            .catch((error) => {
                console.error('Error fetching challenges:', error)
            })
    }, [dispatch])

    const toggleUser = (id) => {
        setSelectedUsers((prev) => prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id])
    }

    const toggleChallenge = (id) => {
        setSelectedChallenges((prev) => prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id])
    }

    const handleEnroll = async () => {
        if (selectedUsers.length === 0 || selectedChallenges.length === 0) {
            setAlertMessage('Please select at least one participant and one challenge')
            setAlertSeverity('error')
            setShowAlert(true)
            return
        }

        try {
            // Enroll participants in each selected challenge
            for (const challengeId of selectedChallenges) {
                await dispatch(enrollParticipants({ challengeId, participantIds: selectedUsers }))
                    .unwrap()
            }
            
            setAlertMessage('Participants enrolled successfully!')
            setAlertSeverity('success')
            setShowAlert(true)
            
            // Clear selections after successful enrollment
            setSelectedUsers([])
            setSelectedChallenges([])
            
            // Navigate back to view challenge page after a short delay
            setTimeout(() => {
                navigate('/view-challenge')
            }, 2000)
        } catch (error) {
            setAlertMessage(error.message || 'Failed to enroll participants')
            setAlertSeverity('error')
            setShowAlert(true)
        }
    }

    return (
        <Box className="enroll-page" sx={{mt: 15, textAlign: 'center'}}>
            <Box sx={{position: 'relative', mb: 2}}>
                {/* Back Arrow */}
                <IconButton onClick={() => navigate('/view-challenge')} sx={{position: 'absolute', left: 0}}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Page Title */}
                <Typography variant="h4" sx={{mb: 4, color: '#283D3B'}}>
                    Enroll
                </Typography>
            </Box>

            <Box sx={{display: 'flex', justifyContent: 'center', gap: 4}}>

                {/* Left: Participants */}
                <Paper elevation={3} sx={{p: 3, width: '300px', minHeight: '400px'}}>
                    <Typography variant="h6" sx={{mb: 2}}>
                        Participants
                    </Typography>

                    <Divider sx={{mb: 2}} />
                    
                    {participantsLoading ? (
                        <CircularProgress />
                    ) : participants && participants.length > 0 ? (
                        participants.map(participant => (
                            <Box
                                key={participant._id}
                                sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}
                            >
                                <Box sx={{textAlign: 'left'}}>
                                    <Typography>{participant.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{participant.email}</Typography>
                                </Box>

                                <IconButton onClick={() => toggleUser(participant._id)}>
                                    {selectedUsers.includes(participant._id) ? <FaCheck color="green" /> : <FaPlus />}
                                </IconButton>
                            </Box>
                        ))
                    ) : (
                        <Typography>No participants found</Typography>
                    )}
                </Paper>

                {/* Right: Challenges */}
                <Paper elevation={3} sx={{p: 3, width: '300px', minHeight: '400px'}}>
                    <Typography variant="h6" sx={{mb: 2}}>
                        Challenges
                    </Typography>
                    
                    <Divider sx={{mb: 2}} />

                    {challengesLoading ? (
                        <CircularProgress />
                    ) : challenges && challenges.length > 0 ? (
                        challenges.map(challenge => (
                            <Box
                                key={challenge._id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography>{challenge.name}</Typography>

                                <IconButton onClick={() => toggleChallenge(challenge._id)}>
                                    {selectedChallenges.includes(challenge._id) ? <FaCheck color="green" /> : <FaPlus />}
                                </IconButton>
                            </Box>
                        ))
                    ) : (
                        <Typography>No challenges found</Typography>
                    )}
                </Paper>
            </Box>
             <Button 
                variant="contained"
                sx={{px: 4, py: 2, mt: 3, backgroundColor: '#283D3B'}}
                onClick={handleEnroll}
                disabled={enrollmentLoading}
            >
                {enrollmentLoading ? <CircularProgress size={24} /> : 'Enroll'}
            </Button>

            <Snackbar 
                open={showAlert} 
                autoHideDuration={6000} 
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowAlert(false)} 
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default EnrollParticipant