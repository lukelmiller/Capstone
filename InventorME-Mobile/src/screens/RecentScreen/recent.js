import React, { useContext } from "react";
import { renderContext } from "../MainPage/mainPage";
import Items from "../ItemsScreen/Items";

const recent = ({navigation}) => {

  const data = useContext(renderContext);
  let dates = [];
  let recentItems = [];

  for (let i = 0; i < data.items.length; i++) {
      dates.push(data.items[i].itemCreationDate);
  }

  dates.sort((a, b) => a - b);
  dates.reverse();

  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < data.items.length; j++) {
      if (data.items[j].itemCreationDate == dates[i] && data.items[j].itemArchived == 0) {
        recentItems.push(data.items[j]);
      }
    }
  }

  return (
    <Items itemsToRender = {recentItems} navigation = {navigation}/>
  );
}

export default recent;