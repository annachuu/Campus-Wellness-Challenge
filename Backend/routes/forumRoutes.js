const express = require('express')
const router = express.Router()
const { getPosts, createPosts, likePosts } = require('../controllers/forumController')

const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(protect, createPosts)
    .get(protect, getPosts)

router.patch('/:id/like', protect, likePosts)


module.exports = router