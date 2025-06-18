const asyncHandler = require('express-async-handler')
const ForumPost = require('../models/forumModel')

// @desc    GET all forum posts
// @route   GET /api/forum
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
    console.log('Getting posts for challenge:', req.query.challengeId) // Debug log
    const { challengeId } = req.query
    if (!challengeId) {
        res.status(400)
        throw new Error('Challenge ID is required')
    }

    try {
        const posts = await ForumPost.find({ challenge: challengeId }).sort({ createdAt: -1 })
        console.log('Found posts:', posts) // Debug log
        res.status(200).json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        throw error
    }
})

// @desc    Create a forum post
// @route   POST /api/forum
// @access  Private
const createPosts = asyncHandler(async (req, res) => {
    console.log('Creating post with data:', req.body) // Debug log
    console.log('User data:', req.user) // Debug log

    if (!req.body.content) {
        res.status(400)
        throw new Error('Please add content')
    }

    if (!req.body.challengeId) {
        res.status(400)
        throw new Error('Challenge ID is required')
    }

    try {
        const post = await ForumPost.create({
            content: req.body.content,
            user: req.user._id,
            userRole: req.user.role === 'coordinator' ? 'Coordinator' : 'Participant',
            userName: req.user.name,
            challenge: req.body.challengeId
        })

        console.log('Created post:', post) // Debug log
        res.status(201).json(post)
    } catch (error) {
        console.error('Error creating post:', error)
        throw error
    }
})

// @desc    Like a post
// @route   PATCH /api/forum/:id/like
// @access  Private
const likePosts = asyncHandler(async (req, res) => {
    const post = await ForumPost.findById(req.params.id)

    if (!post) {
        res.status(400)
        throw new Error('Post not found')
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(req.user._id)

    if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString())
    } else {
        // Like
        post.likes.push(req.user._id)
    }

    await post.save()
    res.status(200).json(post)
})

module.exports = {
    getPosts,
    createPosts,
    likePosts
}


