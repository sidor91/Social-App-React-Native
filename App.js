import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import useRoute from "./router";
import { store, persistor } from "./redux/store";
import { useAuth } from "./utilites/hooks/useAuth";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/auth/authOperations";



SplashScreen.preventAutoHideAsync();

function App() {
	const [fontsLoaded] = useFonts({
		"Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
		"Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
	});
	const { isLoggedIn } = useAuth();
	const dispatch = useDispatch();
	// const state = useSelector((state) => state.auth)

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, [])



	
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

	const routing = useRoute(isLoggedIn);

	return (
		<View onLayout={onLayoutRootView} style={styles.container}>
			<NavigationContainer>{routing}</NavigationContainer>
		</View>
	);
}

export default function AppWrapper() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
