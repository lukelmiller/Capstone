import React, { useContext, useState } from "react";
import styles from "./Folder.style";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { renderContext } from "../MainPage/mainPage";
import { colors } from '../../util/colors';
import { List } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const Folder = ({navigation}) => {
    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

    const data = useContext(renderContext);
    let foldersList = [];
    let renderList = [];

    for (let i = 0; i < data.items.length; i++) {
        if (!foldersList.includes(data.items[i].itemFolder) && data.items[i].itemFolder != null) {
            foldersList.push(data.items[i].itemFolder);
        }
    }
    var color = 0;
    const getColors = () => {
        color++;
        return colors.objects[color % 8];
    }

    for (let i = 0; i < foldersList.length; i++) {
        let itemsToRender = [];
        let object = { name: foldersList[i], itemsToRender: itemsToRender, key: foldersList[i].toString() };

        for (let j = 0; j < data.items.length; j++) {
            if (data.items[j].itemFolder == foldersList[i]) {
                object.itemsToRender.push(data.items[j]);
            }
        }

        renderList.push(object);
    }

    return (
        <FlatList
            style={styles.container}
            data={renderList}
            renderItem={({ item }) => (
                <List.Accordion
                    title={item.name}
                    left={props => <List.Icon {...props} icon="folder" color={getColors()}/>}
                    style={styles.folder}
                    
                    titleStyle={styles.title}
                >
                    <FlatList
                        data={item.itemsToRender}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress = {() => {navigation.navigate("EditItemScreen", {details : {item}})}}>
                                <List.Item title={item.itemName} titleStyle={styles.title} />
                            </TouchableOpacity>
                        )}
                        style={styles.item}
                        keyExtractor={(item, index) => item.itemID.toString()}
                    />
                </List.Accordion>
            )}
        />
    );
};

export default Folder;