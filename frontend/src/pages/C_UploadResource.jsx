/*
    CS 731/490AP Spring 2025
    Group Members:
                Julia Hu
                Anna Chu
    File Name: C_UploadResource.jsx
    For: Coordinators
*/

import React, {useState} from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Icon,
  Grid,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress
} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import { FaCloudUploadAlt, FaFile, FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { uploadResource } from '../features/resources/resourceSlice'
import { toast } from 'react-toastify'
import '../styles/pages.css'

function UploadResource() {
    const [resourceTitle, setResourceTitle] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const [files, setFiles] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.resources)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        }
        else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files)
            setFiles(prevFiles => [...prevFiles, ...newFiles])
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            setFiles(prevFiles => [...prevFiles, ...newFiles])
        }
    }

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (!resourceTitle.trim()) {
            toast.error('Please enter a resource title')
            return
        }

        if (files.length === 0) {
            toast.error('Please select at least one file')
            return
        }

        const challengeId = localStorage.getItem('selectedChallengeId')
        if (!challengeId) {
            toast.error('No challenge selected')
            return
        }

        // Create FormData for file upload
        const formData = new FormData()
        formData.append('title', resourceTitle)
        formData.append('challengeId', challengeId)
        formData.append('file', files[0]) // For now, just upload the first file

        try {
            await dispatch(uploadResource(formData)).unwrap()
            toast.success('Resource uploaded successfully')
            navigate('/view-challenge')
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <Container component="main" maxWidth="md" className="page-container" sx={{pt: 10}}>
            <Paper elevation={3} sx={{p: 4, textAlign: 'center'}}>
                <Typography variant="h4" gutterBottom>
                    Upload Resource
                </Typography>

                <Box sx={{mb: 2}}>
                    <TextField
                        fullWidth
                        label="Resource Title"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        required
                    />
                </Box>

                <Box
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                        border: dragActive ? '3px dashed #1976d2' : '2px dashed #aaa',
                        borderRadius: 2,
                        padding: 6,
                        backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: '0.3s ease-in-out',
                        minHeight: '250px',
                        cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <Icon sx={{fontSize: '4rem', mb: 2, color: dragActive ? '#1976d2' : '#666'}}>
                        <FaCloudUploadAlt />
                    </Icon>
                    <Typography variant="body1" color="text.secondary">
                        Drag & Drop Files Here or Click to Select
                    </Typography>
                </Box>

                {files.length > 0 && (
                    <List sx={{ mt: 2, maxHeight: '200px', overflow: 'auto' }}>
                        {files.map((file, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => removeFile(index)}>
                                        <FaTrash />
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    <FaFile />
                                </ListItemIcon>
                                <ListItemText
                                    primary={file.name}
                                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button variant="outlined" color="#8a9688" onClick={() => navigate('/view-challenge')}>
                        Cancel
                    </Button>

                    <Button 
                        variant="contained" 
                        color="#8a9688" 
                        onClick={handleUpload}
                        disabled={!resourceTitle.trim() || files.length === 0 || isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Upload'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default UploadResource