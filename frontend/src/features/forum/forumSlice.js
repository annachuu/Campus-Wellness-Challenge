import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import forumService from './forumService'

const initialState = {
    posts: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

// Get forum posts
export const getForumPosts = createAsyncThunk(
    'forum/getPosts',
    async (challengeId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await forumService.getPosts(challengeId, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Create forum post
export const createPost = createAsyncThunk(
    'forum/createPost',
    async (postData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await forumService.createPost(postData, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const forumSlice = createSlice({
    name: 'forum',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getForumPosts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getForumPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
            })
            .addCase(getForumPosts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createPost.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts.unshift(action.payload)
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = forumSlice.actions
export default forumSlice.reducer 