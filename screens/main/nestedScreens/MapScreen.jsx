import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function MapScreen({ route }) {
	const [location, setLocation] = useState(null);
	console.log('Map screen')

	useEffect(() => {
		setLocation(route.params.location);
	}, [route.params]);

	return (
		<View style={styles.container}>
			{!location && (
				<MapView
					style={{ flex: 1 }}
					initialRegion={{
						latitude: 37.78825,
						longitude: -122.4324,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			)}
			{location && (
				<MapView
					style={{ flex: 1 }}
					initialRegion={{
						latitude: location.latitude,
						longitude: location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				>
					<Marker
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
					/>
				</MapView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: "center",
		// alignItems: "center",
	},
});
