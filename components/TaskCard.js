// components/TaskCard.js
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTasks } from "../context/TaskContext";
import { COLORS, RADIUS, SHADOW } from "../theme/colors";

const PRIO_STYLE = {
  Tinggi: { color: COLORS.danger, bg: COLORS.dangerBg, border: COLORS.danger },
  Sedang: {
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warning,
  },
  Rendah: {
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.success,
  },
};

function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function TaskCard({ task, onPress }) {
  const { toggleTask, deleteTask } = useTasks();
  const prio = PRIO_STYLE[task.priority] || PRIO_STYLE.Sedang;
  const subDone = task.subtasks.filter((s) => s.done).length;
  const subTotal = task.subtasks.length;
  const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;
  const overdue = !task.done && isOverdue(task.deadline);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.top}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.check, task.done && styles.checkDone]}
          onPress={() => toggleTask(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {task.done && <Text style={styles.checkTxt}>✓</Text>}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[styles.name, task.done && styles.nameDone]}
            numberOfLines={2}
          >
            {task.name}
          </Text>

          {task.tags.length > 0 && (
            <View style={styles.tagRow}>
              {task.tags.slice(0, 3).map((tg, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagTxt}>#{tg}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Delete */}
        <TouchableOpacity
          style={styles.delBtn}
          onPress={() => deleteTask(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.delTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottom}>
        <View style={styles.metaRow}>
          <View
            style={[
              styles.prioBadge,
              { backgroundColor: prio.bg, borderColor: prio.border },
            ]}
          >
            <Text style={[styles.prioBadgeTxt, { color: prio.color }]}>
              {task.priority}
            </Text>
          </View>
          {task.deadline && (
            <Text style={[styles.deadlineTxt, overdue && styles.overdueTxt]}>
              {overdue ? "⚠ " : "📅 "}
              {task.deadline}
            </Text>
          )}
        </View>
        {task.done && (
          <View style={styles.selesaiBadge}>
            <Text style={styles.selesaiTxt}>✓ SELESAI</Text>
          </View>
        )}
      </View>

      {/* Subtask Progress */}
      {subTotal > 0 && (
        <View style={styles.subRow}>
          <View style={styles.progBar}>
            <View style={[styles.progFill, { width: subPct + "%" }]} />
          </View>
          <Text style={styles.progTxt}>
            {subDone}/{subTotal} subtask
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
    backgroundColor: COLORS.bgSecondary,
  },
  checkDone: {
    backgroundColor: COLORS.purple500,
    borderColor: COLORS.purple500,
  },
  checkTxt: { fontSize: 11, color: COLORS.textWhite, fontWeight: "700" },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  nameDone: { textDecorationLine: "line-through", color: COLORS.textMuted },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 },
  tag: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagTxt: { fontSize: 10, fontWeight: "600", color: COLORS.purple500 },
  delBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: COLORS.bgSecondary,
  },
  delTxt: { fontSize: 12, color: COLORS.textMuted },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  prioBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  prioBadgeTxt: { fontSize: 10, fontWeight: "700" },
  deadlineTxt: { fontSize: 10, color: COLORS.textMuted, fontWeight: "500" },
  overdueTxt: { color: COLORS.danger },
  selesaiBadge: {
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  selesaiTxt: { fontSize: 10, fontWeight: "700", color: COLORS.success },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  progBar: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progFill: {
    height: "100%",
    backgroundColor: COLORS.purple500,
    borderRadius: 4,
  },
  progTxt: { fontSize: 10, color: COLORS.textSecondary, fontWeight: "600" },
});
