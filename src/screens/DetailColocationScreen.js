import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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

export default function DetailColocationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colocationId } = route.params;

  const [colocation, setColocation] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchColocation = async () => {
      try {
        const docRef = doc(db, "colocations", colocationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setColocation({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Aucune colocation trouvée !");
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchColocation();
  }, [colocationId]);

  if (!colocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // 🔹 Contact functions
   const openEmail = () => {
    if (!colocation.owner_contact) {
      Alert.alert("Info", "Email indisponible");
      return;
    }

    const subject = `Intérêt pour ${colocation.title}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par votre colocation "${colocation.title}".\nPouvez-vous me donner plus d'informations ?\n\nCordialement.`;
    Linking.openURL(
    `mailto:${colocation.owner_contact}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
    );
    setShowContactModal(false);
  };
  const openWhatsApp = () => {
    if (!colocation.owner_phone) {
          Alert.alert("Info", "Numéro indisponible");
          return;
        }
       const phone = colocation.owner_phone.replace(/\s+/g, "");
        const message = `Bonjour ${colocation.owner_name}, je suis intéressé(e) par votre annonce "${colocation.title}".`;
        Linking.openURL(
          `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        );
    setShowContactModal(false);
  };

  const openPhone = () => {
     if (!colocation.owner_phone) return;
        Linking.openURL(`tel:${colocation.owner_phone}`);
        setShowContactModal(false);
      };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la colocation</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={{
          uri: colocation.image || "https://via.placeholder.com/300x200",
        }}
        style={styles.mainImage}
      />

      {/* MAIN INFO */}
      <View style={styles.mainInfo}>
        <Text style={styles.title}>{colocation.title}</Text>
        <Text style={styles.location}>{colocation.location}</Text>
        <Text style={styles.price}>{colocation.price}MAD/mois</Text>
        <View style={styles.details}>
          <Text style={styles.detail}>
            {colocation.rooms} pièce{colocation.rooms > 1 ? "s" : ""}
          </Text>
          <Text style={styles.detail}> • </Text>
          <Text style={styles.detail}>{colocation.surface}m²</Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{colocation.description}</Text>
      </View>

      {/* FEATURES */}
      {colocation.features && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.badgeContainer}>
            {colocation.features.split(",").map((f, i) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeText}>✓ {f.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* PROPRIÉTAIRE */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>À propos du colocataire</Text>

  {/* Initiales ou avatar */}
  <View style={styles.ownerHeader}>
    <View style={styles.ownerAvatar}>
      <Text style={styles.ownerAvatarText}>
        {colocation.owner_name
          .split(" ")
          .map(n => n[0])
          .join("")}
      </Text>
    </View>

    <View style={styles.ownerMainInfo}>
      <Text style={styles.ownerName}>{colocation.owner_name}</Text>
      <Text style={styles.ownerDetails}>
        {colocation.owner_age} ans • {colocation.owner_profession}
      </Text>
    </View>
  </View>

  {/* Description */}
  {colocation.owner_description && (
    <Text style={styles.ownerDescription}>{colocation.owner_description}</Text>
  )}

  {/* Préférences */}
  {colocation.owner_preferences && colocation.owner_preferences.length > 0 && (
    <View style={styles.ownerPreferences}>
      <Text style={styles.preferencesTitle}>Préférences :</Text>
      {colocation.owner_preferences.split(",").map((p, i) => (
        <Text key={i} style={styles.preference}>
          • {p.trim()}
        </Text>
      ))}
    </View>
  )}

  {/* Bouton contacter */}
  <TouchableOpacity
    style={styles.contactButton}
    onPress={() => setShowContactModal(true)}
  >
    <Text style={styles.contactButtonText}>
      Contacter {colocation.owner_name.split(" ")[0]}
    </Text>
  </TouchableOpacity>
</View>


      {/* CONTACT MODAL */}
      {showContactModal && (
        <View style={styles.contactModalOverlay}>
          <View style={styles.contactModalContent}>
            <Text style={styles.contactModalTitle}>Contacter {colocation.owner_name}</Text>

            <TouchableOpacity style={styles.contactOption} onPress={openEmail}>
              <Text style={styles.contactOptionIcon}>📧</Text>
              <Text style={styles.contactOptionTitle}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactOption} onPress={openPhone}>
              <Text style={styles.contactOptionIcon}>📞</Text>
              <Text style={styles.contactOptionTitle}>Téléphone</Text>
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
  container: { backgroundColor: "#f8f9fa", flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFA500",
  },
  backText: { fontSize: 22, color: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  mainImage: { width: "100%", height: 250 },
  mainInfo: { padding: 15 },
  title: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  location: { color: "#666", marginBottom: 5 },
  price: { color: "#FFA500", fontWeight: "bold", marginBottom: 5, fontSize: 18 },
  details: { flexDirection: "row" },
  detail: { color: "#666", marginRight: 5 },
  ownerHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},
ownerAvatarText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 18,
},
ownerMainInfo: {
  flex: 1,
},
ownerAvatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#FFA500",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},
ownerName: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
},
ownerDetails: {
  fontSize: 14,
  color: "#666",
},
ownerDescription: {
  fontSize: 16,
  color: "#555",
  lineHeight: 22,
  marginVertical: 8,
},
wnerPreferences: {
  marginTop: 5,
},
preferencesTitle: {
  fontWeight: "bold",
  marginBottom: 4,
},
preference: {
  fontSize: 15,
  color: "#666",
  marginLeft: 5,
  marginBottom: 5,
},
  section: { padding: 15, marginBottom: 10, backgroundColor: "#fff", borderRadius: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  description: { color: "#555", lineHeight: 22 },
  badgeContainer: { flexDirection: "row", flexWrap: "wrap" },
  badge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  preferenceBadge: {
    backgroundColor: "#d0eaff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: { color: "#333" },
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
