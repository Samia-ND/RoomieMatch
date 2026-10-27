import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function ApartmentsScreen() {
  const navigation = useNavigation();

  const [appartementsData, setAppartementsData] = useState([]);
  const [tempSearchText, setTempSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("Tous");
  const [selectedRoomsFilter, setSelectedRoomsFilter] = useState("Tous");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Tous");
  const [selectedFurnishedFilter, setSelectedFurnishedFilter] = useState("Tous");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const priceFilters = ["Tous", "0-400 MAD", "400-500 MAD", "500-600 MAD", "600 MAD+"];
  const roomsFilters = ["Tous", "1 pièce", "2 pièces", "3 pièces+"];
  const typeFilters = ["Tous", "Studio", "Appartement", "Loft"];
  const furnishedFilters = ["Tous", "Meublé", "Non meublé"];

  // 🔹 Récupération des appartements depuis Firestore
  useEffect(() => {
    const fetchAppartements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Appartements"));
        const appartements = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppartementsData(appartements);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppartements();
  }, []);

  // 🔹 Filtrage sécurisé
  const filteredAppartements = appartementsData.filter((appartement) => {
    const title = appartement.title || "";
    const location = appartement.location || "";
    const price = appartement.price || 0;
    const rooms = appartement.rooms || 0;
    const type = appartement.type || "";
    const furnished = appartement.furnished ?? false; // true ou false

    // Recherche texte
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre prix
    let matchesPrice = true;
    if (selectedPriceFilter !== "Tous") {
      if (selectedPriceFilter === "0-400 MAD") matchesPrice = price <= 400;
      if (selectedPriceFilter === "400-500 MAD") matchesPrice = price > 400 && price <= 500;
      if (selectedPriceFilter === "500-600 MAD") matchesPrice = price > 500 && price <= 600;
      if (selectedPriceFilter === "600 MAD+") matchesPrice = price > 600;
    }

    // Filtre pièces
    let matchesRooms = true;
    if (selectedRoomsFilter !== "Tous") {
      if (selectedRoomsFilter === "1 pièce") matchesRooms = rooms === 1;
      if (selectedRoomsFilter === "2 pièces") matchesRooms = rooms === 2;
      if (selectedRoomsFilter === "3 pièces+") matchesRooms = rooms >= 3;
    }

    // Filtre type
    let matchesType = selectedTypeFilter === "Tous" || type === selectedTypeFilter;

    // Filtre meublé
    let matchesFurnished =
      selectedFurnishedFilter === "Tous"
        ? true
        : selectedFurnishedFilter === "Meublé"
        ? furnished
        : !furnished;

    return matchesSearch && matchesPrice && matchesRooms && matchesType && matchesFurnished;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appartements</Text>
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
          {filteredAppartements.length === 0 ? (
            <View style={styles.noResultContainer}>
              <Text style={styles.noResultText}>
                Aucun résultat trouvé pour {`"${searchQuery}"`}
              </Text>
            </View>
          ) : (
            filteredAppartements.map((appartement) => (
              <TouchableOpacity
                key={appartement.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ApartmentDetail", { apartmentId: appartement.id })
                }
              >
                <Image
                  source={{ uri: appartement.image || "https://via.placeholder.com/150" }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.title}>{appartement.title || "Sans titre"}</Text>
                  <Text style={styles.location}>{appartement.location || "Inconnu"}</Text>
                  <Text style={styles.price}>{appartement.price != null ? appartement.price + " MAD/mois" : "Prix indisponible"}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL FILTRES */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modal} showsVerticalScrollIndicator={false}>
            {/* HEADER DU MODAL */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {[{ title: "Type", data: typeFilters, set: setSelectedTypeFilter, value: selectedTypeFilter },
              { title: "Prix", data: priceFilters, set: setSelectedPriceFilter, value: selectedPriceFilter },
              { title: "Pièces", data: roomsFilters, set: setSelectedRoomsFilter, value: selectedRoomsFilter },
              { title: "Meublé", data: furnishedFilters, set: setSelectedFurnishedFilter, value: selectedFurnishedFilter }
            ].map((section, i) => (
              <View key={i}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.data.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.option, section.value === item && styles.optionActive]}
                    onPress={() => section.set(item)}
                  >
                    <Text style={section.value === item && { color: "#fff" }}>{item}</Text>
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
