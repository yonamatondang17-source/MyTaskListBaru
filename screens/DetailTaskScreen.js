// screens/DetailTaskScreen.js
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { COLORS, RADIUS, SHADOW } from "../theme/colors";

const PRIO_MAP = {
  Tinggi: { color: COLORS.danger, bg: COLORS.dangerBg },
  Sedang: { color: COLORS.warning, bg: COLORS.warningBg },
  Rendah: { color: COLORS.success, bg: COLORS.successBg },
};

function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function DetailTaskScreen({ navigation, route }) {
  const { taskId } = route.params;
  const { tasks, toggleTask, toggleSubtask, deleteTask } = useTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>Task tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const prio = PRIO_MAP[task.priority] || PRIO_MAP.Sedang;
  const subDone = task.subtasks.filter((s) => s.done).length;
  const subTotal = task.subtasks.length;
  const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;
  const overdue = isOverdue(task.deadline);

  const handleDelete = () => {
    Alert.alert("Hapus Task", `Hapus "${task.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.purple200} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backTxt}>← Kembali</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteTxt}>Hapus 🗑</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.taskName}>{task.name}</Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.prioBadge,
              { backgroundColor: prio.bg, borderColor: prio.color },
            ]}
          >
            <Text style={[styles.prioBadgeTxt, { color: prio.color }]}>
              {task.priority}
            </Text>
          </View>
          {task.done && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeTxt}>✓ SELESAI</Text>
            </View>
          )}
          {overdue && !task.done && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueTxt}>⚠ LEWAT DEADLINE</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>DEADLINE</Text>
            <Text
              style={[
                styles.infoValue,
                overdue && !task.done && { color: COLORS.danger },
              ]}
            >
              {task.deadline || "—"}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>PRIORITAS</Text>
            <Text style={[styles.infoValue, { color: prio.color }]}>
              {task.priority}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {task.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TAG</Text>
            <View style={styles.tagRow}>
              {task.tags.map((tg, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagTxt}>#{tg}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Subtask */}
        {subTotal > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUBTASK</Text>

            {/* Progress */}
            <View style={styles.progRow}>
              <View style={styles.progBar}>
                <View style={[styles.progFill, { width: subPct + "%" }]} />
              </View>
              <Text style={styles.progTxt}>
                {subDone}/{subTotal} ({subPct}%)
              </Text>
            </View>

            {task.subtasks.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.subItem}
                onPress={() => toggleSubtask(task.id, s.id)}
              >
                <View style={[styles.subCheck, s.done && styles.subCheckDone]}>
                  {s.done && <Text style={styles.subCheckTxt}>✓</Text>}
                </View>
                <Text style={[styles.subTxt, s.done && styles.subTxtDone]}>
                  {s.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Toggle Done Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.toggleBtn, task.done && styles.toggleBtnDone]}
          onPress={() => toggleTask(task.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.toggleBtnTxt}>
            {task.done ? "↩ Tandai Belum Selesai" : "✓ Tandai Selesai"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgPrimary },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  notFoundTxt: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 12 },
  backLink: { fontSize: 14, color: COLORS.purple500, fontWeight: "700" },
  header: {
    backgroundColor: COLORS.purple200,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backTxt: { fontSize: 13, color: COLORS.purple500, fontWeight: "700" },
  deleteTxt: { fontSize: 13, color: COLORS.danger, fontWeight: "700" },
  taskName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  prioBadge: {
    borderWidth: 1.5,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  prioBadgeTxt: { fontSize: 11, fontWeight: "700" },
  doneBadge: {
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  doneBadgeTxt: { fontSize: 11, fontWeight: "700", color: COLORS.success },
  overdueBadge: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  overdueTxt: { fontSize: 11, fontWeight: "700", color: COLORS.danger },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 20 },
  infoGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  infoCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoValue: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagTxt: { fontSize: 12, fontWeight: "600", color: COLORS.purple500 },
  progRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  progBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progFill: {
    height: "100%",
    backgroundColor: COLORS.purple500,
    borderRadius: 4,
  },
  progTxt: { fontSize: 11, fontWeight: "600", color: COLORS.textSecondary },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  subCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  subCheckDone: {
    backgroundColor: COLORS.purple500,
    borderColor: COLORS.purple500,
  },
  subCheckTxt: { fontSize: 11, color: COLORS.textWhite, fontWeight: "700" },
  subTxt: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  subTxtDone: { textDecorationLine: "line-through", color: COLORS.textMuted },
  footer: {
    padding: 16,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.md,
  },
  toggleBtn: {
    backgroundColor: COLORS.purple500,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: "center",
    ...SHADOW.md,
  },
  toggleBtnDone: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  toggleBtnTxt: { fontSize: 15, fontWeight: "800", color: COLORS.textWhite },
});
