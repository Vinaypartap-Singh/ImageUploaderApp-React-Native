import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StackNavigator />
      <StatusBar style="auto" />
    </View>
  );
}
