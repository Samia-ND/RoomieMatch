import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function StudiosScreen() {
  const navigation = useNavigation();

  const [studiosData, setStudiosData] = useState([]);
  const [tempSearchText, setTempSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPriceFilter, setSelectedPriceFilter] = useState("Tous");
  const [selectedRoomsFilter, setSelectedRoomsFilter] = useState("Tous");
  const [selectedFurnishedFilter, setSelectedFurnishedFilter] = useState("Tous");

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const priceFilters = ["Tous", "0-400 MAD", "400-500 MAD", "500-600 MAD", "600 MAD+"];
  const roomsFilters = ["Tous", "1 pièce", "2 pièces", "3 pièces+"];
  const furnishedFilters = ["Tous", "Meublé", "Non meublé"];

  // 🔹 FIREBASE — récupération studios
  useEffect(() => {
    const fetchStudios = async () => {
      const snapshot = await getDocs(collection(db, "studios"));

      const studios = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Studio sans titre",
          location: data.location || "Emplacement inconnu",
          price: Number(data.price) || 0,
          rooms: Number(data.rooms) || 1,
          furnished: data.furnished ?? true,
          image: data.image || "https://via.placeholder.com/150",
          type: data.type || "Studio",
        };
      });

      setStudiosData(studios);
    };

    fetchStudios();
  }, []);

  // 🔹 FILTRES
  const filteredStudios = studiosData.filter((studio) => {
    const matchesSearch =
      studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (selectedPriceFilter !== "Tous") {
      if (selectedPriceFilter === "0-400 MAD") matchesPrice = studio.price <= 400;
      if (selectedPriceFilter === "400-500 MAD") matchesPrice = studio.price > 400 && studio.price <= 500;
      if (selectedPriceFilter === "500-600 MAD") matchesPrice = studio.price > 500 && studio.price <= 600;
      if (selectedPriceFilter === "600 MAD+") matchesPrice = studio.price > 600;
    }

    let matchesRooms = true;
    if (selectedRoomsFilter !== "Tous") {
      if (selectedRoomsFilter === "1 pièce") matchesRooms = studio.rooms === 1;
      if (selectedRoomsFilter === "2 pièces") matchesRooms = studio.rooms === 2;
      if (selectedRoomsFilter === "3 pièces+") matchesRooms = studio.rooms >= 3;
    }

    let matchesFurnished =
      selectedFurnishedFilter === "Tous"
        ? true
        : selectedFurnishedFilter === "Meublé"
        ? studio.furnished
        : !studio.furnished;

    return matchesSearch && matchesPrice && matchesRooms && matchesFurnished;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Studios</Text>

          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ville ou quartier"
            value={tempSearchText}
            onChangeText={(text) => {
              setTempSearchText(text);
              if (text.trim() === "") setSearchQuery("");
            }}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearchQuery(tempSearchText.trim())}
          >
            <Text style={{ color: "#fff" }}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* LISTE */}
        <View style={styles.list}>
          {filteredStudios.length === 0 ? (
            <View style={styles.noResultContainer}>
              <Text style={styles.noResultText}>Aucun studio trouvé</Text>
            </View>
          ) : (
            filteredStudios.map((studio) => (
              <TouchableOpacity
                key={studio.id}
                style={styles.card}
                onPress={() =>
  navigation.navigate("StudiosDetail", { studioId: studio.id })
}

              >
                <Image source={{ uri: studio.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.title}>{studio.title}</Text>
                  <Text style={styles.location}>{studio.location}</Text>
                  <Text style={styles.price}>{studio.price} MAD / mois</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL FILTRES */}
      <Modal visible={isFilterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {[ 
              { title: "Prix", data: priceFilters, set: setSelectedPriceFilter, value: selectedPriceFilter },
              { title: "Pièces", data: roomsFilters, set: setSelectedRoomsFilter, value: selectedRoomsFilter },
              { title: "Meublé", data: furnishedFilters, set: setSelectedFurnishedFilter, value: selectedFurnishedFilter },
            ].map((section, i) => (
              <View key={i}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.data.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.option, section.value === item && styles.optionActive]}
                    onPress={() => section.set(item)}
                  >
                    <Text style={section.value === item && { color: "#fff" }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Appliquer
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8f9fa" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: "#FFA500" },
  backText: { fontSize: 22, color: "#fff" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  menuIcon: { fontSize: 24, color: "#fff" },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", margin: 20, borderRadius: 25, padding: 10 },
  searchInput: { flex: 1 },
  searchButton: { backgroundColor: "#FFA500", padding: 10, borderRadius: 20 },
  list: { padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15 },
  image: { height: 140, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  info: { padding: 10 },
  title: { fontWeight: "bold" },
  location: { color: "#666" },
  price: { color: "#FFA500", fontWeight: "bold" },
  noResultContainer: { padding: 40, alignItems: "center" },
  noResultText: { fontSize: 16, color: "#666", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  closeBtn: { fontSize: 22, fontWeight: "bold", color: "#555" },
  modal: { backgroundColor: "#fff", padding: 20, borderRadius: 20, maxHeight: "85%" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginTop: 10 },
  option: { padding: 10, borderWidth: 1, borderColor: "#ddd", marginVertical: 5, borderRadius: 8 },
  optionActive: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
  applyBtn: { backgroundColor: "#28a745", padding: 15, marginTop: 15, borderRadius: 10, alignItems: "center" },
});
