import axios from 'axios'

const API_URL = 'http://localhost:5000/api/challenges/'

// Create new challenge
const createChallenge = async (challengeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, challengeData, config)

    return response.data
}

// Get all challenges
const getChallenges = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

// Get single challenge
const getChallenge = async (id, token) => {
    if (!token) {
        console.error('No token provided for getChallenge')
        throw new Error('Authentication token is required')
    }

    console.log('Getting challenge with token:', token.substring(0, 10) + '...')

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        console.log('Making request to:', API_URL + id)
        const response = await axios.get(API_URL + id, config)
        console.log('Challenge response:', response.data)
        return response.data
    } catch (error) {
        console.error('Error in getChallenge:', error.response ? error.response.data : error.message)
        throw error
    }
}

// Delete challenge
const deleteChallenge = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + id, config)

    return response.data
}

const challengeService = {
    createChallenge,
    getChallenges,
    getChallenge,
    deleteChallenge
}

export default challengeService 