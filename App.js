import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import { UserProvider } from "./src/context/UserContext";
import ApartmentDetailScreen from "./src/screens/ApartmentDetailScreen";
import ApartmentsScreen from "./src/screens/ApartmentsScreen";
import ColocationsScreen from "./src/screens/ColocationsScreen";
import CreateApartmentScreen from "./src/screens/CreateApartmentScreen";
import DetailColocationScreen from "./src/screens/DetailColocationScreen";
import HomeApartmentDetailScreen from "./src/screens/HomeApartmentDetailScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SplashScreen from "./src/screens/SplashScreen";
import StudiosDetailScreen from "./src/screens/StudiosDetailScreen";
import StudiosScreen from "./src/screens/StudiosScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Studios" component={StudiosScreen} />
          <Stack.Screen name="StudiosDetail" component={StudiosDetailScreen} />
          <Stack.Screen name="DetailColocation" component={DetailColocationScreen} />
          <Stack.Screen name="Colocations" component={ColocationsScreen} />
          <Stack.Screen name="HomeApartmentDetail" component={HomeApartmentDetailScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Apartments" component={ApartmentsScreen} />
          <Stack.Screen name="ApartmentDetail" component={ApartmentDetailScreen} />
          <Stack.Screen name="CreateApartment" component={CreateApartmentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
