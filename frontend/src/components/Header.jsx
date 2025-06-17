/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: Header.jsx
    For: Guests
*/
import React from 'react'
import { FaSignInAlt, FaSignOutAlt, FaUser, FaHome, FaTrophy } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Icon
} from '@mui/material'
import '../styles/pages.css'
import logo from '../images/logo.png'
import HomeIcon from '@mui/icons-material/Home';
import FlagIcon from '@mui/icons-material/Flag';
import ForumIcon from '@mui/icons-material/Forum';

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <AppBar 
            position="fixed" 
            className="header-container"
            sx={{
                backgroundColor: '#283D3B',
                width: '100vw',
                left: 0,
                right: 0
            }}
        >
            <Toolbar className="header-content" disableGutters>
                <Link className="logo-link">
                    <img src={logo} alt="Logo" style={{height: '40px'}}/>
                    <Typography variant="h6" component="div">
                        Campus Wellness Challenge
                    </Typography>
                </Link>

                <Box component="nav">
                    <ul className='nav-list'>
                        {user ? (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link to='/participant-dashboard' className='header-button'>
                                    <HomeIcon style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 25}} />
                                    Home
                                </Link>

                                <Link to='/view-challenge' className='header-button'>
                                    <FlagIcon style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 20}} />
                                    Challenges
                                </Link>

                                <Link to='/leaderboard' className='header-button'>
                                    <FaTrophy style={{verticalAlign: 'middle', marginTop: '-1px', fontSize: 15}} />
                                    Leaderboard
                                </Link>

                                <Link tp='/forum' className='header-button'>
                                    <ForumIcon style={{verticalAlign: 'middle', marginTop: '-1px', fontSize: 16}} />
                                    Forum
                                </Link>

                                <Button
                                    component={Link}
                                    to="/logout"
                                    className="header-button"
                                    startIcon={<FaSignInAlt style={{verticalAlign: 'middle', marginTop: '-1px', fontSize: 18}} />}

                                >
                                    Logout
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <li>
                                    <Link to='/leaderboard' className='header-button'>
                                        <FaTrophy style={{verticalAlign: 'middle', marginTop: '-1px'}} />
                                        Leaderboard
                                    </Link>
                                </li>
                                
                                <Button
                                    component={Link}
                                    to="/login"
                                    className="header-button"
                                    startIcon={<FaSignInAlt style={{verticalAlign: 'middle', marginTop: '-3px'}} />}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/pick-role"
                                    className="header-button"
                                    startIcon={<FaUser style={{verticalAlign: 'middle', marginTop: '-3px'}} />}
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                    </ul>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header