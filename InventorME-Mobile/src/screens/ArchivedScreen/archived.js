import React, {useContext} from "react";
import { renderContext } from "../MainPage/mainPage";
import Items from "../ItemsScreen/Items";

const archived = ({navigation}) => {

  const data = useContext(renderContext);
  let archivedItems = [];

  for (let i = 0; i < data.items.length; i++) {
    if (data.items[i].itemArchived == 1) {
      archivedItems.push(data.items[i]);
    }
  }

  return (
    <Items itemsToRender = {archivedItems} navigation = {navigation}/>
  );
}

export default archived;