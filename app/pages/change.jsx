import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import BackButton from '../../components/backButton';

const Change = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChangePassword = async () => {
    // Validation
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwords.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (passwords.oldPassword === passwords.newPassword) {
      Alert.alert('Error', 'New password must be different from old password');
      return;
    }

    setLoading(true);
    try {
      // Get user data to get email
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        Alert.alert('Error', 'User not found. Please login again.');
        router.back();
        return;
      }

      const userData = JSON.parse(storedUser);
      const userEmail = userData.email || userData.username;

      if (!userEmail) {
        Alert.alert('Error', 'User email not found');
        return;
      }

      // Prepare request body according to your API
      const body = {
        email: userEmail,
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      };

      console.log('🔐 Changing password for:', userEmail);

      // Call change password API - Using your actual IP
      const response = await fetch('http://1172.168.17.209:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('🔹 Change Password response:', data);

      if (response.ok) {
        Alert.alert(
          'Success',
          'Password changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear password fields and go back
                setPasswords({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to change password. Please check your old password and try again.');
      }
    } catch (error) {
      console.error('❌ Change password error:', error);
      Alert.alert(
        'Network Error',
        error.message || 'Cannot connect to server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton router={router} />
          <Text style={styles.title}>Change Password</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Password Form */}
        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Enter your current password and new password to update your credentials.
          </Text>

          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your current password"
                secureTextEntry={!showPasswords.oldPassword}
                value={passwords.oldPassword}
                onChangeText={(text) => setPasswords(prev => ({ ...prev, oldPassword: text }))}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('oldPassword')}
              >
                <Ionicons 
                  name={showPasswords.oldPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your new password"
                secureTextEntry={!showPasswords.newPassword}
                value={passwords.newPassword}
                onChangeText={(text) => setPasswords(prev => ({ ...prev, newPassword: text }))}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('newPassword')}
              >
                <Ionicons 
                  name={showPasswords.newPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                secureTextEntry={!showPasswords.confirmPassword}
                value={passwords.confirmPassword}
                onChangeText={(text) => setPasswords(prev => ({ ...prev, confirmPassword: text }))}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('confirmPassword')}
              >
                <Ionicons 
                  name={showPasswords.confirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={[styles.updateButton, loading && styles.updateButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="lock-closed" size={20} color="#fff" />
                <Text style={styles.updateButtonText}>Update Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Change;

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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  eyeIcon: {
    padding: wp(3),
  },
  updateButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    borderRadius: 12,
    marginTop: hp(2),
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: '600',
    marginLeft: wp(2),
  },
});