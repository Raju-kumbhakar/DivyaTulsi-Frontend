import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { logout } from '../../utils/authService';
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Load User from storage - will refresh every time screen comes into focus
  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  // Use useFocusEffect to reload user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

  // Also load on initial mount
  useEffect(() => {
    loadUser();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
  await logout();
  router.replace('/(auth)/login');
};

  // Navigate to Edit Profile with callback
  const handleEditProfile = () => {
    router.push({
      pathname: "/pages/editProfile",
      params: { refresh: "true" }
    });
  };

  // Navigate to Change Password
  const handleChangePassword = () => {
    router.push("/pages/change");
  };

  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
      {/* TOP HEADER */}
      <LinearGradient
        colors={["#4A90E2", "#6BB4FF"]}
        style={styles.header}
      >
        <Ionicons
          name="person-circle-outline"
          size={100}
          color="#fff"
          style={{ marginTop: 20 }}
        />
        <Text style={styles.headerName}>{user?.name || "User"}</Text>
        <Text style={styles.headerEmail}>{user?.email || user?.username || "email@example.com"}</Text>
        {user?.phoneNumber && (
          <Text style={styles.headerPhone}>+91 {user.phoneNumber}</Text>
        )}
      </LinearGradient>

      {/* PROFILE OPTIONS */}
      <View style={styles.card}>
        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.option}
          onPress={handleEditProfile}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name="person-outline" size={24} color="#4A90E2" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#4A90E2" />
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.option}
          onPress={handleChangePassword}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="lock-closed-outline" size={24} color="#4A90E2" />
            <Text style={styles.optionText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#4A90E2" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6F0FA" },

  header: {
    width: "100%",
    height: 240,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingBottom: 20,
  },

  headerName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  headerEmail: {
    color: "#f2f2f2",
    fontSize: 16,
    marginTop: 4,
  },

  headerPhone: {
    color: "#f2f2f2",
    fontSize: 14,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: 25,
    marginHorizontal: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});