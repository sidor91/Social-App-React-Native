import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const signupUser = createAsyncThunk(
	"users/signup",
	async ({ login, email, password, photo }, thunkAPI) => {
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = await auth.currentUser;
			if (user) {
				await updateProfile(user, {
					displayName: login,
					photoURL: photo,
				});
			}
			const updatedUser = await auth.currentUser;
			return {
				email: updatedUser.email,
				nickname: updatedUser.displayName,
				photo: updatedUser.photoURL,
				userId: updatedUser.uid,
			};
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const signInUser = createAsyncThunk(
	"users/signIn",
	async ({ login, email, password, photo }, thunkAPI) => {
		try {
			const response = await signInWithEmailAndPassword(auth, email, password);
			return {
				email: response.user.email,
				nickname: response.user.displayName,
				photo: response.user.photoURL,
				userId: response.user.uid,
			};
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const signOutUser = createAsyncThunk('users/signOut', async(_,thunkAPI)=> {
	await auth.signOut()
})

export const fetchCurrentUser = createAsyncThunk("users/fetchCurrentUser", async (_, thunkAPI) => {
	let response;
	await onAuthStateChanged(auth, (user) => {
		if (user) {
			response = {
				userId: user.uid,
				isLoggedIn: true,
			};
		} else {
			response = {
				userId: null,
				isLoggedIn: false,
			};
		}
	});
	return response;
})
