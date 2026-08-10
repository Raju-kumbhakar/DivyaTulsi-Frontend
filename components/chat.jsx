import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  useWindowDimensions, 
  Alert, 
  Text,
  ActivityIndicator 
} from "react-native";
import Sidebar from "../sideBar";
import ChatContainer from "../chatContainer";

import { chatApi } from "../../helpers/chatApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserPhone, setCurrentUserPhone] = useState("");
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Get logged-in user's phone number from AsyncStorage
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Clear old data first to test
        // await AsyncStorage.clear();
        
        const userData = await AsyncStorage.getItem('user');
        console.log('🔍 Raw user data from storage:', userData);
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('👤 Full user object from storage:', user);
          
          // Extract phone number - the API response has phoneNumber directly in user object
          const phone = user.phoneNumber;
          
          console.log('📱 Extracted phone number:', phone);
          
          if (phone) {
            setCurrentUserPhone(phone);
            console.log('✅ Setting current user phone to:', phone);
          } else {
            console.error('❌ No phone number found in user data');
            Alert.alert('Error', 'Phone number not found. Please login again.');
          }
        } else {
          console.error('❌ No user data found in storage');
          Alert.alert('Error', 'Please login first');
        }
      } catch (error) {
        console.error('❌ Error getting current user:', error);
        Alert.alert('Error', 'Failed to load user information');
      }
    };

    getCurrentUser();
  }, []);

  // Fetch registered users
  const fetchRegisteredUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching registered users for current user:', currentUserPhone);
      const users = await chatApi.getRegisteredUsers();
      console.log('✅ Registered users loaded:', users.length);
      setRegisteredUsers(users);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserPhone) {
      console.log('🎯 Current user phone ready:', currentUserPhone);
      fetchRegisteredUsers();
    }
  }, [currentUserPhone]);

  const showSidebarFull = !isLargeScreen && !selectedUser;

  // Show loading if we don't have the current user's phone yet
  if (!currentUserPhone) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E0E2C' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Loading user information...</Text>
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {(isLargeScreen || !selectedUser) && (
        <View
          style={[
            styles.sidebar,
            showSidebarFull && { width: "100%" },
          ]}
        >
          <Sidebar 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser}
            registeredUsers={registeredUsers}
            loading={loading}
            currentUserPhone={currentUserPhone}
            onRefreshUsers={fetchRegisteredUsers}
          />
        </View>
      )}

      {/* Chat container */}
      {(isLargeScreen || selectedUser) && (
        <View
          style={[
            styles.chatContainer,
            !isLargeScreen && !selectedUser && { display: "none" },
          ]}
        >
          <ChatContainer
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            currentUserPhone={currentUserPhone}
          />
        </View>
      )}
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0E0E2C",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#1B1A3D",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#12122D",
  },
});