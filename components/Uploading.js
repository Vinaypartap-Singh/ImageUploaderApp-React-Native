import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { VibrancyView } from "@react-native-community/blur";
import { Video } from "expo-av";
import ProgressBar from "./ProgressBar";

export default function Uploading({ image, video, progress }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000ad",
        },
      ]}
    >
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 20,
          borderRadius: 6,
          gap: 10,
          width: "80%",
          alignItems: "center",
        }}
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
              borderRadius: 50,
            }}
          />
        )}
        {video && (
          <Video
            source={{
              uri: video,
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            style={{ width: "80%", height: "80%" }}
            useNativeControls
          />
        )}
        <Text style={{ fontSize: 18, fontWeight: 500 }}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View
          style={{ width: "100%", borderWidth: 1, borderColor: "#00000010" }}
        ></View>
        <TouchableOpacity>
          <Text
            style={{
              color: "#3488f6",
              fontWeight: 600,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
