import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  useWindowDimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import assets from "../assets/images/assetsSchemes";

const Sidebar = ({ 
  selectedUser, 
  setSelectedUser, 
  registeredUsers, 
  loading, 
  currentUserPhone,
  onRefreshUsers 
}) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await onRefreshUsers();
    setRefreshing(false);
  };

  // Filter users based on search query and exclude current user
  const filteredUsers = registeredUsers.filter(user =>
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber?.includes(searchQuery)) &&
    user.phoneNumber !== currentUserPhone
  );

  return (
    <LinearGradient
      colors={["#2a2d4a", "#1c1b3a"]}
      style={[
        styles.container,
        !isLargeScreen && { width: "100%" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity style={styles.menuBtn}>
          <Image source={assets.menu_icon} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Image source={assets.search_icon} style={styles.searchIcon} />
        <TextInput
          placeholder="Search User..."
          placeholderTextColor="#c8c8c8"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* User List */}
      <ScrollView 
        style={styles.userList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8a56f0"]}
            tintColor="#8a56f0"
          />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.noUsersText}>
            {searchQuery ? 'No users found' : 'No users available'}
          </Text>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?.id === user.id;
            return (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userItem,
                  isSelected && { backgroundColor: "rgba(81, 73, 122, 0.5)" },
                ]}
                onPress={() => setSelectedUser(user)}
              >
                <Image
                  source={assets.avatar_icon}
                  style={styles.userImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>
                    {user.name || 'Unknown User'}
                  </Text>
                  <Text style={styles.phoneNumber}>
                    {user.phoneNumber}
                  </Text>
                  <Text style={[styles.status, { color: "#9ca3af" }]}>
                    Offline
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push("/profile")}
      >
        <LinearGradient
          colors={["#8a56f0", "#c94bf7"]}
          style={styles.logoutGradient}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
  menuBtn: {
    padding: 8,
  },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3660",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 20,
  },
  searchIcon: {
    width: 16,
    height: 16,
    tintColor: "#c8c8c8",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    marginLeft: 8,
  },
  userList: {
    marginTop: 16,
    flex: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  phoneNumber: {
    color: "#c8c8c8",
    fontSize: 12,
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    marginTop: 2,
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  noUsersText: {
    color: "#c8c8c8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutGradient: {
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});