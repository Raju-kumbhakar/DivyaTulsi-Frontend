import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { sendChatMessage } from "../../utils/api";

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const reply = await sendChatMessage(userMsg.text);

    const botMsg = {
      id: Date.now().toString() + "_bot",
      sender: "bot",
      text: reply,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Floating Search Bar - Same as Explore page */}
        <View style={styles.composerArea}>
          <View style={styles.composerInner}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#9fbffb"
              style={styles.composerInput}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: input.trim() ? "#25D366" : "#9ADFA6" }]}
              onPress={sendMessage}
              activeOpacity={0.85}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.typingContainer}>
            <Text style={styles.typing}>Assistant is typing...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FAFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    padding: 15,
    gap: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 10,
  },

  messagesContainer: {
    padding: 18,
    paddingBottom: 100,
  },

  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  userBubble: {
    backgroundColor: "#25D366",
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },

  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(74,144,226,0.1)",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
  },

  // Floating Search Bar styles from Explore page
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
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "rgba(74,144,226,0.1)",
  },
  
  composerInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    minHeight: 42,
    color: "#123e9a",
    padding: 0,
  },
  
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  typingContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  typing: {
    color: "#6e9fdc",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});