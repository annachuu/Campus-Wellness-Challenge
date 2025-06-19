const Challenge = require('../models/challengeModel')
const Leaderboard = require('../models/leaderboardModel')
const asyncHandler = require('express-async-handler')

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private
const createChallenge = asyncHandler(async (req, res) => {
    const { name, description, startDate, endDate, type, goal, frequency } = req.body

    if (!name || !description || !startDate || !endDate || !type || !goal || !frequency) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Create challenge
    const challenge = await Challenge.create({
        name,
        description,
        startDate,
        endDate,
        type,
        goal,
        frequency,
        createdBy: req.user.id
    })

    if (challenge) {
        res.status(201).json(challenge)
    } else {
        res.status(400)
        throw new Error('Invalid challenge data')
    }
})

// @desc    Get all challenges for a coordinator
// @route   GET /api/challenges
// @access  Private
const getChallenges = asyncHandler(async (req, res) => {
    // Get all challenges created by this coordinator
    const challenges = await Challenge.find({ createdBy: req.user.id })
    
    // Get participant counts for each challenge
    const challengesWithParticipants = await Promise.all(challenges.map(async (challenge) => {
        // Count participants in the leaderboard for this challenge
        const participantCount = await Leaderboard.countDocuments({ 
            challenge: challenge._id 
        })
        
        // Convert challenge to plain object and add participant count
        const challengeObj = challenge.toObject()
        challengeObj.participantCount = participantCount
        
        return challengeObj
    }))

    res.status(200).json(challengesWithParticipants)
})

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Private
const getChallenge = asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
        res.status(404)
        throw new Error('Challenge not found')
    }

    // Get participant count for this challenge
    const participantCount = await Leaderboard.countDocuments({ 
        challenge: challenge._id 
    })
    
    const challengeObj = challenge.toObject()
    challengeObj.participantCount = participantCount

    // If user is a coordinator, check if they created the challenge
    if (req.user.role === 'coordinator') {
        if (challenge.createdBy.toString() === req.user.id) {
            return res.status(200).json(challengeObj)
        }
        res.status(401)
        throw new Error('Not authorized to view this challenge')
    }

    // If user is a participant, check if they are enrolled
    if (req.user.role === 'participant') {
        const leaderboardEntry = await Leaderboard.findOne({
            challenge: req.params.id,
            participant: req.user.id
        })

        if (!leaderboardEntry) {
            res.status(401)
            throw new Error('Not authorized to view this challenge')
        }

        return res.status(200).json(challengeObj)
    }

    res.status(401)
    throw new Error('Not authorized to view this challenge')
})

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private (Coordinator only)
const deleteChallenge = asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
        res.status(404)
        throw new Error('Challenge not found')
    }

    // Check if the user is the creator of the challenge
    if (challenge.createdBy.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized to delete this challenge')
    }

    // Delete associated leaderboard entries first
    await Leaderboard.deleteMany({ challenge: req.params.id })

    // Delete the challenge
    await Challenge.findByIdAndDelete(req.params.id)

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    createChallenge,
    getChallenges,
    getChallenge,
    deleteChallenge
} 