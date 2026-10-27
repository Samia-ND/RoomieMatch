import { useRef, useState } from 'react';
// import { useContext } from 'react'; // Temporarily commented out
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { UserContext } from '../context/UserContext'; // Temporarily commented out

export default function RegisterScreen() {
  const navigation = useNavigation();
  // const { register } = useContext(UserContext); // Temporarily commented out

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  // Refs pour naviguer entre les champs
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      await registerUser(formData.email.trim(), formData.password.trim());
      Alert.alert('Succès', 'Votre compte a été créé avec succès !');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header avec cercle à droite */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            Créez votre compte et trouvez votre colocataire idéal facilement
          </Text>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Champs du formulaire */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre prénom"
              value={formData.firstName}
              onChangeText={value => updateFormData('firstName', value)}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={formData.lastName}
              onChangeText={value => updateFormData('lastName', value)}
              autoCapitalize="words"
              ref={lastNameRef}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              ref={emailRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 caractères"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              ref={passwordRef}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Répétez votre mot de passe"
              value={formData.confirmPassword}
              onChangeText={value => updateFormData('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              ref={confirmPasswordRef}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          {/* Bouton s'inscrire */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>inscrire</Text>}
          </TouchableOpacity>

          {/* Lien vers Login */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Déjà un compte ? <Text style={styles.loginLinkBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    flex: 1,
    flexWrap: 'wrap',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF7F50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatarIcon: { fontSize: 24, color: '#fff' },

  form: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: { opacity: 0.7 },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginLink: { alignItems: 'center', paddingVertical: 10, marginTop: 10 },
  loginLinkText: { fontSize: 16, color: '#666' },
  loginLinkBold: { color: '#FFA500', fontWeight: 'bold' },
});
