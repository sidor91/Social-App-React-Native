import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PostsScreen from "./nestedScreens/PostsScreen";
import CommentsScreen from "./nestedScreens/CommentsScreen";
import MapScreen from "./nestedScreens/MapScreen";
import { Feather } from "@expo/vector-icons";
import { signOutUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";


const NestedScreen = createStackNavigator();

const HomeScreen = () => {
	const dispatch = useDispatch();
	return (
		<NestedScreen.Navigator initialRouteName="Posts">
			<NestedScreen.Screen
				name="Posts"
				component={PostsScreen}
				options={{
					headerRight: () => (
						<TouchableOpacity
							onPress={() => {
								dispatch(signOutUser());
							}}
						>
							<Feather
								name="log-out"
								size={24}
								color="black"
								style={{ marginRight: 10, color: "#BDBDBD" }}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<NestedScreen.Screen name="Comments" component={CommentsScreen} />
			<NestedScreen.Screen name="Map" component={MapScreen} />
		</NestedScreen.Navigator>
	);
};

export default HomeScreen;


