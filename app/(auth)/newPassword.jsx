import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme';
import BackButton from '../../components/backButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import Input from '../../components/input';
import Button from '../../components/Button';
import { MaterialIcons } from '@expo/vector-icons';

const NewPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const newPasswordRef = useRef('');
  const confirmPasswordRef = useRef('');
  const [loading, setLoading] = useState(false);

  // Get email and OTP from route params
  const email = params.email || '';
  const otp = params.otp || '';

  const handleResetPassword = async () => {
    if (!newPasswordRef.current || !confirmPasswordRef.current) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPasswordRef.current.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPasswordRef.current !== confirmPasswordRef.current) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const body = { 
        email: email,
        otp: otp,
        newPassword: newPasswordRef.current
      };
      
      console.log('🔄 Resetting password:', { ...body, newPassword: '***' });

      const response = await fetch('http://172.168.17.209:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

      console.log('🔹 Reset Password response:', data);

      if (response.ok && data.success) {
        Alert.alert(
          'Success', 
          'Password reset successfully! You can now login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      Alert.alert(
        'Network Error',
        error.message || 'Cannot connect to server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <BackButton router={router} />

          <View>
            <Text style={styles.welcomeText}>Create New</Text>
            <Text style={styles.welcomeText}>Password</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.instructionText}>
              Create your new password. Make sure it's strong and secure.
            </Text>

            <Text style={styles.emailText}>
              For: {email}
            </Text>

            <Input
              leftIcon={<MaterialIcons name="lock" size={22} color={theme.colors.text} />}
              placeholder="Enter new password"
              secureTextEntry
              onChangeText={(v) => (newPasswordRef.current = v)}
            />

            <Input
              leftIcon={<MaterialIcons name="lock-outline" size={22} color={theme.colors.text} />}
              placeholder="Confirm new password"
              secureTextEntry
              onChangeText={(v) => (confirmPasswordRef.current = v)}
            />

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirement}>• At least 6 characters long</Text>
              <Text style={styles.requirement}>• Use a combination of letters and numbers</Text>
              <Text style={styles.requirement}>• Avoid common words or patterns</Text>
            </View>

            <Button 
              title="Reset Password" 
              loading={loading} 
              onPress={handleResetPassword} 
            />

            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>
                ← Back to OTP Verification
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password?</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: '700' }]}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },

  container: { 
    flex: 1, 
    gap: 45, 
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    backgroundColor: theme.colors.background, 
  },

  welcomeText: { 
    fontSize: hp(4), 
    fontWeight: '700', 
    color: theme.colors.text,
    letterSpacing: 0.3,
  },

  form: { 
    gap: 25 
  },

  instructionText: { 
    fontSize: hp(1.6), 
    color: theme.colors.textSecondary,
    lineHeight: hp(2.2),
    marginBottom: hp(1),
  },

  emailText: {
    fontSize: hp(1.7),
    color: theme.colors.primaryDark,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: theme.colors.primaryLight,      // changed
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  passwordRequirements: {
    backgroundColor: theme.colors.card,              // changed
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryDark,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  requirementsTitle: {
    fontSize: hp(1.7),
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },

  requirement: {
    fontSize: hp(1.5),
    color: theme.colors.textSecondary,               // changed
    marginBottom: 4,
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },

  backButtonText: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: theme.colors.primary,                     // changed
  },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 6,
    marginTop: 'auto',
    paddingBottom: hp(2),
  },

  footerText: { 
    textAlign: 'center', 
    color: theme.colors.textSecondary,               // changed
    fontSize: hp(1.6),
  },
});
