const asyncHandler = require('express-async-handler')
const Achievement = require('../models/achievementModel')
const Challenge = require('../models/challengeModel')
const Leaderboard = require('../models/leaderboardModel')
const AchievementClaim = require('../models/achievementClaimModel')

// Helper function to check if achievement can be claimed
const canClaimAchievement = (lastClaimed, refreshTime) => {
    console.log('Checking claim eligibility:', { lastClaimed, refreshTime }) // Debug log
    
    if (!lastClaimed) {
        console.log('No previous claim found, can claim') // Debug log
        return true
    }

    const now = new Date()
    const lastClaimedDate = new Date(lastClaimed)
    console.log('Dates:', { now: now.toISOString(), lastClaimed: lastClaimedDate.toISOString() }) // Debug log
    
    let canClaim = false
    switch (refreshTime) {
        case 'daily':
            canClaim = now.getDate() !== lastClaimedDate.getDate() ||
                      now.getMonth() !== lastClaimedDate.getMonth() ||
                      now.getFullYear() !== lastClaimedDate.getFullYear()
            console.log('Daily check result:', canClaim) // Debug log
            break
        case 'weekly':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            canClaim = lastClaimedDate < weekAgo
            console.log('Weekly check result:', canClaim) // Debug log
            break
        case 'monthly':
            canClaim = now.getMonth() !== lastClaimedDate.getMonth() ||
                      now.getFullYear() !== lastClaimedDate.getFullYear()
            console.log('Monthly check result:', canClaim) // Debug log
            break
        default:
            console.log('Invalid refresh time:', refreshTime) // Debug log
            canClaim = false
    }
    
    return canClaim
}

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
    console.log('Getting achievements for challenge:', req.params.id) // Debug log
    console.log('User role:', req.user.role) // Debug log
    
    const achievements = await Achievement.find({ challenge: req.params.id })
    console.log('Found achievements:', achievements.length) // Debug log
    
    // If user is a participant, include claim status
    if (req.user.role === 'participant') {
        console.log('User is participant, getting claim status') // Debug log
        const claims = await AchievementClaim.find({
            achievement: { $in: achievements.map(a => a._id) },
            participant: req.user.id
        })
        console.log('Found claims:', claims.length) // Debug log

        const achievementsWithClaimStatus = achievements.map(achievement => {
            const claim = claims.find(c => c.achievement.toString() === achievement._id.toString())
            console.log('Processing achievement:', { 
                id: achievement._id,
                hasClaim: !!claim,
                lastClaimed: claim ? claim.lastClaimed : null
            }) // Debug log
            
            const canClaim = claim ? canClaimAchievement(claim.lastClaimed, achievement.refreshTime) : true
            console.log('Can claim:', canClaim) // Debug log
            
            return {
                ...achievement.toObject(),
                canClaim,
                lastClaimed: claim ? claim.lastClaimed : null
            }
        })

        res.status(200).json(achievementsWithClaimStatus)
    } else {
        res.status(200).json(achievements)
    }
})

// @desc    Claim an achievement
// @route   POST /api/achievements/claim
// @access  Private
const claimAchievement = asyncHandler(async (req, res) => {
    const { achievementId, challengeId } = req.body
    console.log('Claim request:', { achievementId, challengeId, userId: req.user.id }) // Debug log

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
    console.log('Found achievement:', achievement) // Debug log

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

    // Check if achievement can be claimed
    let claim = await AchievementClaim.findOne({
        achievement: achievementId,
        participant: req.user.id
    })
    console.log('Existing claim:', claim) // Debug log

    if (claim && !canClaimAchievement(claim.lastClaimed, achievement.refreshTime)) {
        console.log('Cannot claim - too soon') // Debug log
        res.status(400)
        throw new Error(`This achievement can only be claimed ${achievement.refreshTime}`)
    }

    // Update or create claim record
    if (claim) {
        console.log('Updating existing claim') // Debug log
        claim.lastClaimed = new Date()
        await claim.save()
    } else {
        console.log('Creating new claim') // Debug log
        claim = await AchievementClaim.create({
            achievement: achievementId,
            participant: req.user.id,
            lastClaimed: new Date()
        })
    }

    // Add points to the leaderboard entry
    leaderboardEntry.points += achievement.points
    await leaderboardEntry.save()
    console.log('Updated leaderboard points:', leaderboardEntry.points) // Debug log

    res.status(200).json({
        message: 'Achievement claimed successfully',
        points: leaderboardEntry.points,
        lastClaimed: claim.lastClaimed
    })
})

module.exports = {
    createAchievement,
    getChallengeAchievements,
    claimAchievement
} 