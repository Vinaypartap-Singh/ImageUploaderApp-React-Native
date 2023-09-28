import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import Uploading from "../components/Uploading";
import { VideoCameraIcon, PhotoIcon } from "react-native-heroicons/outline";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { Video } from "expo-av";

export default function HomeScreen() {
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New File Added", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Upload Image Function
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      // Upload Image Function
      await uploadImage(result.assets[0].uri, "video");
    }
  };

  const uploadImage = async (uri, fileType) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Images/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Progress", progress);
        setProgress(progress.toFixed());
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // Save Data in Firebase
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          setVideo("");
        });
      }
    );
  };

  const saveRecord = async (fileType, url, createdAt) => {
    try {
      await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });

      Alert.alert(
        "Document Saved",
        "Your document has been saved successfully",
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
    } catch (error) {
      console.error("Error saving record:", error); // Log the error for debugging
      Alert.alert(
        "Error",
        "An error occurred while saving the document. Please try again later.",
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ProgressBar progress={50} /> */}
      {files.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {files.map((data, index) => {
            console.log(data);
            if (data.fileType === "image") {
              return (
                <Image
                  key={index}
                  source={{ uri: data.url }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              );
            } else {
              <Video
                source={{ uri: data.url }}
                rate={1.0}
                volume={1.0}
                useNativeControls
                style={{ width: 100, height: 100 }}
              />;
            }
          })}
          {/* <FlatList
          data={files}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => {
            return (
              <Image
                source={{ uri: item.url }}
                style={{ width: 100, height: 100 }}
              />
            );
          }}
        /> */}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 18 }}>
            Loading Files....
          </Text>
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      )}

      {image && <Uploading image={image} video={video} progress={progress} />}
      <View style={{ gap: 10, position: "absolute", bottom: 50, right: 30 }}>
        <TouchableOpacity
          onPress={pickVideo}
          style={{
            backgroundColor: "black",
            padding: 10,
            borderRadius: 500,
          }}
        >
          <VideoCameraIcon color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          style={{
            backgroundColor: "black",
            padding: 10,
            borderRadius: 500,
          }}
        >
          <PhotoIcon color={"white"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
