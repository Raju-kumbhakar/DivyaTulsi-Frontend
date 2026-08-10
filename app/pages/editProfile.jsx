import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import BackButton from "../../components/backButton";

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState({ 
    name: "", 
    email: "", 
    phoneNumber: "" 
  });
  const [loading, setLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        setUser({
          name: userData.name || "",
          email: userData.email || userData.username || "",
          phoneNumber: userData.phoneNumber || ""
        });
        setOriginalUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const hasChanges = () => {
    if (!originalUser) return false;
    return (
      user.name !== (originalUser.name || "") ||
      user.email !== (originalUser.email || originalUser.username || "") ||
      user.phoneNumber !== (originalUser.phoneNumber || "")
    );
  };

  const saveProfile = async () => {
    if (!user.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!user.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Basic phone validation (optional)
    if (user.phoneNumber && !/^\d{10}$/.test(user.phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        name: user.name.trim(),
        email: user.email.trim(),
        phoneNumber: user.phoneNumber.trim()
      };

      console.log('📝 Updating profile for:', user.email);
      console.log('📦 Profile data:', profileData);

      const response = await fetch(
        `http://172.168.17.209:8080/api/profile?email=${encodeURIComponent(user.email)}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(profileData),
        }
      );

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('🔹 Profile update response:', data);

      if (response.ok) {
        // Update local storage with new data
        const updatedUser = {
          ...originalUser,
          ...profileData
        };
        
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        
        Alert.alert(
          "Success", 
          "Profile updated successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back - Profile screen will automatically refresh due to useFocusEffect
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      Alert.alert(
        "Network Error", 
        error.message || "Could not connect to server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges()) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Discard", 
            style: "destructive",
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton router={router} />
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Form */}
        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Update your personal information below.
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={user.name}
              onChangeText={(v) => setUser({ ...user, name: v })}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={user.email}
              onChangeText={(v) => setUser({ ...user, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(v) => setUser({ ...user, phoneNumber: v })}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.saveButton, (!hasChanges() || loading) && styles.saveButtonDisabled]}
              onPress={saveProfile}
              disabled={!hasChanges() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  formContainer: {
    padding: wp(5),
    paddingTop: hp(3),
  },
  instructionText: {
    fontSize: hp(1.7),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: hp(2.3),
  },
  inputContainer: {
    marginBottom: hp(3),
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  discardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  discardButtonText: {
    color: '#666',
    fontSize: hp(1.8),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  changePasswordOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: wp(3),
    flex: 1,
  },
  optionText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: '600',
  },
  optionSubtext: {
    fontSize: hp(1.4),
    color: '#666',
    marginTop: 2,
  },
});