import { View, Text, Image } from "react-native";
import React from "react";

export default function EmptyState() {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/images/HomeImage.png")}
          style={{ width: 320, height: 320, objectFit: "cover" }}
        />
      </View>
      <View>
        <Text style={{ fontSize: 16, fontWeight: 500, color: "gray" }}>
          No Photo or Video uploaded yet
        </Text>
      </View>
    </View>
  );
}
