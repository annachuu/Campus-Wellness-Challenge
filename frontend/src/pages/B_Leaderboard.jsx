/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: B_Leaderboard.jsx
    For: Both coordinator and participants
*/

import React from 'react'
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
  IconButton
} from '@mui/material'
import { FaCrown } from 'react-icons/fa'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import '../styles/pages.css'

function Leaderboard() {
    // Mock data 
    const leaderboardData = [
        { id: 1, name: 'John Doe', points: 1500, rank: 1 },
        { id: 2, name: 'Jane Smith', points: 1200, rank: 2 },
        { id: 3, name: 'Mike Johnson', points: 1000, rank: 3 },
        { id: 4, name: 'Sarah Williams', points: 800, rank: 4 },
        { id: 5, name: 'David Brown', points: 750, rank: 5 },
        { id: 6, name: 'Emily Davis', points: 700, rank: 6 },
        { id: 7, name: 'Michael Wilson', points: 650, rank: 7 },
        { id: 8, name: 'Lisa Anderson', points: 600, rank: 8 },
    ]

    const topThree = leaderboardData.slice(0, 3)

    const restOfList = leaderboardData.slice(3)
    
    const navigate = useNavigate();
    

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>

            {/* Back Arrow */}
            <IconButton onClick={() => navigate('/view-challenge')} sx={{position: 'absolute', left: 450}}>
                <ArrowBackIosNewIcon />
            </IconButton>

            <Typography component="h1" variant="h4" className="page-title" sx={{ mb: 4, color: '#1976d2', mt: -1 }}>
                Leaderboard
            </Typography>

            {/* Podium for top 3 */}
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
                        {topThree[1]?.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[1]?.points}
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
                        {topThree[0]?.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[0]?.points}
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
                        {topThree[2]?.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {topThree[2]?.points}
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
                </List>
            </Paper>
        </Container>
    )
}

export default Leaderboard