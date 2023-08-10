import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import {
	signupUser,
	signInUser,
	signOutUser,
	fetchCurrentUser,
} from "./authOperations";

const initialState = {
	user: { userId: null },
	isLoggedIn: false,
	isLoading: false,
	isLoginFailed: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(signupUser.pending, (state, action) => {
			state.isLoading = true,
				state.isLoginFailed = false;
		});
		builder.addCase(signupUser.fulfilled, (state, action) => {
			state.isLoading = false
			state.user.userId = action.payload.userId;
			state.isLoggedIn = true;
			state.isLoginFailed = false;
		});
		builder.addCase(signupUser.rejected, (state, action) => {
			state.isLoading = false
			state.isLoginFailed = true;
			state.isLoggedIn = false;
		});
		builder.addCase(signInUser.pending, (state, action) => {
			state.isLoading = true;
			state.isLoginFailed = false;
		});
		builder.addCase(signInUser.fulfilled, (state, action) => {
			state.isLoading = false
			state.user.userId = action.payload.userId;
			state.isLoggedIn = true;
			state.isLoginFailed = false;
		});
		builder.addCase(signInUser.rejected, (state, action) => {
			state.isLoading = false
			state.isLoginFailed = true;
		});
		builder.addCase(signOutUser.fulfilled, (state) => {
			state.isLoggedIn = false;
			state.user = initialState.user;
		});
		builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
			if (action.payload) {
				state.user.userId = action.payload.userId;
				state.isLoggedIn = action.payload.isLoggedIn;
			}
		});
		builder.addCase(fetchCurrentUser.rejected, (state, action) => {
			state.user = initialState.user;
			state.isLoggedIn = false;
		});
	},
});

const persistConfig = {
	key: "auth",
	storage: AsyncStorage,
	whitelist: ["user", "isLoggedIn"],
};

export const authPersistedReducer = persistReducer(
	persistConfig,
	authSlice.reducer
);

export const { setStoragePosts } = authSlice.actions;
