import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Avatar } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./addItem.style";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Database } from "../../util/Database";
import { colors } from "../../util/colors";
import { Photo } from "../../util/Photos";
import { Auth } from "aws-amplify";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const addItemScreen = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [worth, setWorth] = useState("");
  const [folder, setFolder] = useState("");
  const [image, setImage] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [imageTaken, setImageTaken] = useState(false);
  const [imageState, setImageState] = useState(false);
  const [imageType, setImageType] = useState("image/jpg");
  const [scannedItem, setScannedItem] = useState(false);
  const db = new Database();
  const photo = new Photo();

  useEffect(() => {
    (async () => {
      try {
        const data = await Auth.currentUserInfo();
        setEmail(data.attributes.email);
      } catch {
        console.log("could not find user :(", error);
      }
    })();
  }, [email]);

  useEffect(() => {
    (async () => {
      try {
        if (imageTaken) {
          // console.log("picture taken");
          const pName = await photo.generateNewItemName("jpg");
          setPhotoURL(pName);
        }
      } catch (error) {
        console.log("could not find user :(", error);
      }
    })();
  }, [imageTaken, photoURL]);

  const createAlert = (title, msg) =>
    Alert.alert(
      title,
      msg,
      [
        { text: "OK" }
      ],
      { cancelable: false }
    );

  const quotes = (value) => {
    if (!value || value === "null" || value.length < 1) {
      return null;
    }
    if (!isNaN(value)) {
      return value;
    }
    return "'" + value + "'";
  };

  let POSTitemFORMAT = {
    userEmail: quotes(email),
    itemCategory: quotes(category),
    itemName: quotes(name),
    itemPhotoURL: quotes(photoURL),
    itemSerialNum: "null",
    itemPurchaseAmount: "null",
    itemWorth: quotes(worth),
    itemReceiptPhotoURL: "null",
    itemManualURL: "null",
    itemSellDate: "null",
    itemBuyDate: "null",
    itemLocation: quotes(location),
    itemNotes: quotes(notes),
    itemSellAmount: "null",
    itemRecurringPaymentAmount: "null",
    itemEbayURL: "null",
    itemTags: quotes(tags),
    itemArchived: "0",
    itemFolder: quotes(folder),
  };

  const clear = () => {
    setName("");
    setCategory("");
    setLocation("");
    setNotes("");
    setTags("");
    setWorth("");
    setFolder("");
    setImage("");
    setPhotoURL("");
    setImageTaken(false);
    setImageState(false);
    setScannedItem(false);
  };

  const takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY
    );
    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
        quality: 0.1,
      });
      if (!pickerResult.cancelled) {
        setImage(pickerResult.base64);
        setImageTaken(true);
      }
    } else {
      const title = "No Photo Access";
      const msg = "Please Go Into Phone Settings & Grant App Access To Camera & Photos";
      alert(title, msg, [{ text: "OK" }], { cancelable: false });
    }
  };

  const currencyFormatter = (text) => {
    text = ('' + text).replaceAll(/[^\d.-]/g, "");
    if (text.length > 0)
      return ('$' + text);
  }

  const uploadImage = async () => {
    try {
      await photo.uploadFile(image, photoURL, imageType);
    } catch (error) {
      console.log("upload error", error);
    }
  };

  const validateNonNullData = (flagger) => {
    if (name === "null" || name === "") {
      createAlert("Could Not Save:", "Please Input Item Name");
      return false;
    }
    if (category === "null" || category === "") {
      createAlert("Could Not Save:", "Please Input Collection");
      return false;
    }
    if (folder === "null" || folder === "") {
      createAlert("Could Not Save:", "Please Input Folder");
      return false;
    }
    poster(flagger);
  };

  async function poster(flagger) {
    try {
      if (imageTaken) {
        await uploadImage();
      }
      const item = await db.post(POSTitemFORMAT);
      clear();
      if(flagger)
        props.navigation.navigate("Recent");
      else
      createAlert("SAVED", "");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => {
                clear();
                props.navigation.navigate("Collections");
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.child1}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                maxLength={45}
                onChangeText={(text) => {
                  setName(text);
                }}
                value={name}
              />
            </View>
            {imageTaken ? (
              <View style={styles.uploadContainer}>
                <TouchableOpacity
                  onPress={() => takePhoto()}>
                  <Avatar.Image source={{ uri: `data:${imageType};base64,${image}` }} size={125} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <Ionicons name="camera-outline" size={75} color={colors.iconBackless} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.child}>
              <Text style={styles.label}>Collection:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Collection"
                maxLenght={20}
                onChangeText={(text) => {
                  setCategory(text);
                }}
                value={category}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Folder:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Folder"
                maxLength={30}
                onChangeText={(text) => {
                  setFolder(text);
                }}
                value={folder}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Worth:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="Worth"
                maxLength={12}
                onChangeText={(text) => {
                  text = ('' + text).replaceAll(/[^\d.-]/g, "");
                  setWorth(text);
                }}
                value={currencyFormatter(worth)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Location"
                maxLength={120}
                onChangeText={(text) => {
                  setLocation(text);
                }}
                value={location}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Notes:</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Notes"
                maxLength={200}
                multiline={true}
                onChangeText={(text) => {
                  setNotes(text);
                }}
                value={notes}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Tags:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tags"
                maxLength={120}
                onChangeText={(text) => {
                  setTags(text);
                }}
                value={tags}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  validateNonNullData(true);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const scanned = false;
                  const itemCreated = true;
                  props.navigation.navigate("EditItemScreen", { name, category, worth, folder, location, notes, tags, scanned, itemCreated });
                }}
              >
                <Text style={styles.buttonText}>Add Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  validateNonNullData(false);
                }}
              >
                <Text style={styles.buttonText}>New Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </ScrollView >
  );
};

export default addItemScreen;
