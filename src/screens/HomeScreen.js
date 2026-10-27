import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../services/firebase";
// import { UserContext } from "../context/UserContext"; // Temporarily commented out

export default function HomeScreen() {
  const navigation = useNavigation();
  // const { user } = useContext(UserContext); // Temporarily commented out

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  // ✅ Nouveaux useState pour suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cities = [
    "Paris",
    "Lyon",
    "Marseille",
    "Rabat",
    "Casablanca",
    "Marrakech",
    "Agadir",
    "Tanger",
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Home"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des salles:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);
  const handleSearch = () => {
    let filtered = rooms;

    if (searchText.trim()) {
      filtered = filtered.filter(room =>
        room.location.toLowerCase().includes(searchText.toLowerCase()) ||
        room.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (typeFilter.trim()) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    if (maxPrice.trim()) {
      filtered = filtered.filter(room => {
        const priceNumber = parseInt(room.price.replace(/\D/g, ""));
        return priceNumber <= parseInt(maxPrice);
      });
    }

    setFilteredRooms(filtered);
  };

  // ✅ Calcul des villes filtrées pour suggestions
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayRooms = filteredRooms;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
<View style={styles.header}>
  <View style={styles.headerRight}>
    <TouchableOpacity
      style={styles.profileButton}
        onPress={() => {
        // if (user) {
          navigation.navigate("Profile");
        // } else {
        //   navigation.navigate("Login");
        // }
      }}
    >
      <Text style={styles.profileText}>👤</Text>
    </TouchableOpacity>
  </View>
</View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.pageTitle}>Trouvez votre coloc idéal</Text>


        {/* ✅ Barre de recherche Airbnb-like */}
        <View style={styles.searchContainer}>
          <TextInput
  style={styles.searchInput}
  placeholder="Où ? Rechercher une destination"
  placeholderTextColor="#666"
  value={searchText}
  onChangeText={(text) => {
    setSearchText(text);
    if (text.trim() === "") {
      // Si le champ est vide, on remet toutes les annonces
      setFilteredRooms(rooms);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }}
/>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions villes */}
        {showSuggestions && searchText.length > 0 && (
          <View style={styles.suggestionsBox}>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchText(city);
                    setShowSuggestions(false);
                    handleSearch();
                  }}
                >
                  <Text style={styles.suggestionTitle}>📍 {city}</Text>
                  <Text style={styles.suggestionSubtitle}>
                    Destination populaire
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ padding: 15, color: "#888" }}>
                Aucune ville correspondante
              </Text>
            )}
          </View>
        )}
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TextInput
  style={styles.filterInput}
  placeholder="Type (Appartement, Studio...)"
  value={typeFilter}
  onChangeText={(text) => {
    setTypeFilter(text);
    if (text.trim() === "" && maxPrice.trim() === "") {
      setFilteredRooms(rooms);
    }
  }}
/>

<TextInput
  style={styles.filterInput}
  placeholder="Prix max (€)"
  value={maxPrice}
  keyboardType="numeric"
  onChangeText={(text) => {
    setMaxPrice(text);
    if (text.trim() === "" && typeFilter.trim() === "") {
      setFilteredRooms(rooms);
    }
  }}
/>
         <TouchableOpacity style={styles.filterButton} onPress={handleSearch}>
            <Text style={styles.filterButtonText}>Filtrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    
      {/* Quick Actions */}
<View style={styles.quickActions}>
  {/* Colocations */}
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => navigation.navigate("Colocations")}
  >
    <Text style={styles.actionIcon}>🛏️</Text>
    <Text style={styles.actionText}>Colocations</Text>
  </TouchableOpacity>

  {/* Studios */}
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => navigation.navigate("Studios")}
  >
    <Text style={styles.actionIcon}>🏠</Text>
    <Text style={styles.actionText}>Studios</Text>
  </TouchableOpacity>

  {/* Appartements */}
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => navigation.navigate("Apartments")}
  >
    <Text style={styles.actionIcon}>🏢</Text>
    <Text style={styles.actionText}>Appartements</Text>
  </TouchableOpacity>


  {/* Publier */}
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => {
      // if (user) navigation.navigate("CreateApartment");
      // else navigation.navigate("Login");
      navigation.navigate("CreateApartment");
    }}
  >
    <Text style={styles.actionIcon}>➕</Text>
    <Text style={styles.actionText}>Publier</Text>
  </TouchableOpacity>
</View>

      {/* Featured Rooms */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Annonces populaires</Text>

        {displayRooms.length > 0 ? (
          displayRooms.map((room) => (
            <TouchableOpacity key={room.id} style={styles.roomCard}
            onPress={() => navigation.navigate("HomeApartmentDetail", { homeId: room.id })}
            >
              <Image
                source={{ uri: room.image }}
                style={styles.roomImage}
              />
              <View style={styles.roomInfo}>
                <Text style={styles.roomTitle}>{room.title}</Text>
                <Text style={styles.roomLocation}>{room.location}</Text>
                <Text style={styles.roomPrice}>{room.price}MAD / mois</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
  <Text style={styles.noResultsText}>
    {`Aucun résultat${
      searchText ? ` pour "${searchText}"` : ""
    }${
      typeFilter ? `, Type: "${typeFilter}"` : ""
    }${
      maxPrice ? `, Prix max: "${maxPrice}€"` : ""
    }`}
  </Text>
</View>
        )}
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>
          Vous cherchez un colocataire ?
        </Text>
        <Text style={styles.ctaSubtitle}>
          Publiez votre annonce gratuitement et trouvez la personne idéale
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            // if (user) navigation.navigate("CreateApartment");
            // else navigation.navigate("Login");
            navigation.navigate("CreateApartment");
          }}
        >
          <Text style={styles.ctaButtonText}>
            Publier une annonce
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFA500",
   
  },
  
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  authButtonPrimary: { backgroundColor: "#FFA500" },
authButtonText: { fontSize: 14, color: "#FFA500" },
authButtonTextPrimary: { color: "#fff" },

  searchButtonText: { fontSize: 18 },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: "#FFA500",
    borderRadius: 25,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: { color: "#fff", fontWeight: "bold" },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  actionButton: { alignItems: "center", padding: 10 },
  actionIcon: { fontSize: 30, marginBottom: 5 },
  actionIconImage: { width: 40, height: 40, marginBottom: 5 },
  actionText: { fontSize: 12, color: "#666", textAlign: "center" },
  featuredSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 15 },
  roomCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  roomInfo: { flex: 1, justifyContent: "center" },
  roomTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  roomLocation: { fontSize: 14, color: "#666", marginBottom: 5 },
  roomPrice: { fontSize: 16, fontWeight: "bold", color: "#FFA500" },
  noResultsText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
  ctaSection: { backgroundColor: "#333", padding: 30, alignItems: "center", marginTop: 20 },
  ctaTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 10 },
  ctaSubtitle: { fontSize: 16, color: "#ccc", textAlign: "center", marginBottom: 20 },
  ctaButton: { backgroundColor: "#FFA500", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  ctaButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  authButtons: { flexDirection: "row", gap: 10 },
  authButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: "#FFA500" },
  

  // ✅ Styles pour suggestions
  suggestionsBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  pageTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 10,      // décale le titre du haut
  marginHorizontal: 20, // espace à gauche et à droite
  marginBottom: 15,    // espace avant la barre de recherche
  color: "#333",
},

});
