import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
      <StatusBar style="auto" />
    </View>
  );
}
