const asyncHandler = require('express-async-handler')
const Achievement = require('../models/achievementModel')
const Challenge = require('../models/challengeModel')
const Leaderboard = require('../models/leaderboardModel')

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private
const createAchievement = asyncHandler(async (req, res) => {
    const { title, points, refreshTime, challenge } = req.body

    if (!title || !points || !refreshTime || !challenge) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Verify the challenge exists
    const challengeExists = await Challenge.findById(challenge)
    if (!challengeExists) {
        res.status(404)
        throw new Error('Challenge not found')
    }

    // Create achievement
    const achievement = await Achievement.create({
        title,
        points,
        refreshTime,
        challenge,
        createdBy: req.user.id
    })

    if (achievement) {
        res.status(201).json(achievement)
    } else {
        res.status(400)
        throw new Error('Invalid achievement data')
    }
})

// @desc    Get achievements for a challenge
// @route   GET /api/achievements/challenge/:id
// @access  Private
const getChallengeAchievements = asyncHandler(async (req, res) => {
    const achievements = await Achievement.find({ challenge: req.params.id })
    res.status(200).json(achievements)
})

// @desc    Claim an achievement
// @route   POST /api/achievements/claim
// @access  Private
const claimAchievement = asyncHandler(async (req, res) => {
    const { achievementId, challengeId } = req.body

    if (!achievementId || !challengeId) {
        res.status(400)
        throw new Error('Please provide achievement and challenge IDs')
    }

    // Verify the achievement exists
    const achievement = await Achievement.findById(achievementId)
    if (!achievement) {
        res.status(404)
        throw new Error('Achievement not found')
    }

    // Verify the challenge exists
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
        res.status(404)
        throw new Error('Challenge not found')
    }

    // Find or create leaderboard entry
    let leaderboardEntry = await Leaderboard.findOne({
        challenge: challengeId,
        participant: req.user.id
    })

    if (!leaderboardEntry) {
        res.status(404)
        throw new Error('You are not enrolled in this challenge')
    }

    // Add points to the leaderboard entry
    leaderboardEntry.points += achievement.points
    await leaderboardEntry.save()

    res.status(200).json({
        message: 'Achievement claimed successfully',
        points: leaderboardEntry.points
    })
})

module.exports = {
    createAchievement,
    getChallengeAchievements,
    claimAchievement
} 