import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from 'react-native-elements';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "react-native-paper";
import { Auth } from "aws-amplify";
import styles from "./EditItem.style";
import { Database } from "../../util/Database";
import { colors } from "../../util/colors";
import { Photo } from "../../util/Photos";

const EditItemScreen = (props) => {

  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [purchaseAmt, setPurchaseAmt] = useState("");
  const [worth, setWorth] = useState("");
  const [receiptPhoto, setReceiptPhoto] = useState("");
  const [itemManualURL, setItemManualURL] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [buyDate, setBuyDate] = useState("");
  const [sellAmt, setSellAmt] = useState("");
  const [recurrPayAmt, setRecurrPayAmt] = useState("");
  const [ebayURL, setEbayURL] = useState("");
  const [archived, setArchived] = useState(0);
  const [folder, setFolder] = useState("");
  const [image, setImage] = useState("");
  const [imageTaken, setImageTaken] = useState(false);
  const [imageState, setImageState] = useState(false);
  const [createItem, setCreateItem] = useState(props.route.params.itemCreated);
  const [scannedItem, setScannedItem] = useState(props.route.params.scanned);
  const db = new Database();
  const photo = new Photo();
  const imageType = "image/jpg";

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
      if (photoURL !== "" && photoURL && !imageTaken) {
        try {
          const itemPhoto = await photo.get(photoURL);
          setImage(itemPhoto);
          setImageState(true);
        } catch {
          console.log("photo not found");
        }
      }
    })();
  }, [photoURL, imageState, image, imageTaken]);

  useEffect(() => {
    (async () => {
      try {
        if (imageTaken) {
          const pName = await photo.generateNewItemName("jpg");
          setPhotoURL(pName);
          setImageState(true);
          uploadImage();
          // console.log("photoURL set:", photoURL);
        }
      } catch (error) {
        console.log("could not find user :(", error);
      }
    })();
  }, [imageTaken, photoURL]);

  useEffect(() => {
    if (createItem) {
      if (scannedItem) {
        setName(JSON.stringify(props.route.params.title).replace(/['"]+/g, ''));
        setCategory(JSON.stringify(props.route.params.category).replace(/['"]+/g, ''));
        setPurchaseAmt(JSON.stringify(props.route.params.price).replace(/['"]+/g, ''));
        setNotes(JSON.stringify(props.route.params.description).replace(/['"]+/g, ''));
        setSerialNum(JSON.stringify(props.route.params.serialNumber).replace(/['"]+/g, ''));
        setWorth(JSON.stringify(props.route.params.price).replace(/['"]+/g, ''));
        setEbayURL(JSON.stringify(props.route.params.link).replace(/['"]+/g, ''));
        setCreateItem(true);
        setScannedItem(true);
      }
      else {
      console.log(props.route.params);
      setName(props.route.params.name);
      setCategory(props.route.params.category);
      setWorth(props.route.params.worth);
      setLocation(props.route.params.location);
      setNotes(props.route.params.notes);
      setTags(props.route.params.tags);
      setFolder(props.route.params.folder);
      }
    }
    else {
      
      setName(props.route.params.details.item.itemName);
      setID(props.route.params.details.item.itemID);
      setEmail(props.route.params.details.item.userEmail);
      setCategory(props.route.params.details.item.itemCategory);
      setPhotoURL(props.route.params.details.item.itemPhotoURL);
      setLocation(props.route.params.details.item.itemLocation);
      setNotes(props.route.params.details.item.itemNotes);
      setTags(props.route.params.details.item.itemTags);
      setSerialNum(props.route.params.details.item.itemSerialNum);
      setPurchaseAmt(props.route.params.details.item.itemPurchaseAmount);
      setWorth(props.route.params.details.item.itemWorth);
      setReceiptPhoto(props.route.params.details.item.itemReceiptPhotoURL);
      setItemManualURL(props.route.params.details.item.itemManualURL);
      setSellDate(incomingDate(props.route.params.details.item.itemSellDate));
      setBuyDate(incomingDate(props.route.params.details.item.itemBuyDate));
      setSellAmt(props.route.params.details.item.itemSellAmount);
      setRecurrPayAmt(props.route.params.details.item.itemRecurringPaymentAmount);
      setEbayURL(props.route.params.details.item.itemEbayURL);
      setArchived(props.route.params.details.item.itemArchived);
      setFolder(props.route.params.details.item.itemFolder);
      if(props.route.params.details.item.itemSerialNum !== null && props.route.params.details.item.itemSerialNum !== 'null')
        setSerialNum(`${props.route.params.details.item.itemSerialNum}`);
    }
    
  }, []);

  const quotes = (value) => {
    if(value === 0)
      return 0;
    if (!value || value === "null" || value.length < 1)
      return null;
    if (!isNaN(value))
      return value;
    return `'${  value  }'`;
  };

  const date = (date) =>{
    date = (`${  date}`).replace(/\D/g, '');
    if(!date || date === "null" || date === '' || date.length < 8)
      return null;
    date = `${date.substr(4,4)  }-${  date.substr(0,2)  }-${  date.substr(2,2)}`;
    date = `'${  date  }'`;
    return date;
  }

  const incomingDate = (date) =>{
    if(!date || date === "null" || date.length < 1)
      return null;
    date = (`${  date}`).replace(/\D/g, '');
    date = date.substr(4,2) + date.substr(6,2) + date.substr(0,4);
    return date;
  }

  const POSTitemFORMAT = {
    userEmail: quotes(email),
    itemCategory: quotes(category),
    itemName: quotes(name),
    itemPhotoURL: quotes(photoURL),
    itemSerialNum: quotes(serialNum),
    itemPurchaseAmount: quotes(purchaseAmt),
    itemWorth: quotes(worth),
    itemReceiptPhotoURL: quotes(receiptPhoto),
    itemManualURL: quotes(itemManualURL),
    itemSellDate: date(sellDate),
    itemBuyDate: date(buyDate),
    itemLocation: quotes(location),
    itemNotes: quotes(notes),
    itemSellAmount: quotes(sellAmt),
    itemRecurringPaymentAmount: quotes(recurrPayAmt),
    itemEbayURL: quotes(ebayURL),
    itemTags: quotes(tags),
    itemArchived: quotes(archived),
    itemFolder: quotes(folder),
  };

  const PUTitemFORMAT = {
    itemID: quotes(ID),
    userEmail: quotes(email),
    itemCategory: quotes(category),
    itemName: quotes(name),
    itemPhotoURL: quotes(photoURL),
    itemSerialNum: quotes(serialNum),
    itemPurchaseAmount: quotes(purchaseAmt),
    itemWorth: quotes(worth),
    itemReceiptPhotoURL: quotes(receiptPhoto),
    itemManualURL: quotes(itemManualURL),
    itemSellDate: date(sellDate),
    itemBuyDate: date(buyDate),
    itemLocation: quotes(location),
    itemNotes: quotes(notes),
    itemSellAmount: quotes(sellAmt),
    itemRecurringPaymentAmount: quotes(recurrPayAmt),
    itemEbayURL: quotes(ebayURL),
    itemTags: quotes(tags),
    itemArchived: quotes(archived),
    itemFolder: quotes(folder)
  };

  const createAlert = (title, msg) => Alert.alert(title,msg,[{ text: "OK" }],{ cancelable: false });

  const dateFormatter = (text) => {
    text = (`${  text}`).replace(/\D/g, '');
    if (text.length > 4)
      return `${text.substr(0, 2)  }/${  text.substr(2, 2)  }/${  text.substr(4, 4)}`;
    if (text.length > 2)
      return `${text.substr(0, 2)  }/${  text.substr(2, 2)}`;
    if (text.length < 3)
      return text.substr(0, 2);
    return text;
  }

  const currencyFormatter = (text) => {
    text = (`${  text}`).replaceAll(/[^\d.-]/g, "");
    if (text.length > 0)
      return (`$${  text}`);
  }

  const toggleArchived = () => {
    if (archived)
      setArchived(0);
    else
      setArchived(1);
  }

  const takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY
    );
    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      const pickerResult = await ImagePicker.launchCameraAsync({
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

  const uploadImage = async () => {
    try {
      await photo.uploadFile(image, photoURL, imageType);
    } catch (error) {
      console.log("upload error", error);
    }
  };

  const validateNonNullData = (name, category) => {
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
    createItem ? poster() : putter();
  };

  async function poster() {
    try {
      // if (imageTaken) {
      //   await uploadImage();
      // }
      const item = await db.post(POSTitemFORMAT);
      props.navigation.navigate("Recent");
    } catch (error) {
      console.log(error);
    }
  }

  async function putter() {
    try {
      // if (imageTaken) {
      //   await uploadImage();
      // }
      const item = await db.put(PUTitemFORMAT);
      props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView style={styles.page}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.Page}
        scrollEnabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
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
            {imageState ? (
              <View style={styles.uploadContainer}>
                <TouchableOpacity
                  onPress={() => takePhoto()}
                >
                  <Avatar.Image source={{ uri: `data:${imageType};base64,${image}` }} size={125} />
                </TouchableOpacity>
              </View>
)
              : (
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => takePhoto()}
                  >
                    <Ionicons name="camera-outline" size={75} color={colors.iconBackless} />
                  </TouchableOpacity>
                </View>
)}

            <View style={styles.child}>
              <Text style={styles.label}>Collection:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Collection"
                maxLength={20}
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
              <Text style={styles.label}>Serial Number:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="Serial Number"
                maxLength={10}
                onChangeText={(text) => {
                  setSerialNum(text);
                }}
                value={serialNum}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Purchase Amount:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="Purchase Amount"
                maxLength={12}
                onChangeText={(text) => {
                  text = (`${  text}`).replaceAll(/[^\d.-]/g, "");
                  setPurchaseAmt(text);
                }}
                value={currencyFormatter(purchaseAmt)}
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
                  text = (`${  text}`).replaceAll(/[^\d.-]/g, "");
                  setWorth(text);
                }}
                value={currencyFormatter(worth)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Receipt Photo:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Receipt Photo"
                maxLength={45}
                onChangeText={(text) => {
                  setReceiptPhoto(text);
                }}
                value={receiptPhoto}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Item Manual URL:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Item Manual"
                maxLength={45}
                onChangeText={(text) => {
                  setItemManualURL(text);
                }}
                value={itemManualURL}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Sell Date:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="MM/DD/YYYY"
                maxLength={10}
                onChangeText={(text) => {
                  text = (`${  text}`).replace(/\D/g, '');
                  setSellDate(text);
                }}
                value={dateFormatter(sellDate)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Buy Date:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="MM/DD/YYYY"
                maxLength={10}
                onChangeText={(text) => {
                  text = (`${  text}`).replace(/\D/g, '');
                  setBuyDate(text);
                }}
                value={dateFormatter(buyDate)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Sell Amount:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="Sell Amount"
                maxLength={12}
                onChangeText={(text) => {
                  text = (`${  text}`).replaceAll(/[^\d.-]/g, "");
                  setSellAmt(text);
                }}
                value={currencyFormatter(sellAmt)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Recurring Payment:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="Recurring Payment"
                maxLength={12}
                onChangeText={(text) => {
                  text = (`${  text}`).replaceAll(/[^\d.-]/g, "");
                  setRecurrPayAmt(text);
                }}
                value={currencyFormatter(recurrPayAmt)}
              />
            </View>

            <View style={styles.child}>
              <Text style={styles.label}>Shopping URL:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Shopping URL"
                maxLength={300}
                onChangeText={(text) => {
                  setEbayURL(text);
                }}
                value={ebayURL}
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
                multiline
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

            <View style={styles.child}>
              <Text style={styles.label}>Archived:</Text>
              <CheckBox
                center
                checkedColor={colors.delete}
                checkedIcon={<MaterialIcons name="check-box" size={45} color={colors.delete} />}
                uncheckedIcon={<MaterialIcons name="check-box-outline-blank" size={45} color={colors.label} />}
                containerStyle={{ marginBottom: 0, padding: 0 }}
                onPress={() => toggleArchived()}
                checked={archived}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => { validateNonNullData(name, category); }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </ScrollView>
  )
};

export default EditItemScreen;
