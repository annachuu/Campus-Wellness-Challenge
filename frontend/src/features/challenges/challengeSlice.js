import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import challengeService from './challengeService'

const initialState = {
    challenges: [],
    challenge: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Create new challenge
export const createChallenge = createAsyncThunk(
    'challenges/create',
    async (challengeData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await challengeService.createChallenge(challengeData, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get all challenges
export const getChallenges = createAsyncThunk(
    'challenges/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await challengeService.getChallenges(token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get single challenge
export const getChallenge = createAsyncThunk(
    'challenges/getOne',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            console.log('Token from state:', token ? 'Present' : 'Missing')
            
            if (!token) {
                console.error('No token found in Redux state')
                return thunkAPI.rejectWithValue('Authentication token is missing')
            }

            return await challengeService.getChallenge(id, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            console.error('Error in getChallenge thunk:', message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Delete challenge
export const deleteChallenge = createAsyncThunk(
    'challenges/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await challengeService.deleteChallenge(id, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const challengeSlice = createSlice({
    name: 'challenge',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createChallenge.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createChallenge.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.challenges.push(action.payload)
            })
            .addCase(createChallenge.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getChallenges.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getChallenges.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.challenges = action.payload
            })
            .addCase(getChallenges.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getChallenge.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getChallenge.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.challenge = action.payload
            })
            .addCase(getChallenge.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteChallenge.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteChallenge.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                const deletedId = action.payload.id
                state.challenges = state.challenges.filter((challenge) => challenge._id !== deletedId)
            })
            .addCase(deleteChallenge.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = challengeSlice.actions
export default challengeSlice.reducer 