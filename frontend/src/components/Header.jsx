/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: Header.jsx
    For: All
*/
import React from 'react'
import { FaSignInAlt, FaSignOutAlt, FaUser, FaHome, FaTrophy, FaPlus, FaUserPlus } from 'react-icons/fa'
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
                width: '100vw',
                left: 0,
                right: 0,
                backgroundColor: '#283D3B !important'
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
                        {!user ? (
                            // Guest version - not logged in
                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                        ) : user.role === 'participant' ? (
                            // Participant version
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link to='/participant-dashboard' className='header-button'>
                                    <HomeIcon style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 25}} />
                                    Home
                                </Link>

                                <Link to='/leaderboard-all' className='header-button'>
                                    <FaTrophy style={{verticalAlign: 'middle', marginTop: '-1px', fontSize: 15}} />
                                    Leaderboard
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
                            // Coordinator version
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link to='/coordinator-dashboard' className='header-button'>
                                    <HomeIcon style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 25}} />
                                    Home
                                </Link>

                                <Link to='/create-challenge' className='header-button'>
                                    <FaPlus style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 20}} />
                                    Create Challenge
                                </Link>

                                <Link to='/enroll-participant' className='header-button'>
                                    <FaUserPlus style={{verticalAlign: 'middle', marginTop: '-2px', fontSize: 20}} />
                                    Enroll Participant
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
                        )}
                    </ul>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header