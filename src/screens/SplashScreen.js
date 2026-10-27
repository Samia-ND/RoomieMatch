// src/screens/SplashScreen.js
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home"); // ← on remplace Splash par Home
    }, 2000); // 2 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/128/16467/16467068.png" }}
        style={styles.logo}
      />
      <Text style={styles.text}>RoomieMatch</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFA500", justifyContent: "center", alignItems: "center" },
  logo: { width: 80, height: 80 },
  text: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 20 },
});
