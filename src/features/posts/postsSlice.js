import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// summarise DATA = posts[], loading(true/false)
// summarise Action = create, read, update, delete post

const BASE_URL = 'https://15a0e20f-89bb-4a0a-b88b-c1d90060eb7e-00-2bmtdh16rshw6.sisko.replit.dev'

// Reading a post
export const fetchPostsByUser = createAsyncThunk(
    'posts/fetchByUser',
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
        return response.json()
    }
)

//  have 2 thung is name and operation that running
export const savePost = createAsyncThunk(
    'post/savaPost', //name
    //operation that running
    async (postContent) => {
        const token = localStorage.getItem('authToken')
        const decode = jwtDecode(token)
        const userId = decode.id

        const data = {
            title: 'Post Title',
            content: postContent,
            user_id: userId
        }

        const response = await axios.post(`${BASE_URL}/posts`, data)
        /* the data is mean this 
                const data = {
                    title: 'Post Title',
                    content: postContent,
                    user_id: userId
                }
        */
        return response.data
    }
)

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},  // Synchronous operation only
    //Asynchronous operation that can involve delay/internet
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false
        }),

            builder.addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts]
            })
    }
})

export default postsSlice.reducer