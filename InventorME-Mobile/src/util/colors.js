import { Appearance } from "react-native";

function colorGenerator() {
  if (Appearance.getColorScheme() === "dark") {
    const color = {
      text: "#ffffff",
      accent: "#fffc40",
      background: "#333333",
      theme: "#001e38",
      navigator: "#001e38",
      title: "#ffffff",
      dock: "#001e38",
      dockBackground: "#333333",
      button: "#f4ebc1",
      buttonText: "#001e38",
      label: "#ffffff",
      icon: "#f2f7ff",
      iconBackless: "#f2f7ff",
      objects: [
        "#4e148c",
        "#072ac8",
        "#1e96fc",
        "#a2d6f9",
        "#ebe100",
        "#eeb800",
        "#e66063",
        "#bd1f21"
      ],
      objectsText: "#ffffff",
      fill: '#404040',
      delete: "#e01f0d"
    };
    return color;
  }
  else {
    const color = {
      text: "#000000",
      accent: "#fffc40",
      background: "#ffffff",
      theme: "#003666",
      navigator: "#003666",
      title: "#f2f7ff",
      dock: "#003666",
      dockBackground: "#333333",
      button: "#4e148c",
      buttonText: "#ffffff",
      label: "#000000",
      icon: "#f2f7ff",
      iconBackless: "#000000",
      objects: [
        "#4e148c",
        "#072ac8",
        "#1e96fc",
        "#a2d6f9",
        "#ebe100",
        "#eeb800",
        "#e66063",
        "#bd1f21"
      ],
      objectsText: "#ffffff",
      fill: '#e6e6e6',
      delete: "#e01f0d"
    };
    return color;
  }
}

export const colors = colorGenerator();
