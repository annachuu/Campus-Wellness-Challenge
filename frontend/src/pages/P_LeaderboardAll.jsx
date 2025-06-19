import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Typography,
    Paper,
    Box,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    CircularProgress,
    IconButton
} from '@mui/material'
import {
    PersonIcon
} from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { FaTrophy, FaMedal, FaArrowUp } from 'react-icons/fa'
import { getLeaderboard } from '../features/leaderboard/leaderboardSlice'
import { getParticipantChallenges } from '../features/participantChallenges/participantChallengesSlice'

const P_LeaderboardAll = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { challenges, isLoading, error } = useSelector((state) => state.participantChallenges)
    const { leaderboards, loading } = useSelector((state) => state.leaderboard)
    
    const [rankings, setRankings] = useState([])
    const [overallStats, setOverallStats] = useState({
        totalPoints: 0,
        totalChallenges: 0,
        averageRank: 0,
        bestRank: null,
        bestChallenge: null
    })

    useEffect(() => {
        console.log('Fetching participant challenges...')
        dispatch(getParticipantChallenges())
    }, [dispatch])

    useEffect(() => {
        if (challenges && challenges.length > 0) {
            console.log('Fetching leaderboards for challenges:', challenges.map(c => ({ id: c._id, name: c.name || c.title })))
            // Fetch leaderboard data for all enrolled challenges
            challenges.forEach(challenge => {
                dispatch(getLeaderboard(challenge._id))
            })
        }
    }, [challenges, dispatch])

    useEffect(() => {
        console.log('Current state - leaderboards:', leaderboards)
        console.log('Current state - challenges:', challenges)
        console.log('Current state - loading:', loading)
        console.log('Current state - isLoading:', isLoading)
        
        if (leaderboards && challenges) {
            console.log('Processing leaderboards and challenges:', { leaderboards, challenges })
            console.log('User ID:', user._id)
            const userRankings = []
            let totalPoints = 0
            let totalChallenges = challenges.length
            let bestRank = null
            let bestChallenge = null

            challenges.forEach(challenge => {
                const leaderboard = leaderboards[challenge._id]
                console.log(`Challenge ${challenge.name || challenge.title}:`, { leaderboard })
                if (leaderboard && Array.isArray(leaderboard)) {
                    // Find user's position in this challenge
                    const userEntry = leaderboard.find(entry => 
                        entry.participant._id === user._id
                    )
                    console.log(`User entry for ${challenge.name || challenge.title}:`, userEntry)
                    
                    if (userEntry) {
                        const userRank = leaderboard.findIndex(entry => 
                            entry.participant._id === user._id
                        ) + 1
                        
                        totalPoints += userEntry.points
                        
                        if (!bestRank || userRank < bestRank) {
                            bestRank = userRank
                            bestChallenge = challenge
                        }

                        userRankings.push({
                            challenge: challenge,
                            rank: userRank,
                            points: userEntry.points,
                            totalParticipants: leaderboard.length,
                            leaderboard: leaderboard
                        })
                    }
                }
            })

            console.log('Final userRankings:', userRankings)
            // Sort by rank (best rank first)
            userRankings.sort((a, b) => a.rank - b.rank)

            setRankings(userRankings)
            setOverallStats({
                totalPoints,
                totalChallenges,
                averageRank: userRankings.length > 0 ? 
                    Math.round(userRankings.reduce((sum, r) => sum + r.rank, 0) / userRankings.length) : 0,
                bestRank,
                bestChallenge
            })
        }
    }, [leaderboards, challenges, user._id])

    const getRankIcon = (rank) => {
        if (rank === 1) return <FaTrophy style={{ color: '#FFD700' }} />
        if (rank === 2) return <FaMedal style={{ color: '#C0C0C0' }} />
        if (rank === 3) return <FaMedal style={{ color: '#CD7F32' }} />
        return <FaArrowUp />
    }

    const getRankColor = (rank) => {
        if (rank === 1) return '#FFD700'
        if (rank === 2) return '#C0C0C0'
        if (rank === 3) return '#CD7F32'
        return '#795663'
    }

    if (loading || isLoading) {
        return (
            <Container component="main" className="page-container" sx={{ mt: 10 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    return (
        <Container component="main" className="page-container" sx={{ mt: 10 }}>
            {/* Back Arrow */}
            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 450 }}>
                <ArrowBackIosNewIcon />
            </IconButton>

            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                color: '#283D3B',
                mb: 4,
                textAlign: 'center'
            }}>
                My Rankings
            </Typography>

            {/* Challenge Rankings */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#283D3B', mb: 2 }}>
                    Challenge Rankings
                </Typography>
                
                {rankings.length > 0 ? (
                    <List>
                        {rankings.map((ranking, index) => (
                            <React.Fragment key={ranking.challenge._id}>
                                <ListItem sx={{ 
                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                    borderRadius: 1,
                                    mb: 1
                                }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ 
                                            backgroundColor: getRankColor(ranking.rank),
                                            color: 'white'
                                        }}>
                                            {getRankIcon(ranking.rank)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#283D3B' }}>
                                                    {ranking.challenge.name || ranking.challenge.title}
                                                </Typography>
                                                <Typography variant="h6" sx={{ 
                                                    color: getRankColor(ranking.rank),
                                                    fontWeight: 'bold'
                                                }}>
                                                    #{ranking.rank}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {ranking.points} points
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < rankings.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box textAlign="center" py={4}>
                        <Typography variant="body1" color="text.secondary">
                            No rankings available. Join some challenges to see your rankings!
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}

export default P_LeaderboardAll 