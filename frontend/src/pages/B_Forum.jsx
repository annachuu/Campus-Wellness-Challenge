/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_Forum.jsx
    For: Both coordinator and participants
*/

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper, 
  Avatar,
  TextField,
  Divider,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FavoriteIcon from '@mui/icons-material/Favorite'
import '../styles/pages.css'
import { createPost, getForumPosts, likePost } from '../features/forum/forumSlice'

function Forum() {
    const { user } = useSelector((state) => state.auth)
    const { posts, isLoading } = useSelector((state) => state.forum)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const challengeId = localStorage.getItem('selectedChallengeId')

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        if (challengeId) {
            dispatch(getForumPosts(challengeId))
        }
    }, [user, navigate, dispatch, challengeId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content) {
            setError('Please write something to post')
            return
        }

        try {
            console.log('Submitting post with:', { content, challengeId }) // Debug log
            const result = await dispatch(createPost({ 
                content, 
                challengeId 
            })).unwrap()
            setContent('')
            setError(null)
            // Refresh posts after creating a new one
            dispatch(getForumPosts(challengeId))
        } catch (error) {
            console.error('Error creating post:', error) // Debug log
            setError(error.message || 'Failed to create post')
        }
    }

    const handleLike = async (postId, e) => {
        e.stopPropagation()
        try {
            console.log('Liking post:', postId) // Debug log
            console.log('Current user:', user) // Debug log
            const result = await dispatch(likePost(postId)).unwrap()
            console.log('Like result:', result) // Debug log
            // Refresh posts after liking
            dispatch(getForumPosts(challengeId))
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }

    if (!challengeId) {
        return (
            <Container>
                <Alert severity="error">No challenge selected</Alert>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        )
    }

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>
            {/* Back Arrow */}
            <IconButton onClick={() => navigate('/view-challenge')} sx={{position: 'absolute', left: 450}}>
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Page Title */}
            <Typography component="h1" variant="h4" className="page-title" sx={{ mb: 4, color: '#283d3b', mt: -1 }}>
                Forum Posts
            </Typography>

            {/* Write a Post */}
            <Paper sx={{ p: 5, mb: 5, display: 'flex', gap: 3, alignItems: 'flex-start', width: 700}} >
                <Box textAlign="center" sx={{mt: 3}}>
                    <Avatar sx={{backgroundColor: '#d9bcaf', mx: 'auto'}}>
                        {user.name?.[0] || '?'}
                    </Avatar>
                    <Typography variant="caption">{user.name}</Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Share your thoughts and experiences!"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        required
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        sx={{ mt: 1, backgroundColor: '#8a9688'}}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Post'}
                    </Button>
                </Box>
            </Paper>

            <Divider sx={{ mb: 3}} />

            {/* List of Posts */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : posts && posts.length > 0 ? (
                posts.map((post) => {
                    console.log('Post data:', post) // Debug log
                    const isLiked = post.likes?.some(like => like.toString() === user._id)
                    console.log('Is liked:', isLiked) // Debug log
                    return (
                        <Paper key={post._id} sx={{ p: 3, mb: 3, width: 700, position: 'relative' }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box textAlign="center">
                                    <Avatar sx={{backgroundColor: '#795663'}}>
                                        {post.userName?.[0] || '?'}
                                    </Avatar>
                                    <Typography variant="caption">{post.userName}</Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1, textAlign: 'left', width: '100%' }}>
                                  {/* Text */}
                                  <Typography variant="body1" paragraph sx={{ wordBreak: 'break-word', whiteSpace: 'prep-wrap' }}>
                                      {post.content}
                                  </Typography>

                                  <Box sx={{ position: 'relative', height: 24}}>
                                    {/* Date */}
                                    <Typography variant="caption" color="text.secondary" sx={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0}}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </Typography>

                                    {/* Likes */}
                                    <Box sx={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                      <Typography variant="caption">
                                          {post.likes?.length || 0}
                                      </Typography>
                                    </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    )
                })
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    No posts yet. Be the first to start a discussion!
                </Typography>
            )}
        </Container>
    )
}

export default Forum