// screens/MainScreen.js
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { COLORS, RADIUS, SHADOW } from "../theme/colors";

const SORT_OPTIONS = [
  { key: "terbaru", label: "Terbaru" },
  { key: "terlama", label: "Terlama" },
  { key: "deadline-asc", label: "Deadline ↑" },
  { key: "deadline-desc", label: "Deadline ↓" },
];

export default function MainScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { tasks, getStats } = useTasks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");
  const [sort, setSort] = useState("terbaru");

  const stats = getStats();

  const filtered = useMemo(() => {
    let list = [...tasks];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tg) => tg.toLowerCase().includes(q)),
      );
    }

    // Filter tab
    if (filter === "aktif") list = list.filter((t) => !t.done);
    if (filter === "selesai") list = list.filter((t) => t.done);

    // Sort
    list.sort((a, b) => {
      if (sort === "terbaru") return b.createdAt - a.createdAt;
      if (sort === "terlama") return a.createdAt - b.createdAt;
      if (sort === "deadline-asc")
        return (a.deadline || "9999") > (b.deadline || "9999") ? 1 : -1;
      if (sort === "deadline-desc")
        return (a.deadline || "0000") < (b.deadline || "0000") ? 1 : -1;
      return 0;
    });

    return list;
  }, [tasks, search, filter, sort]);

  const handleLogout = () => {
    Alert.alert("Logout", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.replace("Login");
        },
      },
    ]);
  };

  const countByFilter = {
    semua: tasks.length,
    aktif: tasks.filter((t) => !t.done).length,
    selesai: tasks.filter((t) => t.done).length,
  };

  const ListEmpty = () => (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>📋</Text>
      </View>
      <Text style={styles.emptyTitle}>Belum ada task</Text>
      <Text style={styles.emptySub}>
        Tekan tombol + untuk tambah task pertamamu
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.purple200} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandLabel}>MY TASK LIST</Text>
            <Text style={styles.appName}>
              Kelola <Text style={styles.appNameAccent}>Tugasmu</Text>
            </Text>
            <Text style={styles.userLabel}>Akun: {user?.username}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeNum}>
                {stats.done}
                <Text style={styles.doneBadgeSub}> / {stats.total}</Text>
              </Text>
              <Text style={styles.doneBadgeLbl}>selesai</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutTxt}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "TOTAL", value: stats.total, color: COLORS.textPrimary },
            { label: "AKTIF", value: stats.aktif, color: COLORS.purple500 },
            { label: "SELESAI", value: stats.done, color: COLORS.success },
            { label: "LEWAT", value: stats.lewat, color: COLORS.danger },
            {
              label: "PROGRES",
              value: stats.progres + "%",
              color: COLORS.warning,
            },
          ].map((s, i) => (
            <View key={i} style={[styles.statItem, i < 4 && styles.statBorder]}>
              <Text style={[styles.statNum, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInp}
            placeholder="Cari task atau tag..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sort */}
        <Text style={styles.sortLabel}>Urutkan</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SORT_OPTIONS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sortBtn,
                sort === item.key && styles.sortBtnActive,
              ]}
              onPress={() => setSort(item.key)}
            >
              <Text
                style={[
                  styles.sortTxt,
                  sort === item.key && styles.sortTxtActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.sortRow}
          contentContainerStyle={{ paddingRight: 16 }}
        />

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {["semua", "aktif", "selesai"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.ftab, filter === f && styles.ftabActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[styles.ftabTxt, filter === f && styles.ftabTxtActive]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({countByFilter[f]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() =>
                navigation.navigate("DetailTask", { taskId: item.id })
              }
            />
          )}
          ListEmptyComponent={<ListEmpty />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTask")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTxt}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    backgroundColor: COLORS.purple200,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  brandLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  appNameAccent: {
    color: COLORS.purple500,
  },
  userLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  doneBadge: {
    backgroundColor: COLORS.purple500,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: "center",
    ...SHADOW.sm,
  },
  doneBadgeNum: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textWhite,
  },
  doneBadgeSub: {
    fontSize: 12,
    opacity: 0.75,
  },
  doneBadgeLbl: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: COLORS.bgCard,
  },
  logoutTxt: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOW.sm,
  },
  statItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  statNum: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLbl: {
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 1,
    textTransform: "uppercase",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInp: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  searchClear: { fontSize: 13, color: COLORS.textMuted, padding: 4 },
  sortLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  sortRow: { marginBottom: 12 },
  sortBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.bgCard,
  },
  sortBtnActive: {
    backgroundColor: COLORS.purple500,
    borderColor: COLORS.purple500,
  },
  sortTxt: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  sortTxtActive: { color: COLORS.textWhite },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ftab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  ftabActive: {
    backgroundColor: COLORS.purple500,
    ...SHADOW.sm,
  },
  ftabTxt: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  ftabTxtActive: { color: COLORS.textWhite },
  listContent: { paddingBottom: 100 },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.purple500,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.purple500,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.lg,
  },
  fabTxt: {
    fontSize: 30,
    color: COLORS.textWhite,
    fontWeight: "300",
    lineHeight: 34,
  },
});
