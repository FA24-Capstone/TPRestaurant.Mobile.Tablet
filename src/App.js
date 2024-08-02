import logo from "./logo.svg";
import "./App.css";
import { View, Text } from "react-native";
import React from "react";
function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: "red", height: 100, width: 100 }} />
      <View style={{ backgroundColor: "blue", height: 100, width: 100 }} />
      <Text>Hello, world!</Text>
    </View>
  );
}

export default App;
