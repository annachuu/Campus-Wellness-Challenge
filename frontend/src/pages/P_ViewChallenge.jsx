/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: P_ViewChallenge.jsx
    For: Participants
*/

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getChallenge, getChallenges } from '../features/challenges/challengeSlice'
import { getLeaderboard } from '../features/leaderboard/leaderboardSlice'
import { getChallengeResources } from '../features/resources/resourceSlice'
import { getChallengeAchievements, claimAchievement } from '../features/achievements/achievementSlice'
import { getForumPosts, likePost } from '../features/forum/forumSlice'
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Link,
    Button
} from '@mui/material'
import { FaTrophy, FaComments, FaArrowLeft, FaFile, FaCheck } from 'react-icons/fa'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FavoriteIcon from '@mui/icons-material/Favorite'
import '../styles/pages.css'

function P_ViewChallenge() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { challenges, isLoading: challengesLoading } = useSelector((state) => state.challenge)
    const { leaderboard, isLoading: leaderboardLoading } = useSelector((state) => state.leaderboard)
    const { resources, isLoading: resourcesLoading } = useSelector((state) => state.resources)
    const { achievements, isLoading: achievementsLoading } = useSelector((state) => state.achievements)
    const { loading: claimLoading, error: claimError, success: claimSuccess } = useSelector((state) => state.achievementClaims)
    const { user } = useSelector((state) => state.auth)
    const { posts, isLoading: forumLoading } = useSelector((state) => state.forum)
    const [selectedChallenge, setSelectedChallenge] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            console.log('No user found, redirecting to login')
            navigate('/login')
            return
        }

        const challengeId = localStorage.getItem('selectedChallengeId')
        console.log('Selected Challenge ID:', challengeId)
        
        if (!challengeId) {
            console.log('No challenge ID found, redirecting to dashboard')
            navigate('/participant-dashboard')
            return
        }

        // Fetch challenge data
        dispatch(getChallenge(challengeId))
            .unwrap()
            .then((challenge) => {
                setSelectedChallenge(challenge)
                // After challenge is fetched, fetch related data
                dispatch(getLeaderboard(challengeId))
                dispatch(getChallengeResources(challengeId))
                dispatch(getChallengeAchievements(challengeId))
                dispatch(getForumPosts(challengeId))
            })
            .catch((error) => {
                console.error('Error fetching challenge data:', error)
                setError(error)
            })
    }, [dispatch, navigate, user])

    const handleClaimAchievement = async (achievementId) => {
        try {
            const challengeId = localStorage.getItem('selectedChallengeId')
            await dispatch(claimAchievement({ achievementId, challengeId })).unwrap()
            // Refresh leaderboard data after claiming
            dispatch(getLeaderboard(challengeId))
        } catch (error) {
            console.error('Error claiming achievement:', error)
        }
    }

    const handleLike = async (postId, e) => {
        e.stopPropagation() // Prevent navigation to forum page
        try {
            console.log('Liking post:', postId) // Debug log
            console.log('Current user:', user) // Debug log
            const result = await dispatch(likePost(postId)).unwrap()
            console.log('Like result:', result) // Debug log
            // Refresh posts after liking
            dispatch(getForumPosts(selectedChallenge._id))
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }

    // Show loading state only while initially fetching challenge data
    if (challengesLoading && !selectedChallenge) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress />
                <Typography>Loading challenge details...</Typography>
            </Box>
        )
    }

    // Show error state if there's an error
    if (error || !selectedChallenge) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Error loading challenge details'}
                </Alert>
                <IconButton 
                    onClick={() => navigate('/participant-dashboard')} 
                    sx={{ mt: 2 }}
                >
                    <FaArrowLeft /> Back to Dashboard
                </IconButton>
            </Box>
        )
    }

    return (
        <Container component="main" className="page-container" sx={{ 
            mt: 5,
            maxWidth: '1800px !important',
            width: '100%'
        }}>
            {/* Back Button */}
            <IconButton 
                onClick={() => navigate('/participant-dashboard')} 
                sx={{ position: 'absolute', left: 20, top: 20 }}
            >
                <FaArrowLeft />
            </IconButton>

            {/* Back Arrow */}
            <IconButton onClick={() => navigate('/participant-dashboard')} sx={{position: 'absolute', left: 450, mt: 5}}>
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Challenge Title */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                color: '#283D3B',
                mb: 4,
                mt: 4,
                textAlign: 'center'
            }}>
                {selectedChallenge.name}
            </Typography>

            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                px: 2
            }}>
                <Grid container spacing={3} sx={{ 
                    maxWidth: '1200px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 3
                }}>
                    {/* Top Left - Challenge Details */}
                    <Grid item>
                        <Paper sx={{ 
                            p: 2, 
                            height: '100%',
                            aspectRatio: '1/1',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                color: '#283D3B'
                            }}>
                                <FaTrophy />
                                Challenge Details
                            </Typography>
                            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                                <ListItem>
                                    <ListItemText 
                                        primary="Description" 
                                        secondary={selectedChallenge.description}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Type" 
                                        secondary={selectedChallenge.type}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Goal" 
                                        secondary={selectedChallenge.goal}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Frequency" 
                                        secondary={selectedChallenge.frequency}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Date Range" 
                                        secondary={`${new Date(selectedChallenge.startDate).toLocaleDateString()} to ${new Date(selectedChallenge.endDate).toLocaleDateString()}`}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <Typography variant="subtitle1" sx={{ color: '#283D3B', fontWeight: 'bold' }}>
                                        Achievements
                                    </Typography>
                                </ListItem>
                                {achievementsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : achievements && achievements.length > 0 ? (
                                    achievements.map((achievement) => (
                                        <ListItem key={achievement._id}>
                                            <ListItemText
                                                primary={achievement.title}
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2">
                                                            {achievement.points} points • {achievement.refreshTime}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {achievement.lastClaimed && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Last claimed: {new Date(achievement.lastClaimed).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleClaimAchievement(achievement._id)}
                                                                disabled={!achievement.canClaim || claimLoading}
                                                                sx={{
                                                                    backgroundColor: achievement.canClaim ? '#795663' : 'grey.400',
                                                                    '&:hover': {
                                                                        backgroundColor: achievement.canClaim ? '#5c3f4a' : 'grey.400'
                                                                    }
                                                                }}
                                                            >
                                                                {claimLoading ? <CircularProgress size={20} /> : 'Claim'}
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText 
                                            primary="No achievements available"
                                            secondary="Check back later for new achievements"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Top Right - Leaderboard */}
                    <Grid item>
                        <Paper 
                            onClick={() => {
                                localStorage.setItem('selectedChallengeId', selectedChallenge._id)
                                navigate('/leaderboard')
                            }}
                            sx={{ 
                                p: 2, 
                                height: '100%',
                                aspectRatio: '1/1',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            <Typography variant="h6" component="h2" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                color: '#283D3B'
                            }}>
                                <FaTrophy />
                                Leaderboard
                            </Typography>
                            <List sx={{ 
                                flexGrow: 1,
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        background: '#555',
                                    },
                                },
                            }}>
                                {leaderboardLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : leaderboard && leaderboard.length > 0 ? (
                                    leaderboard.map((entry, index) => (
                                        <React.Fragment key={entry._id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body1">
                                                                {index + 1}. {entry.participant.name}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                {entry.points} pts
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < leaderboard.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="No participants enrolled yet" />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Bottom Left - Resources */}
                    <Grid item>
                        <Paper sx={{ 
                            p: 2, 
                            height: '100%',
                            aspectRatio: '1/1',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Typography variant="h6" component="h2" sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: '#283D3B'
                                }}>
                                    <FaFile />
                                    Resources
                                </Typography>
                            </Box>
                            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                                {resourcesLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : resources && resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <React.Fragment key={resource._id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={resource.title}
                                                    secondary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2">
                                                                {resource.fileName}
                                                            </Typography>
                                                            <Link
                                                                href={`http://localhost:5000${resource.fileUrl}`}
                                                                download={resource.fileName}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                color="#795663"
                                                                sx={{ ml: 2, color: '#795663'}}
                                                            >
                                                                Download
                                                            </Link>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="No resources uploaded yet" />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Bottom Right - Forum Posts */}
                    <Grid item>
                        <Paper 
                            onClick={() => {
                                localStorage.setItem('selectedChallengeId', selectedChallenge._id)
                                navigate('/forum')
                            }}
                            sx={{ 
                                p: 2, 
                                height: '100%',
                                aspectRatio: '1/1',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            <Typography variant="h6" component="h2" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                color: '#283D3B'
                            }}>
                                <FaComments />
                                Forum Posts
                            </Typography>
                            <List sx={{ 
                                wordBreak: 'break-word', 
                                whiteSpace: 'prep-wrap', 
                                flexGrow: 1, 
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        background: '#555',
                                    },
                                },
                            }}>
                                {forumLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : posts && posts.length > 0 ? (
                                    posts.slice(0, 5).map((post) => {
                                        console.log('Post data:', post) // Debug log
                                        const isLiked = post.likes?.some(like => like.toString() === user._id)
                                        console.log('Is liked:', isLiked) // Debug log
                                        return (
                                            <React.Fragment key={post._id}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={
                                                            <Typography 
                                                                variant="body1" 
                                                                sx={{ 
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    mb: 1
                                                                }}
                                                            >
                                                                {post.content}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">
                                                                    {post.userName}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body2">
                                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        <IconButton 
                                                                            size="small" 
                                                                            onClick={(e) => handleLike(post._id, e)}
                                                                            sx={{ 
                                                                                color: isLiked ? '#795663' : 'inherit',
                                                                                '&:hover': {
                                                                                    color: '#795663'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <FavoriteIcon />
                                                                        </IconButton>
                                                                        <Typography variant="caption" sx={{ mt: -0.5 }}>
                                                                            {post.likes?.length || 0}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider />
                                            </React.Fragment>
                                        )
                                    })
                                ) : (
                                    <ListItem>
                                        <ListItemText 
                                            primary="No posts yet"
                                            secondary="Be the first to start a discussion"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default P_ViewChallenge