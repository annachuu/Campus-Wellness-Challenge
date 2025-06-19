import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Enroll participants in a challenge
export const enrollParticipants = createAsyncThunk(
    'leaderboard/enroll',
    async ({ challengeId, participantIds }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/leaderboard/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ challengeId, participantIds })
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to enroll participants')
            }
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Get leaderboard for a challenge
export const getLeaderboard = createAsyncThunk(
    'leaderboard/get',
    async (challengeId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/leaderboard/${challengeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch leaderboard')
            }
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const initialState = {
    leaderboards: {},
    loading: false,
    isError: false,
    message: ''
}

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(enrollParticipants.pending, (state) => {
                state.loading = true
            })
            .addCase(enrollParticipants.fulfilled, (state, action) => {
                state.loading = false
                state.isError = false
                state.message = action.payload.message
            })
            .addCase(enrollParticipants.rejected, (state, action) => {
                state.loading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getLeaderboard.pending, (state) => {
                state.loading = true
            })
            .addCase(getLeaderboard.fulfilled, (state, action) => {
                state.loading = false
                // Store leaderboard by challenge ID
                const challengeId = action.meta.arg
                state.leaderboards[challengeId] = action.payload
            })
            .addCase(getLeaderboard.rejected, (state, action) => {
                state.loading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = leaderboardSlice.actions
export default leaderboardSlice.reducer 