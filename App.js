import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ScreenCapture from "expo-screen-capture"; // tambah ini
import { useEffect } from "react"; // tambah ini
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

import AddTaskScreen from "./screens/AddTaskScreen";
import DetailTaskScreen from "./screens/DetailTaskScreen";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    ScreenCapture.allowScreenCaptureAsync(); // tambah ini
  }, []);

  return (
    <AuthProvider>
      <TaskProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
            <Stack.Screen name="DetailTask" component={DetailTaskScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </AuthProvider>
  );
}
