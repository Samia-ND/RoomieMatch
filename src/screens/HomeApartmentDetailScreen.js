import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function DetailHomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { homeId } = route.params;

  const [home, setHome] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Fonction utilitaire pour sécuriser le split
  const toArray = (field) => {
    if (!field) return [];
    if (typeof field === "string") return field.split(",");
    if (Array.isArray(field)) return field;
    return [];
  };

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const docRef = doc(db, "Home", homeId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setHome({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchHome();
  }, [homeId]);

  if (!home) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  /* CONTACT */
  const openEmail = () => {
    if (!home.owner_contact) {
      Alert.alert("Info", "Email indisponible");
      return;
    }
    const subject = `Intérêt pour ${home.title}`;
    const body = `Bonjour ${home.owner_name},\n\nJe suis intéressé(e) par votre annonce "${home.title}".`;
    Linking.openURL(
      `mailto:${home.owner_contact}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
    setShowContactModal(false);
  };

  const openWhatsApp = () => {
    if (!home.owner_phone) {
      Alert.alert("Info", "Numéro indisponible");
      return;
    }
    const phone = home.owner_phone.replace(/\s+/g, "");
    const message = `Bonjour ${home.owner_name}, je suis intéressé(e) par votre annonce "${home.title}".`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    setShowContactModal(false);
  };

  const openPhone = () => {
    if (!home.owner_phone) return;
    Linking.openURL(`tel:${home.owner_phone}`);
    setShowContactModal(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 10, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de annonce</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={{ uri: home.image || "https://via.placeholder.com/300" }}
        style={styles.mainImage}
      />

      {/* MAIN INFO */}
      <View style={styles.mainInfo}>
        <Text style={styles.title}>{home.title}</Text>
        <Text style={styles.location}>{home.location}</Text>
        <Text style={styles.price}>{home.price} MAD / mois</Text>

        <View style={styles.details}>
          <Text style={styles.detail}>
            {home.rooms} pièce{home.rooms > 1 ? "s" : ""}
          </Text>
          <Text style={styles.detail}> • </Text>
          <Text style={styles.detail}>{home.surface} m²</Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{home.description}</Text>
      </View>

      {/* FEATURES */}
      {toArray(home.features).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.features}>
            {toArray(home.features).map((f, i) => (
              <View key={i} style={styles.feature}>
                <Text style={styles.featureText}>✓ {f.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* OWNER */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos du colocataire</Text>

        <View style={styles.ownerHeader}>
          <View style={styles.ownerAvatar}>
            <Text style={styles.ownerAvatarText}>
              {home.owner_name?.split(" ").map(n => n[0]).join("")}
            </Text>
          </View>

          <View>
            <Text style={styles.ownerName}>{home.owner_name}</Text>
            <Text style={styles.ownerDetails}>
              {home.owner_age} ans • {home.owner_profession}
            </Text>
          </View>
        </View>

        {home.owner_description && (
          <Text style={styles.ownerDescription}>{home.owner_description}</Text>
        )}

        {toArray(home.owner_preferences).length > 0 && (
          <View style={styles.ownerPreferences}>
            <Text style={styles.preferencesTitle}>Préférences :</Text>
            {toArray(home.owner_preferences).map((p, i) => (
              <Text key={i} style={styles.preference}>• {p.trim()}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => setShowContactModal(true)}
        >
          <Text style={styles.contactButtonText}>
            Contacter {home.owner_name.split(" ")[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <View style={styles.contactModalOverlay}>
          <View style={styles.contactModalContent}>
            <Text style={styles.contactModalTitle}>Contacter</Text>

            <TouchableOpacity style={styles.contactOption} onPress={openEmail}>
              <Text style={styles.contactOptionIcon}>📧</Text>
              <Text>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactOption} onPress={openPhone}>
              <Text style={styles.contactOptionIcon}>📞</Text>
              <Text>Téléphone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactOption} onPress={openWhatsApp}>
              <Text style={styles.contactOptionIcon}>💬</Text>
              <Text>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowContactModal(false)}>
              <Text style={styles.contactCancel}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa"},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFA500",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: 20, color: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  mainImage: { width: "100%", height: 250 },
  mainInfo: { backgroundColor: "#fff", padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius:20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  location: { color: "#666", marginBottom: 6 },
  price: { color: "#FFA500", fontSize: 22, fontWeight: "bold" },
  details: { flexDirection: "row", marginTop: 4 },
  detail: { color: "#666" },
  section: { backgroundColor: "#fff", padding: 20, marginTop: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  description: { color: "#555", lineHeight: 22 },
  features: { flexDirection: "row", flexWrap: "wrap" },
  feature: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: { color: "#333" },
  ownerHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  ownerAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  ownerName: { fontSize: 18, fontWeight: "bold" },
  ownerDetails: { color: "#666" },
  ownerDescription: { marginVertical: 8, color: "#555", lineHeight: 22 },
  preferencesTitle: { fontWeight: "bold", marginBottom: 4 },
  preference: { color: "#666", marginBottom: 4 },
  contactButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  contactButtonText: { color: "#fff", fontWeight: "bold" },
  contactModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contactModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "80%",
  },
  contactModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  contactOption: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  contactOptionIcon: { fontSize: 24, marginRight: 10 },
  contactCancel: { textAlign: "center", marginTop: 10, color: "#666" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
