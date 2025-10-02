import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
import { db, storage } from "../../firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// summarise DATA = posts[], loading(true/false)
// summarise Action = create, read, update, delete post

//const BASE_URL = 'https://15a0e20f-89bb-4a0a-b88b-c1d90060eb7e-00-2bmtdh16rshw6.sisko.replit.dev'

// Reading a post
export const fetchPostsByUser = createAsyncThunk(
    'posts/fetchByUser',
    async (userId) => {
        //const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
        //return response.json()

        try {
            const postRef = collection(db, `users/${userId}/posts`)

            const querySnapshot = await getDocs(postRef)
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            return docs
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

//  have 2 thung is name and operation that running
export const savePost = createAsyncThunk(
    'post/savePost', //name
    async ({ userId, postContent, file }) => {
        try {
            //get image url
            let imageUrl = ''
            console.log(file)
            if (file !== null) {
                const imageRef = ref(storage, `posts/${file.name}`)
                const response = await uploadBytes(imageRef, file)
                imageUrl = await getDownloadURL(response.ref)
            }
            const postsRef = collection(db, `users/${userId}/posts`)
            console.log(`users/${userId}/posts`)
            const newPostRef = doc(postsRef)
            console.log(postContent)
            await setDoc(newPostRef, { content: postContent, likes: [], imageUrl })
            const newPost = await getDoc(newPostRef)

            const post = {
                id: newPost.id,
                ...newPost.data()
            }

            return post
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    //operation that running
    /* async (postContent) => {
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
    //    return response.data
    // } 
)

export const likePost = createAsyncThunk("posts/likePosts",
    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`)
            const docSnap = await getDoc(postRef)

            if (docSnap.exists()) {
                const postData = docSnap.data()
                const likes = [...postData.likes, userId]
                setDoc(postRef, { ...postData, likes })
            }
            return { userId, postId }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

export const removeLikeFromPost = createAsyncThunk(
    'posts/UnlikePost',

    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`)
            const docSnap = await getDoc(postRef)

            if (docSnap.exists()) {
                const postData = docSnap.data()

                const newLikes = postData.likes.filter((id) => id !== userId)
                await setDoc(postRef, { ...postData, likes: newLikes })
            }

            return { userId, postId }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async ({ userId, postId, newPostContent, newFile }) => {
        try {
            let newImageUrl
            if (newFile) {
                const imageRef = ref(storage, `posts/${newFile.name}`)
                const response = await uploadBytes(imageRef, newFile)
                newImageUrl = await getDownloadURL(response.ref)
            }
            const postRef = doc(db, `users/${userId}/posts/${postId}`)
            const postSnap = await getDoc(postRef)
            if (postSnap.exists()) {
                const postData = postSnap.data()
                const updatedData = {
                    ...postData,
                    content: newPostContent || postData.content,
                    imageURL: newImageUrl || postData.imageURL
                }
                await updateDoc(postRef, updatedData)
                const updatedPost = { id: postId, ...updatedData }
                return updatedPost
            } else {
                throw new Error("Post does not exist")
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},  // Synchronous operation only
    //Asynchronous operation that can involve delay/internet
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsByUser.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false
            })
            .addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts]
            }).addCase(likePost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload
                // const userId = action.payload.userId same as postId

                const postIndex = state.posts.findIndex((post) => post.id === postId)
                if (postIndex !== -1) {
                    state.posts[postIndex].likes.push(userId)
                }

            }).addCase(removeLikeFromPost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload
                const postIndex = state.posts.findIndex((post) => post.id === postId)

                if (postIndex !== -1) {
                    state.posts[postIndex].likes = state.posts[postIndex].likes.filter((id) => id !== userId)
                }
            }).addCase(updatePost.fulfilled, (state, action) => {
                const updatedPost = action.payload
                const postIndex = state.posts.findIndex(
                    (post) => post.id === updatedPost.id
                )
                if (postIndex === -1) {
                    state.posts[postIndex] = updatedPost
                }
            })
    }
})

export default postsSlice.reducer