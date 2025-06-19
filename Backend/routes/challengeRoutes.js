const express = require('express')
const router = express.Router()
const { createChallenge, getChallenges, getChallenge, deleteChallenge } = require('../controllers/challengeController')
const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(protect, createChallenge)
    .get(protect, getChallenges)

router.route('/:id')
    .get(protect, getChallenge)
    .delete(protect, deleteChallenge)

module.exports = router 