import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import assets from "../assets/images/assetsSchemes";
import { theme } from "../constants/theme";
import { chatApi } from "../helpers/chatApi";

const ChatContainer = ({ selectedUser, setSelectedUser, currentUserPhone }) => {
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });
  };

  // Handle phone's back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [selectedUser]);

  const handleBackPress = () => {
    if (selectedUser) {
      setSelectedUser(null);
      return true;
    }
    return false;
  };

  // Load chat history when selected user changes
  useEffect(() => {
    if (selectedUser) {
      loadChatHistory();
    } else {
      setChatMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e?.endCoordinates?.height || 300;
      Animated.timing(keyboardHeight, {
        toValue: height,
        duration: Platform.OS === "ios" ? e.duration : 150,
        useNativeDriver: false,
      }).start(scrollToBottom);
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 150,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const loadChatHistory = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const history = await chatApi.getChatHistory(
        currentUserPhone,
        selectedUser.phoneNumber
      );
      
      // Transform API response to match our app format
      const transformedMessages = Array.isArray(history) ? history.map(msg => ({
        id: msg.id,
        text: msg.content,
        senderPhone: msg.senderPhone,
        timestamp: msg.timestamp,
        isUser: msg.senderPhone === currentUserPhone
      })) : [];
      
      setChatMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SILENT REFRESH: Refresh messages without showing any loading
  const silentRefresh = async () => {
    if (!selectedUser) return;
    
    try {
      const history = await chatApi.getChatHistory(
        currentUserPhone,
        selectedUser.phoneNumber
      );
      
      const transformedMessages = Array.isArray(history) ? history.map(msg => ({
        id: msg.id,
        text: msg.content,
        senderPhone: msg.senderPhone,
        timestamp: msg.timestamp,
        isUser: msg.senderPhone === currentUserPhone
      })) : [];
      
      setChatMessages(transformedMessages);
    } catch (error) {
      console.error('Error in silent refresh:', error);
    }
  };

  const handleSendMessage = async () => {
  if (!message.trim() || !selectedUser || sending) return;

  try {
    setSending(true);

    const messageData = {
      senderPhone: currentUserPhone,
      receiverPhone: selectedUser.phoneNumber,
      content: message.trim(),
    };

    // Send message via API
    const sentMessage = await chatApi.sendMessage(messageData);

    // Clear input
    setMessage("");

    // ✅ Add message instantly to local list before refresh
    setChatMessages((prev) => [
      ...prev,
      {
        id: sentMessage?.id || Date.now(),
        text: messageData.content,
        senderPhone: currentUserPhone,
        timestamp: new Date().toISOString(),
        isUser: true,
      },
    ]);

    scrollToBottom();

    // ✅ Refresh chat (pull latest messages)
    await silentRefresh();

  } catch (error) {
    Alert.alert("Error", "Failed to send message");
    console.error("Error sending message:", error);
  } finally {
    setSending(false);
  }
};


  // Handle back arrow button press
  const handleBackArrowPress = () => {
    setSelectedUser(null);
  };

  if (!selectedUser) {
    return (
      <LinearGradient
        colors={["#0D0D1F", "#14142B"]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Image source={assets.logo_icon} style={{ width: 80, height: 80 }} />
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            marginTop: 10,
            fontWeight: "600",
          }}
        >
          Chat anytime, anywhere ✨
        </Text>
      </LinearGradient>
    );
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#0D0D1F",
        paddingBottom: keyboardHeight,
      }}
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, "#14142B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: "#2E2E4D",
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={handleBackArrowPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Image
            source={assets.avatar_icon}
            style={{
              width: 45,
              height: 45,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: "#fff",
            }}
          />

          <View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {selectedUser?.name || "Unknown User"}
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
              {selectedUser?.phoneNumber}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Chat Messages */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ color: "#fff", marginTop: 10 }}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 14,
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
          // ❌ REMOVED: RefreshControl (no pull-to-refresh)
          renderItem={({ item }) => {
            const isUser = item.senderPhone === currentUserPhone;
            return (
              <View
                style={{
                  flexDirection: isUser ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  marginBottom: 12,
                }}
              >
                <Image
                  source={isUser ? assets.avatar_icon : assets.avatar_icon}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginHorizontal: 6,
                  }}
                />
                <View
                  style={{
                    backgroundColor: isUser
                      ? theme.colors.primary
                      : "rgba(255,255,255,0.1)",
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    maxWidth: "75%",
                    borderBottomRightRadius: isUser ? 4 : 18,
                    borderBottomLeftRadius: isUser ? 18 : 4,
                    shadowColor: "#6A4FF7",
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 4 }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Input Box */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: "#14142B",
          borderTopWidth: 0.6,
          borderTopColor: "#2E2E4D",
        }}
      >
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={24} color="#aaa" />
        </TouchableOpacity>

        <TextInput
          style={{
            flex: 1,
            color: "#fff",
            fontSize: 15,
            paddingHorizontal: 14,
            paddingVertical: Platform.OS === "ios" ? 10 : 8,
            backgroundColor: "#1B1B35",
            borderRadius: 25,
            marginHorizontal: 8,
          }}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          onFocus={scrollToBottom}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
          editable={!sending}
        />

        <TouchableOpacity onPress={handleSendMessage} disabled={sending}>
          <LinearGradient
            colors={[theme.colors.primary, "#6A4FF7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={22} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChatContainer;