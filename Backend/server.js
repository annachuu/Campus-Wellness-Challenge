const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cors = require('cors')
const port = process.env.PORT || 5000

// Connect to database
connectDB()

const app = express()

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

// Routes
const participantRoutes = require('./routes/participantRoutes')
const coordinatorRoutes = require('./routes/coordinatorRoutes')
const challengeRoutes = require('./routes/challengeRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')
const resourceRoutes = require('./routes/resourceRoutes')

app.use('/api/participants', participantRoutes)
app.use('/api/coordinators', coordinatorRoutes)
app.use('/api/challenges', challengeRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/resources', resourceRoutes)

// Error handler
app.use(errorHandler)

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`))

const MONGO_URI = process.env.MONGO_URI || 'your_fallback_connection_string';


