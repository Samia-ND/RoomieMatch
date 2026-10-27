import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function CreateApartmentScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [surface, setSurface] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  // Owner info
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [ownerDescription, setOwnerDescription] = useState("");
  const [ownerAge, setOwnerAge] = useState("");
  const [ownerProfession, setOwnerProfession] = useState("");
  const [ownerPreferences, setOwnerPreferences] = useState([]);
  const [preferenceInput, setPreferenceInput] = useState("");

  /* ===== ADD ITEMS ===== */
  const addFeature = () => {
    if (featureInput.trim() === "") return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const addPreference = () => {
    if (preferenceInput.trim() === "") return;
    setOwnerPreferences([...ownerPreferences, preferenceInput.trim()]);
    setPreferenceInput("");
  };

  const removePreference = (index) => {
    const newPrefs = ownerPreferences.filter((_, i) => i !== index);
    setOwnerPreferences(newPrefs);
  };

  /* ===== PUBLISH ===== */
  const handlePublish = async () => {
    if (!title || !description || !price || !type || !location) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires !");
      return;
    }

    try {
      await addDoc(collection(db, "Home"), {
        title,
        description,
        features,
        image,
        location,
        rooms: parseInt(rooms) || 0,
        surface: parseInt(surface) || 0,
        price: parseInt(price),
        type,
        owner_name: ownerName,
        owner_phone: ownerPhone,
        owner_contact: ownerContact,
        owner_description: ownerDescription,
        owner_age: parseInt(ownerAge) || 0,
        owner_profession: ownerProfession,
        owner_preferences: ownerPreferences,
      });

      Alert.alert("Succès", "Annonce publiée !");
      navigation.goBack();
    } catch (e) {
      console.log("Erreur Firestore :", e);
      Alert.alert("Erreur", "Impossible de publier l'annonce.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Titre et description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Titre de annonce</Text>
        <TextInput
          style={styles.input}
          placeholder="Petit Studio Cosy"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Petit studio cosy non meublé..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Équipements</Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ajouter un équipement"
            value={featureInput}
            onChangeText={setFeatureInput}
          />
          <TouchableOpacity style={styles.addButton} onPress={addFeature}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {features.map((f, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>{f}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFeature(i)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Info de l'appartement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={image}
          onChangeText={setImage}
        />
        <TextInput
          style={styles.input}
          placeholder="Localisation"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de pièces"
          value={rooms}
          onChangeText={setRooms}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Surface (m²)"
          value={surface}
          onChangeText={setSurface}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Prix (MAD)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Type (Studio, Appartement...)"
          value={type}
          onChangeText={setType}
        />
      </View>

      {/* Infos propriétaire */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Propriétaire</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={ownerPhone}
          onChangeText={setOwnerPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={ownerContact}
          onChangeText={setOwnerContact}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={ownerDescription}
          onChangeText={setOwnerDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Âge"
          value={ownerAge}
          onChangeText={setOwnerAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Profession"
          value={ownerProfession}
          onChangeText={setOwnerProfession}
        />

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Préférences</Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ajouter une préférence"
            value={preferenceInput}
            onChangeText={setPreferenceInput}
          />
          <TouchableOpacity style={styles.addButton} onPress={addPreference}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {ownerPreferences.map((p, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>{p}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePreference(i)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bouton Publier */}
      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>Publier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles identiques à ceux que tu avais


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFA500',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemsList: {
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  publishButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  userInfoEmail: {
    fontWeight: 'bold',
    color: '#FFA500',
  },
  userInfoNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});