// Explore.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "http://172.168.17.209:8080";

export const sendChatMessage = async (message) => {
  try {
    const res = await fetch(`${BASE_URL}/api/gemini/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log("Chat API Error:", err);
    return "Server error. Try again.";
  }
};

const pastelCategories = [
  { icon: "heart-outline", title: "Heart Health", color: "#FFD7D9" },
  { icon: "fitness-outline", title: "Fitness", color: "#FFF2D6" },
  { icon: "fast-food-outline", title: "Nutrition", color: "#DAF7F0" },
  { icon: "body-outline", title: "Skin Care", color: "#E8E9FF" },
  { icon: "eyedrop-outline", title: "Diabetes", color: "#F0E9FF" },
  { icon: "thermometer-outline", title: "Fever & Flu", color: "#FFEDE6" },
  { icon: "brain-outline", title: "Mental Health", color: "#E6FCFF" },
  { icon: "bed-outline", title: "Sleep", color: "#F7FFD9" },
  { icon: "bandage-outline", title: "First Aid", color: "#FFF1F8" },
  { icon: "woman-outline", title: "Women's Health", color: "#FFF6E8" },
  { icon: "man-outline", title: "Men's Health", color: "#F0F7FF" },
  { icon: "people-outline", title: "Community Care", color: "#F3F6FF" },
];

const quickQuestions = [
  "What are COVID-19 symptoms?",
  "Lower blood pressure naturally?",
  "Exercises for weight loss",
  "Foods to boost immunity",
  "How to manage stress?",
  "Signs of vitamin deficiency",
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [composerText, setComposerText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleSearch = async (text) => {
    const message = (text || searchQuery || composerText || "").trim();
    if (!message) return;

    // add user message
    const userMsg = { type: "user", content: message, ts: new Date().toISOString() };
    setChatHistory((p) => [...p, userMsg]);
    setSearchQuery("");
    setComposerText("");
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);

    try {
      const reply = await sendChatMessage(message);
      const aiMsg = { type: "ai", content: reply, ts: new Date().toISOString() };
      setChatHistory((p) => [...p, aiMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (err) {
      setChatHistory((p) => [
        ...p,
        { type: "ai", content: "Sorry, I'm having trouble connecting. Please try again.", ts: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat.title);
    setSearchQuery(cat.title);
    // Uncomment next line to auto-run the category query immediately:
    // handleSearch(cat.prompt || cat.title);
  };

  const handleQuickQuestion = (q) => {
    setSearchQuery(q);
    // optionally auto-run: handleSearch(q)
  };

  const clearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear all messages?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: () => setChatHistory([]) },
    ]);
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <KeyboardAvoidingView style={styles.outer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Health Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask questions — reliable & instant guidance</Text>
          </View>

          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={34} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* single floating search card */}
        <View style={styles.searchCardContainer}>
          <View style={styles.searchCard}>
            <Ionicons name="search-outline" size={20} color="#4A90E2" />
            <TextInput
              placeholder="Ask a health question or choose a category..."
              placeholderTextColor="#9bbcf7"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(searchQuery)}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* page content */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* quick questions chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow} contentContainerStyle={{ paddingLeft: 18 }}>
            {quickQuestions.map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickChip} onPress={() => handleQuickQuestion(q)}>
                <Text style={styles.quickText} numberOfLines={1}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* categories title */}
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => { /* optional: navigate to full categories screen */ }}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* categories grid (horizontal scroll but looks like cards) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 18, paddingVertical: 8 }}>
            {pastelCategories.map((c, idx) => {
              const active = selectedCategory === c.title;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.9}
                  onPress={() => handleCategoryPress(c)}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: c.color },
                    active && styles.categoryCardActive,
                  ]}
                >
                  <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                    <Ionicons name={c.icon} size={26} color={active ? "#fff" : "#2f6fe8"} />
                  </View>
                  <Text style={[styles.categoryTitle, active && styles.categoryTitleActive]} numberOfLines={2}>
                    {c.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* assistant header */}
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Assistant</Text>
            {chatHistory.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
                <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* chat area (compact, no extra large gap) */}
          <View style={styles.chatArea}>
            {chatHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={64} color="#DCEEFF" />
                <Text style={styles.emptyTitle}>Ask me anything about health ✨</Text>
                <Text style={styles.emptySubtitle}>Symptoms, remedies, prevention tips and more — I’m here to help.</Text>
              </View>
            ) : (
              chatHistory.map((m, i) => {
                const user = m.type === "user";
                return (
                  <View key={i} style={[styles.messageRow, user ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
                    {!user && <View style={styles.avatarLeft}><Ionicons name="medical-outline" size={18} color="#fff" /></View>}

                    <View style={[styles.bubble, user ? styles.bubbleUser : styles.bubbleAi]}>
                      <Text style={[styles.bubbleText, user ? styles.bubbleTextUser : styles.bubbleTextAi]}>{m.content}</Text>
                      <Text style={[styles.bubbleTime, user ? styles.bubbleTimeUser : styles.bubbleTimeAi]}>{formatTime(m.ts)}</Text>
                    </View>

                    {user && <View style={styles.avatarRight}><Ionicons name="person-circle" size={18} color="#fff" /></View>}
                  </View>
                );
              })
            )}

            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#4A90E2" />
                <Text style={styles.loadingText}>Assistant is typing...</Text>
              </View>
            )}
          </View>

          {/* bottom spacing to avoid overlap with composer */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* composer */}
        <View style={styles.composerArea}>
          <View style={styles.composerInner}>
            <TouchableOpacity style={styles.composerLeft}>
              <Ionicons name="attach-outline" size={20} color="#6b8fe8" />
            </TouchableOpacity>

            <TextInput
              value={composerText}
              onChangeText={setComposerText}
              placeholder="Type a message..."
              placeholderTextColor="#9fbffb"
              style={styles.composerInput}
              returnKeyType="send"
              onSubmitEditing={() => handleSearch(composerText)}
            />

            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: composerText.trim() ? "#25D366" : "#9ADFA6" }]}
              onPress={() => handleSearch(composerText)}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

// helper
const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#F3FAFF" },
  container: { flex: 1 },

  header: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 48 : 48,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 6,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  headerSubtitle: { color: "#D6EBFF", marginTop: 6, fontSize: 13 },

  profileBtn: {
    paddingTop: 2,
  },

  // floating search
  searchCardContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    top: Platform.OS === "ios" ? 180 : 170,
    zIndex: 20,
  },
  searchCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: "rgba(74,144,226,0.08)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#123e9a",
  },
  searchBtn: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },

  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 180 : 160,
    paddingBottom: 30,
  },

  quickRow: { marginTop: 6, height: 48 },
  quickChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(74,144,226,0.08)",
    elevation: 2,
  },
  quickText: { color: "#2f6fe8", fontWeight: "600", fontSize: 13 },

  rowHeader: {
    marginTop: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: { color: "#2f6fe8", fontWeight: "800", fontSize: 18 },
  viewAll: { color: "#4A90E2", fontWeight: "700" },

  // categories (pastel)
  categoriesRow: { marginTop: 6, paddingVertical: 6 },
  categoryCard: {
    width: 130,
    height: 130,
    borderRadius: 18,
    marginRight: 14,
    padding: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    // subtle border
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  categoryCardActive: {
    transform: [{ scale: 1.03 }],
    shadowOpacity: 0.18,
    elevation: 10,
    borderColor: "rgba(255,255,255,0.9)",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: { backgroundColor: "rgba(255,255,255,0.85)" },
  categoryTitle: { fontSize: 14, fontWeight: "700", color: "#123e9a", marginTop: 6 },
  categoryTitleActive: { color: "#08306b" },

  // chat area
  chatArea: {
    marginTop: 12,
    paddingHorizontal: 18,
  },

  emptyState: { alignItems: "center", marginTop: 18 },
  emptyTitle: { marginTop: 10, fontSize: 18, color: "#2f6fe8", fontWeight: "800" },
  emptySubtitle: { marginTop: 6, color: "#6e9fdc", textAlign: "center", maxWidth: 320 },

  // messages
  messageRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  avatarLeft: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(52,199,89,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarRight: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(74,144,226,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  bubble: {
    maxWidth: "74%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: "#25D366",
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  bubbleAi: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    borderWidth: 0.6,
    borderColor: "rgba(0,0,0,0.04)",
  },

  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextUser: { color: "#fff" },
  bubbleTextAi: { color: "#2b2b2b" },

  bubbleTime: { fontSize: 11, marginTop: 8, opacity: 0.75 },
  bubbleTimeUser: { color: "rgba(255,255,255,0.9)", textAlign: "right" },
  bubbleTimeAi: { color: "#8fa6e6", textAlign: "right" },

  loadingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  loadingText: { marginLeft: 8, color: "#567fbf" },

  // composer
  composerArea: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    alignItems: "center",
  },
  composerInner: {
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  composerLeft: { paddingHorizontal: 6 },
  composerInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    minHeight: 42,
    color: "#123e9a",
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  clearBtn: { flexDirection: "row", alignItems: "center" },
  clearText: { marginLeft: 6, color: "#ff6b6b", fontWeight: "700" },
});

