const asyncHandler = require('express-async-handler')
const Leaderboard = require('../models/leaderboardModel')
const Challenge = require('../models/challengeModel')
const Participant = require('../models/participantModel')

// @desc Enroll participants in a challenge
// @route POST /api/leaderboard/enroll
// @access Private
const enrollParticipants = asyncHandler(async (req, res) => {
    const { challengeId, participantIds } = req.body

    if (!challengeId || !participantIds || !Array.isArray(participantIds)) {
        res.status(400)
        throw new Error('Please provide a challenge ID and an array of participant IDs')
    }

    // Verify the challenge exists
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
        res.status(404)
        throw new Error('Challenge not found')
    }

    // Verify all participants exist
    const participants = await Participant.find({ _id: { $in: participantIds } })
    if (participants.length !== participantIds.length) {
        res.status(404)
        throw new Error('One or more participants not found')
    }

    // Create leaderboard entries for each participant
    const enrollments = await Promise.all(
        participantIds.map(async (participantId) => {
            try {
                return await Leaderboard.create({
                    challenge: challengeId,
                    participant: participantId,
                    points: 0
                })
            } catch (error) {
                // If participant is already enrolled, skip them
                if (error.code === 11000) {
                    console.log(`Participant ${participantId} is already enrolled in challenge ${challengeId}`)
                    return null
                }
                throw error
            }
        })
    )

    // Filter out null values (already enrolled participants)
    const successfulEnrollments = enrollments.filter(enrollment => enrollment !== null)

    res.status(201).json({
        message: `Successfully enrolled ${successfulEnrollments.length} participants`,
        enrollments: successfulEnrollments
    })
})

// @desc Get leaderboard for a challenge
// @route GET /api/leaderboard/:challengeId
// @access Private
const getLeaderboard = asyncHandler(async (req, res) => {
    const { challengeId } = req.params
    console.log('Getting leaderboard for challenge:', challengeId)

    // Verify the challenge exists
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
        console.log('Challenge not found:', challengeId)
        res.status(404)
        throw new Error('Challenge not found')
    }

    console.log('Challenge found:', challenge.name)

    // Check if there are any participants enrolled
    const participantCount = await Leaderboard.countDocuments({ challenge: challengeId })
    console.log('Number of participants enrolled:', participantCount)

    const leaderboard = await Leaderboard.find({ challenge: challengeId })
        .populate('participant', 'name email')
        .sort({ points: -1 })

    console.log('Found leaderboard entries:', leaderboard.length)

    if (leaderboard.length === 0) {
        console.log('No participants found in leaderboard')
        return res.status(200).json([])
    }

    res.status(200).json(leaderboard)
})

// @desc Get challenges for a specific participant
// @route GET /api/leaderboard/participant
// @access Private
const getParticipantChallenges = async (req, res) => {
    try {
        console.log('Getting challenges for participant:', req.user._id)
        
        // Get all leaderboard entries for this participant
        const leaderboardEntries = await Leaderboard.find({ 
            participant: req.user._id 
        })
        .populate({
            path: 'challenge',
            model: 'Challenge',
            select: 'name description type goal frequency startDate endDate status'
        })
        .lean()
        
        console.log('Found leaderboard entries:', JSON.stringify(leaderboardEntries, null, 2))

        if (!leaderboardEntries || leaderboardEntries.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            })
        }

        // Format the response to include challenge details, points, and participant count
        const challenges = await Promise.all(leaderboardEntries
            .filter(entry => entry.challenge) // Filter out any entries where challenge population failed
            .map(async entry => {
                // Get participant count for this challenge
                const participantCount = await Leaderboard.countDocuments({ 
                    challenge: entry.challenge._id 
                })

                return {
                    _id: entry.challenge._id,
                    name: entry.challenge.name,
                    description: entry.challenge.description,
                    type: entry.challenge.type,
                    goal: entry.challenge.goal,
                    frequency: entry.challenge.frequency,
                    startDate: entry.challenge.startDate,
                    endDate: entry.challenge.endDate,
                    status: entry.challenge.status,
                    points: entry.points,
                    participantCount
                }
            }))

        console.log('Formatted challenges:', JSON.stringify(challenges, null, 2))

        res.status(200).json({
            success: true,
            data: challenges
        })
    } catch (error) {
        console.error('Error in getParticipantChallenges:', error)
        res.status(500).json({
            success: false,
            error: error.message || 'Error fetching participant challenges'
        })
    }
}

module.exports = {
    enrollParticipants,
    getLeaderboard,
    getParticipantChallenges
} 