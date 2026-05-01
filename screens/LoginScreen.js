// screens/LoginScreen.js
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, RADIUS, SHADOW } from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setErrors({});
    const result = login(email, password);
    if (!result.ok) {
      setErrors({ [result.field]: result.msg });
      return;
    }
    navigation.replace("Main");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.purple200} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
          <Text style={styles.heroSub}>SELAMAT DATANG DI</Text>
          <Text style={styles.heroTitle}>
            My<Text style={styles.heroTitleAccent}>Task</Text>List
          </Text>
          <Text style={styles.heroDesc}>
            Kelola tugasmu dengan mudah dan menyenangkan
          </Text>

          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
        </View>

        {/* Card Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MyTaskList Account</Text>
          <Text style={styles.cardSub}>
            Login untuk melihat daftar tugas Anda.
          </Text>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={[styles.inputWrap, errors.email && styles.inputErr]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="email@contoh.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errTxt}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <View
              style={[styles.inputWrap, errors.password && styles.inputErr]}
            >
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showPass}>{showPass ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errTxt}>{errors.password}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryTxt}>Masuk ✦</Text>
          </TouchableOpacity>

          {/* Alt */}
          <TouchableOpacity
            style={styles.altRow}
            onPress={() =>
              Alert.alert("Coming Soon", "Fitur Daftar segera hadir!")
            }
          >
            <Text style={styles.altTxt}>Belum punya akun? </Text>
            <Text style={styles.altLink}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.purple200,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 28,
    backgroundColor: COLORS.purple200,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.purple500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...SHADOW.lg,
  },
  logoIcon: {
    fontSize: 28,
    color: COLORS.textWhite,
  },
  heroSub: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  heroTitleAccent: {
    color: COLORS.purple500,
  },
  heroDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.purple300,
    opacity: 0.3,
    top: -30,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.purple400,
    opacity: 0.2,
    bottom: 10,
    left: -20,
  },
  circle3: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.purple500,
    opacity: 0.15,
    top: 20,
    left: 40,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    ...SHADOW.lg,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputErr: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerBg,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  showPass: {
    fontSize: 16,
    padding: 4,
  },
  errTxt: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: "600",
  },
  btnPrimary: {
    backgroundColor: COLORS.purple500,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
    ...SHADOW.md,
  },
  btnPrimaryTxt: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  altRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  altTxt: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  altLink: {
    fontSize: 13,
    color: COLORS.purple500,
    fontWeight: "700",
  },
});
