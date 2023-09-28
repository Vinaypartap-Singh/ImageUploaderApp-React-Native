import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { themeColor } from "../theme";

export default function LoginScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      <View style={{ paddingHorizontal: 30 }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}>
            Login To Continue
          </Text>
        </View>
        <View
          style={{
            borderWidth: 1,
            marginTop: 30,
            paddingVertical: 20,
            borderRadius: 5,
            backgroundColor: themeColor.grayColor,
            borderColor: themeColor.grayColor,
            paddingHorizontal: 30,
          }}
        >
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            marginTop: 20,
            paddingVertical: 20,
            borderRadius: 5,
            backgroundColor: themeColor.grayColor,
            borderColor: themeColor.grayColor,
            paddingHorizontal: 30,
          }}
        >
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
          />
        </View>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            marginTop: 20,
            paddingVertical: 20,
            borderRadius: 10,
            backgroundColor: themeColor.darkColor,
            borderColor: themeColor.darkColor,
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
          >
            Login
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 16 }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text style={{ fontWeight: 600, fontSize: 16 }}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
