import axios from 'axios'

const API_URL = 'http://localhost:5000/api/forum'

// Get forum posts
const getPosts = async (challengeId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}?challengeId=${challengeId}`, config)
    return response.data
}

// Create forum post
const createPost = async (postData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, {
        content: postData.content,
        challengeId: postData.challengeId
    }, config)
    return response.data
}

// Like/Unlike post
const likePost = async (postId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.patch(`${API_URL}/${postId}/like`, {}, config)
    return response.data
}

const forumService = {
    getPosts,
    createPost,
    likePost
}

export default forumService 