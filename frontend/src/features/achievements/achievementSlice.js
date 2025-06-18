import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Get achievements for a challenge
export const getChallengeAchievements = createAsyncThunk(
    'achievements/getChallengeAchievements',
    async (challengeId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const response = await axios.get(`/api/achievements/challenge/${challengeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// Create a new achievement
export const createAchievement = createAsyncThunk(
    'achievements/createAchievement',
    async (achievementData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const response = await axios.post('/api/achievements', achievementData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// Claim an achievement
export const claimAchievement = createAsyncThunk(
    'achievements/claimAchievement',
    async ({ achievementId, challengeId }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const response = await axios.post('/api/achievements/claim', 
                { achievementId, challengeId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    achievements: [],
    loading: false,
    error: null,
    success: false
}

const achievementSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Get achievements
            .addCase(getChallengeAchievements.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getChallengeAchievements.fulfilled, (state, action) => {
                state.loading = false
                state.achievements = action.payload
                state.error = null
            })
            .addCase(getChallengeAchievements.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to fetch achievements'
            })
            // Create achievement
            .addCase(createAchievement.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(createAchievement.fulfilled, (state, action) => {
                state.loading = false
                state.achievements.push(action.payload)
                state.success = true
                state.error = null
            })
            .addCase(createAchievement.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to create achievement'
                state.success = false
            })
            // Claim achievement
            .addCase(claimAchievement.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(claimAchievement.fulfilled, (state, action) => {
                state.loading = false
                // Update the achievement's claim status
                const achievementIndex = state.achievements.findIndex(
                    a => a._id === action.meta.arg.achievementId
                )
                if (achievementIndex !== -1) {
                    state.achievements[achievementIndex] = {
                        ...state.achievements[achievementIndex],
                        canClaim: false,
                        lastClaimed: action.payload.lastClaimed
                    }
                }
                state.error = null
            })
            .addCase(claimAchievement.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to claim achievement'
            })
    }
})

export const { reset } = achievementSlice.actions
export default achievementSlice.reducer 