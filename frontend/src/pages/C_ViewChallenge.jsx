/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_ViewChallenge.jsx
    For: Coordinators
*/

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getChallenges } from '../features/challenges/challengeSlice'
import { getLeaderboard } from '../features/leaderboard/leaderboardSlice'
import { getChallengeResources } from '../features/resources/resourceSlice'
import { getChallengeAchievements } from '../features/achievements/achievementSlice'
import { getForumPosts } from '../features/forum/forumSlice'
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
    Button,
    CircularProgress,
    Link
} from '@mui/material'
import { FaTrophy, FaComments, FaPlus, FaFile } from 'react-icons/fa'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'

function C_ViewChallenge() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { challenges, isLoading: challengesLoading } = useSelector((state) => state.challenge)
    const { leaderboard, isLoading: leaderboardLoading } = useSelector((state) => state.leaderboard)
    const { resources, isLoading: resourcesLoading } = useSelector((state) => state.resources)
    const { achievements, isLoading: achievementsLoading } = useSelector((state) => state.achievements)
    const { posts, isLoading: forumLoading } = useSelector((state) => state.forum)
    const [selectedChallenge, setSelectedChallenge] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        dispatch(getChallenges())
    }, [dispatch])

    useEffect(() => {
        if (challenges && challenges.length > 0) {
            const selectedChallengeId = localStorage.getItem('selectedChallengeId')
            const challenge = selectedChallengeId 
                ? challenges.find(c => c._id === selectedChallengeId)
                : challenges[0]
            
            if (challenge) {
                setSelectedChallenge(challenge)
                dispatch(getLeaderboard(challenge._id))
                dispatch(getChallengeResources(challenge._id))
                dispatch(getChallengeAchievements(challenge._id))
                dispatch(getForumPosts(challenge._id))
            }
        }
    }, [dispatch, challenges])

    if (!challenges || challengesLoading || !selectedChallenge) {
        return <div>Loading...</div>
    }

    return (
        <Container component="main" className="page-container" sx={{ 
            mt: 5,
            maxWidth: '1800px !important',
            width: '100%'
        }}>

            {/* Back Arrow */}
            <IconButton onClick={() => navigate('/coordinator-dashboard')} sx={{position: 'absolute', left: 450, mt: 5}}>
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
                                {achievements && achievements.length > 0 ? (
                                    achievements.map((achievement) => (
                                        <React.Fragment key={achievement._id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={achievement.title}
                                                    secondary={`${achievement.points} points • ${achievement.refreshTime}`}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary="No achievements yet"
                                            sx={{ fontStyle: 'italic' }}
                                        />
                                    </ListItem>
                                )}
                                <Divider />
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        startIcon={<FaPlus />}
                                        onClick={() => {
                                            localStorage.setItem('selectedChallengeId', selectedChallenge._id)
                                            navigate('/add-achievement')
                                        }}
                                        sx={{
                                            backgroundColor: '#283D3B',
                                            '&:hover': {
                                                backgroundColor: '#8a9688'
                                            },
                                            width: '100%'
                                        }}
                                    >
                                        Add Achievement
                                    </Button>
                                </ListItem>
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
                                <Button
                                    variant="contained"
                                    startIcon={<FaPlus />}
                                    onClick={() => navigate('/upload-resource')}
                                    sx={{ 
                                        backgroundColor: '#283D3B',
                                        '&:hover': {
                                            backgroundColor: '#8a9688'
                                        }
                                    }}
                                >
                                    Upload Resource
                                </Button>
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
                                                                sx={{ ml: 2 }}
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
                                    posts.slice(0, 5).map((post) => (
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
                                                            <Typography variant="body2">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))
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

            {/* Enroll Button */}
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                mb: 4
            }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/enroll-participant')}
                    sx={{
                        backgroundColor: '#283D3B',
                        '&:hover': {
                            backgroundColor: '#8a9688'
                        },
                        minWidth: '200px'
                    }}
                >
                    Enroll Participant in Challenge
                </Button>
            </Box>
        </Container>
    )
}

export default C_ViewChallenge