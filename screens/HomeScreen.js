import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import Uploading from "../components/Uploading";
import { VideoCameraIcon, PhotoIcon } from "react-native-heroicons/outline";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Video } from "expo-av";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";
import { themeColor } from "../theme";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const currentUser = auth.currentUser.uid;
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const docRef = doc(db, "users", `${currentUser}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFiles(docSnap.data().ImageDetails);
        setLoading(false);
      }
    };

    getData();
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
      const fileSize = result.assets[0].fileSize;

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
      const userDocRef = doc(db, "users", `${currentUser}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const existingImageDetails = userDoc.data().ImageDetails || [];

        existingImageDetails.push({ fileType, url, createdAt });

        await setDoc(
          userDocRef,
          {
            ImageDetails: existingImageDetails,
          },
          { merge: true }
        );

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
      } else {
        // Handle the case where the user document doesn't exist
        console.error("User document does not exist");
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

  const showFileDetails = (data) => {
    Alert.alert(
      "File Details",
      `Click on the download button to download the file.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          style: "default",
        },
        {
          text: "Download File",
          style: "destructive",
          onPress: () => Linking.openURL(`${data.url}`),
        },
      ],
      { cancelable: true }
    );
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          error,
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
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            After loading it may take some time to display your files depending
            on your internet speed....
          </Text>
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      ) : (
        <ScrollView style={{ paddingHorizontal: 30 }}>
          {files ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: Platform.OS === "android" ? 50 : 20,
                  }}
                >
                  Your Files
                </Text>
                <TouchableOpacity onPress={signOutUser}>
                  <ArrowRightOnRectangleIcon color={themeColor.darkColor} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 30,
                  justifyContent: "space-evenly",
                }}
              >
                {files.map((data, index) => {
                  console.log("Mapped Data ", data);
                  if (data.fileType === "image") {
                    return (
                      <TouchableOpacity
                        key={data.url}
                        onPress={() => showFileDetails(data)}
                      >
                        <Image
                          key={index}
                          source={{ uri: data.url }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  } else if (data.fileType === "video") {
                    return (
                      <TouchableOpacity
                        key={data.url}
                        onPress={() => showFileDetails(data)}
                      >
                        <Video
                          source={{ uri: data.url }}
                          rate={1.0}
                          volume={1.0}
                          useNativeControls
                          shouldPlay
                          isLooping
                          resizeMode="cover"
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: "50%",
              }}
            >
              <EmptyState />
            </View>
          )}
        </ScrollView>
      )}
      {/* <ProgressBar progress={50} /> */}

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
