import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Claim an achievement
export const claimAchievement = createAsyncThunk(
    'achievementClaims/claimAchievement',
    async ({ achievementId, challengeId }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const response = await axios.post('/api/achievements/claim', {
                achievementId,
                challengeId
            }, {
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

const initialState = {
    loading: false,
    error: null,
    success: false
}

const achievementClaimSlice = createSlice({
    name: 'achievementClaims',
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
            .addCase(claimAchievement.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(claimAchievement.fulfilled, (state) => {
                state.loading = false
                state.success = true
                state.error = null
            })
            .addCase(claimAchievement.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to claim achievement'
                state.success = false
            })
    }
})

export const { reset } = achievementClaimSlice.actions
export default achievementClaimSlice.reducer 