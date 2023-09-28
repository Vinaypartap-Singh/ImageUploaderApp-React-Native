import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColor } from "../theme";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setLoading(false);
      }
      if (currentUser) {
        navigation.replace("Home");
      }
    });
  }, []);

  const logInUser = () => {
    if (email === "" || password === "") {
      Alert.alert(
        "Inavlid Details",
        "Please fill all the details properly.",
        [
          {
            text: "Cancel",
            style: "default",
          },
          {
            text: "Ok",
            style: "default",
          },
        ],
        { cancelable: true }
      );
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          Alert.alert(
            "Login Success",
            "Your account has been Logged In.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Ok",
                style: "default",
              },
            ],
            { cancelable: true }
          );
          navigation.replace("Home");
        })
        .catch((error) => {
          Alert.alert(
            "Error",
            error.message,
            [
              {
                text: "Cancel",
                style: "default",
              },
              {
                text: "Ok",
                style: "default",
              },
            ],
            { cancelable: true }
          );
        });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <View>
          <ActivityIndicator size={"large"} color={themeColor.darkColor} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 30 }}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
            >
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
              onChangeText={(text) => setEmail(text)}
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
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity
            onPress={logInUser}
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
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
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
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={{ fontWeight: 600, fontSize: 16 }}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
