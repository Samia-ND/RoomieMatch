import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "./src/services/auth"; // ta fonction firebase login

export default function LoginScreen() {
  const navigation = useNavigation();
  // const { user, loading, error } = useContext(UserContext); // Temporarily commented out
  const user = null; // Mock user for testing
  const loading = false;
  const error = null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Refs pour naviguer entre les champs
  const passwordRef = useRef();

  console.log('LoginScreen - user:', user, 'loading:', loading, 'error:', error);

  // ✅ Redirection automatique si user existe
  useEffect(() => {
    if (user) {
      console.log('User detected, navigating to Home');
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    // Validation basique
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoginLoading(true);
    Keyboard.dismiss();

    try {
      await loginUser(email, password);
      // Navigate to Home after successful login
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert("Erreur", error.message || "Connexion impossible");
    } finally {
      setLoginLoading(false);
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
            Connectez-vous et trouvez votre colocataire idéal
          </Text>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>🔐</Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Champs du formulaire */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              ref={passwordRef}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* Bouton se connecter */}
          <TouchableOpacity
            style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Lien vers Register */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              Pas de compte ? <Text style={styles.registerLinkBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },

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
  avatarIcon: { 
    fontSize: 24, 
    color: '#fff' 
  },

  form: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputContainer: { 
    marginBottom: 20 
  },
  inputLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: { 
    opacity: 0.7 
  },
  loginButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  registerLink: { 
    alignItems: 'center', 
    paddingVertical: 10, 
    marginTop: 10 
  },
  registerLinkText: { 
    fontSize: 16, 
    color: '#666' 
  },
  registerLinkBold: { 
    color: '#FFA500', 
    fontWeight: 'bold' 
  },
});
