const express = require('express')
const router = express.Router()
const { createAchievement, getChallengeAchievements, claimAchievement } = require('../controllers/achievementController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createAchievement)
router.get('/challenge/:id', protect, getChallengeAchievements)
router.post('/claim', protect, claimAchievement)

module.exports = router 