import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const PaymentSuccess: React.FC = () => {
  const handleContinue = () => {
    // Handle the continue action
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>Thank you for your purchase.</Text>
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 32,
  },
});

export default PaymentSuccess;
