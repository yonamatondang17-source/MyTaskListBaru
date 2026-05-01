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
import { useTasks } from "../context/TaskContext";
import { COLORS, RADIUS, SHADOW } from "../theme/colors";

const PRIORITIES = [
  {
    key: "Tinggi",
    color: COLORS.danger,
    bg: COLORS.dangerBg,
    border: COLORS.danger,
  },
  {
    key: "Sedang",
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warning,
  },
  {
    key: "Rendah",
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.success,
  },
];

export default function AddTaskScreen({ navigation }) {
  const { addTask } = useTasks();
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [subtask, setSubtask] = useState("");
  const [priority, setPriority] = useState("Sedang");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Nama task tidak boleh kosong!";
    if (deadline && isNaN(Date.parse(deadline)))
      e.deadline = "Format tanggal tidak valid (YYYY-MM-DD)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const tagArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const subtaskArr = subtask
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    addTask({
      name: name.trim(),
      deadline: deadline || null,
      tags: tagArr,
      subtasks: subtaskArr,
      priority,
    });
    Alert.alert("Berhasil!", "Task berhasil ditambahkan.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.purple200} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backTxt}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Baru</Text>
        <Text style={styles.headerSub}>
          Isi detail task yang ingin ditambahkan
        </Text>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>
            NAMA TASK <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.inp, errors.name && styles.inpErr]}
            placeholder="Contoh: Kerjakan tugas praktikum..."
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            multiline
          />
          {errors.name && <Text style={styles.errTxt}>⚠ {errors.name}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            DEADLINE <Text style={styles.optional}>(OPSIONAL)</Text>
          </Text>
          <TextInput
            style={[styles.inp, errors.deadline && styles.inpErr]}
            placeholder="YYYY-MM-DD  (contoh: 2025-12-31)"
            placeholderTextColor={COLORS.textMuted}
            value={deadline}
            onChangeText={setDeadline}
            keyboardType="numbers-and-punctuation"
          />
          <Text style={styles.hint}>Kosongkan jika tidak ada deadline.</Text>
          {errors.deadline && (
            <Text style={styles.errTxt}>⚠ {errors.deadline}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            TAG <Text style={styles.optional}>(OPSIONAL)</Text>
          </Text>
          <TextInput
            style={styles.inp}
            placeholder="kerja, rumah, kuliah (pisah koma)"
            placeholderTextColor={COLORS.textMuted}
            value={tags}
            onChangeText={setTags}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            SUBTASK <Text style={styles.optional}>(SATU BARIS SATU)</Text>
          </Text>
          <TextInput
            style={[styles.inp, styles.textarea]}
            placeholder={"Baris 1\nBaris 2\nBaris 3"}
            placeholderTextColor={COLORS.textMuted}
            value={subtask}
            onChangeText={setSubtask}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PRIORITAS</Text>
          <View style={styles.prioGroup}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.prioBtn,
                  priority === p.key && {
                    backgroundColor: p.bg,
                    borderColor: p.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setPriority(p.key)}
              >
                <Text
                  style={[
                    styles.prioBtnTxt,
                    priority === p.key && { color: p.color, fontWeight: "800" },
                  ]}
                >
                  {p.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnCancel}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnCancelTxt}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSave}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSaveTxt}>✦ Tambah Task</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    backgroundColor: COLORS.purple200,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { marginBottom: 10 },
  backTxt: { fontSize: 13, color: COLORS.purple500, fontWeight: "700" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 20 },
  section: { marginBottom: 20 },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  required: { color: COLORS.danger },
  optional: { color: COLORS.textMuted, fontWeight: "400" },
  inp: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: COLORS.textPrimary,
    ...SHADOW.sm,
  },
  inpErr: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerBg },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  hint: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  errTxt: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: "600",
  },
  prioGroup: { flexDirection: "row", gap: 10 },
  prioBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    alignItems: "center",
    ...SHADOW.sm,
  },
  prioBtnTxt: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.md,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
  },
  btnCancelTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  btnSave: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.purple500,
    alignItems: "center",
    ...SHADOW.md,
  },
  btnSaveTxt: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
});
