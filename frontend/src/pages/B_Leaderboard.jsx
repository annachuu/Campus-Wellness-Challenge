/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_Leaderboard.jsx
    For: Both coordinator and participants
*/

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Icon,
  IconButton,
  CircularProgress
} from '@mui/material'
import { FaCrown } from 'react-icons/fa'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'
import axios from 'axios'

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000'

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const challengeId = localStorage.getItem('selectedChallengeId')
                console.log('Fetching leaderboard for challenge:', challengeId)
                
                if (!challengeId) {
                    setError('No challenge selected')
                    setLoading(false)
                    return
                }

                const token = localStorage.getItem('token')
                console.log('Using token:', token ? 'Token exists' : 'No token found')

                const response = await axios.get(`/api/leaderboard/${challengeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                console.log('Leaderboard response:', response.data)

                // Transform the data to include rank
                const dataWithRank = response.data.map((entry, index) => {
                    console.log('Processing entry:', entry)
                    return {
                        id: entry._id,
                        name: entry.participant?.name || 'Unknown Participant',
                        points: entry.points || 0,
                        rank: index + 1
                    }
                })

                console.log('Transformed data:', dataWithRank)
                setLeaderboardData(dataWithRank)
                setLoading(false)
            } catch (err) {
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })
                setError(err.response?.data?.message || err.message || 'Error fetching leaderboard')
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    if (loading) {
        return (
            <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress />
            </Container>
        )
    }

    if (error) {
        return (
            <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>
                <Typography color="error">{error}</Typography>
            </Container>
        )
    }

    const topThree = leaderboardData.slice(0, 3)
    const restOfList = leaderboardData.slice(3)

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>
            {/* Back Arrow */}
            <IconButton onClick={() => navigate(-1)} sx={{position: 'absolute', left: 450}}>
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Page Title */}
            <Typography component="h1" variant="h4" className="page-title" sx={{ mb: 4, color: '#283d3b', mt: -1 }}>
                Leaderboard
            </Typography>

            {/* Podium for Top 3 */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-end',
                gap: 2,
                mb: 6,
                position: 'relative',
                height: '300px'
            }}>
                {/* Second Place */}
                <Paper 
                    elevation={3}
                    sx={{ 
                        width: '200px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: '#C0C0C0'
                    }}
                >
                    <Icon sx={{ 
                        position: 'absolute',
                        top: -40,
                        color: '#C0C0C0',
                        fontSize: '2rem'
                    }}>
                        <FaCrown />
                    </Icon>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {topThree[1]?.name || 'No participant'}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[1]?.points || 0}
                    </Typography>
                </Paper>

                {/* First Place */}
                <Paper 
                    elevation={3}
                    sx={{ 
                        width: '200px',
                        height: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: '#FFD700'
                    }}
                >
                    <Icon sx={{ 
                        position: 'absolute',
                        top: -50,
                        color: '#FFD700',
                        fontSize: '2.5rem'
                    }}>
                        <FaCrown />
                    </Icon>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {topThree[0]?.name || 'No participant'}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[0]?.points || 0}
                    </Typography>
                </Paper>

                {/* Third Place */}
                <Paper 
                    elevation={3}
                    sx={{ 
                        width: '200px',
                        height: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: '#CD7F32'
                    }}
                >
                    <Icon sx={{ 
                        position: 'absolute',
                        top: -30,
                        color: '#CD7F32',
                        fontSize: '1.5rem'
                    }}>
                        <FaCrown />
                    </Icon>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {topThree[2]?.name || 'No participant'}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[2]?.points || 0}
                    </Typography>
                </Paper>
            </Box>

            {/* Rest of the leaderboard */}
            <Paper elevation={3} sx={{ p: 2, width:'75%' }}>
                <List>
                    {restOfList.map((user) => (
                        <ListItem 
                            key={user.id}
                            sx={{
                                borderBottom: '1px solid #eee',
                                '&:last-child': {
                                    borderBottom: 'none'
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                    {user.rank}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={user.name}
                                secondary={`${user.points} points`}
                            />
                        </ListItem>
                    ))}
                    {restOfList.length === 0 && (
                        <ListItem>
                            <ListItemText 
                                primary="No other participants yet"
                                sx={{ textAlign: 'center' }}
                            />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Container>
    )
}

export default Leaderboard