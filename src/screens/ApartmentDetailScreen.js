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

// 🔹 Fonctions de sécurité
const safeSplit = (str) => {
  if (typeof str !== "string") return [];
  return str.split(",").map(s => s.trim());
};

const safeInitials = (name) => {
  if (typeof name !== "string" || name.length === 0) return "NN";
  return name.split(" ").map(n => n[0]).join("");
};

export default function ApartmentDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { apartmentId } = route.params;


  const [Appartement, setAppartement] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // 🔹 Récupération des données depuis Firestore
  useEffect(() => {
    const fetchAppartement = async () => {
      try {
        const docRef = doc(db, "Appartements", apartmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAppartement({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Aucune Appartement trouvée !");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppartement();
  }, [apartmentId]);

  if (!Appartement) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // 🔹 Contact functions
  const openEmail = () => {
      if (!Appartement.owner_contact) {
        Alert.alert("Info", "Email indisponible");
        return;
      }

      const subject = `Intérêt pour ${Appartement.title}`;
      const body = `Bonjour,\n\nJe suis intéressé(e) par votre colocation "${Appartement.title}".\nPouvez-vous me donner plus d'informations ?\n\nCordialement.`;
      Linking.openURL(
      `mailto:${Appartement.owner_contact}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
      );
      setShowContactModal(false);
    };
    const openWhatsApp = () => {
      if (!Appartement.owner_phone) {
            Alert.alert("Info", "Numéro indisponible");
            return;
          }
         const phone = Appartement.owner_phone.replace(/\s+/g, "");
          const message = `Bonjour ${Appartement.owner_name}, je suis intéressé(e) par votre annonce "${Appartement.title}".`;
          Linking.openURL(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
          );
      setShowContactModal(false);
    };
  
    const openPhone = () => {
       if (!Appartement.owner_phone) return;
          Linking.openURL(`tel:${Appartement.owner_phone}`);
          setShowContactModal(false);
        };
  
    return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de appartement</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={{
          uri: Appartement.image || "https://via.placeholder.com/300x200",
        }}
        style={styles.mainImage}
      />

      {/* MAIN INFO */}
      <View style={styles.mainInfo}>
        <Text style={styles.title}>{Appartement.title || "Sans titre"}</Text>
        <Text style={styles.location}>{Appartement.location || "Localisation inconnue"}</Text>
        <Text style={styles.price}>
          {Appartement.price != null ? Appartement.price + " MAD/mois" : "Prix indisponible"}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detail}>
            {Appartement.rooms != null ? Appartement.rooms : "?"} pièce
            {Appartement.rooms > 1 ? "s" : ""}
          </Text>
          <Text style={styles.detail}> • </Text>
          <Text style={styles.detail}>
            {Appartement.surface != null ? Appartement.surface + "m²" : "Surface indisponible"}
          </Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{Appartement.description || "Pas de description"}</Text>
      </View>

      {/* FEATURES */}
      {Appartement.features && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Équipements</Text>
                <View style={styles.badgeContainer}>
                  {Appartement.features.split(",").map((f, i) => (
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
              {Appartement.owner_name
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </Text>
          </View>

          <View style={styles.ownerMainInfo}>
            <Text style={styles.ownerName}>{Appartement.owner_name || "Colocataire"}</Text>
            <Text style={styles.ownerDetails}>
              {Appartement.owner_age != null ? Appartement.owner_age + " ans" : ""} •{" "}
              {Appartement.owner_profession || ""}
            </Text>
          </View>
        </View>
        {/* Description */}
        {Appartement.owner_description && (
          <Text style={styles.ownerDescription}>{Appartement.owner_description}</Text>
        )}
        {/* Préférences */}
        {Appartement.owner_preferences && Appartement.owner_preferences.length > 0 && (
            <View style={styles.ownerPreferences}>
              <Text style={styles.preferencesTitle}>Préférences :</Text>
              {Appartement.owner_preferences.split(",").map((p, i) => (
                <Text key={i} style={styles.preference}>
                  • {p.trim()}
                </Text>
              ))}
            </View>
          )}

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => setShowContactModal(true)}
        >
          <Text style={styles.contactButtonText}>
            Contacter {(Appartement.owner_name || "Colocataire").split(" ")[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <View style={styles.contactModalOverlay}>
          <View style={styles.contactModalContent}>
            <Text style={styles.contactModalTitle}>
              Contacter {Appartement.owner_name || "Colocataire"}
            </Text>

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
              <Text style={styles.contactOptionTitle}>WhatsApp</Text>
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

// 🔹 Styles (inchangés)
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
