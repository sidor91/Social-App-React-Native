import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SvgUri } from "react-native-svg";
import { Image, StyleSheet, View } from "react-native";
import { Ionicons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import HomeScreen from "./screens/main/HomeScreen";
import CreatePostScreen from "./screens/main/CreatePostsScreen";
import ProfileScreen from "./screens/main/ProfileScreen";
import MapScreen from "./screens/main/nestedScreens/MapScreen";
import PostsScreen from "./screens/main/nestedScreens/PostsScreen";
import CommentsScreen from "./screens/main/nestedScreens/CommentsScreen";

const useRoute = (isAuth) => {
	if (!isAuth) {
		return (
			<AuthStack.Navigator initialRouteName="Publications">
				<AuthStack.Screen
					name="Registration"
					component={RegistrationScreen}
					options={{ headerShown: false }}
				/>
				<AuthStack.Screen
					name="Login"
					component={LoginScreen}
					options={{ headerShown: false }}
				/>
			</AuthStack.Navigator>
		);
	}
	return (
		<MainTab.Navigator
		// screenOptions={{
		// 	unmountOnBlur: true,
		// }}
		>
			<MainTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					unmountOnBlur: true,
					tabBarShowLabel: false,
					headerShown: false,
					tabBarIcon: ({ focused, size, color }) => (
						<SimpleLineIcons name="grid" size={24} color="black" />
					),
				}}
			/>
			<MainTab.Screen
				name="Create"
				component={CreatePostScreen}
				options={{
					unmountOnBlur: true,
					tabBarShowLabel: false,
					title: "Create post",
					tabBarIcon: ({ focused, size, color }) => (
						<View style={styles.addButton}>
							<Ionicons name="md-add-outline" size={24} color="#FFFFFF" />
						</View>
					),
				}}
			/>
			<MainTab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					headerShown: false,
					unmountOnBlur: true,
					tabBarShowLabel: false,
					tabBarIcon: ({ focused, size, color }) => (
						<Feather name="user" size={24} color="black" />
					),
				}}
			/>
		</MainTab.Navigator>
	);
};

const styles = StyleSheet.create({
	addButton: {
		backgroundColor: "#FF6C00",
		width: 70,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},
	headerStyle: {
		marginHorizontal: 10,
	},
	homeHeaderStyle: {
		height: 88,
	},
});

export default useRoute;
