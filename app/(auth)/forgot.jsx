import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme';
import BackButton from '../../components/backButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import Input from '../../components/input';
import Button from '../../components/Button';
import { MaterialIcons } from '@expo/vector-icons';

const Forgot = () => {
  const router = useRouter();
  const emailRef = useRef('');
  const otpRef = useRef('');
  const newPasswordRef = useRef('');
  const confirmPasswordRef = useRef('');
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');

  const handleSendOtp = async () => {
    if (!emailRef.current) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRef.current)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const body = { email: emailRef.current };
      console.log('📧 Sending OTP request:', body);
      
      const response = await fetch('http://172.168.17.209:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      console.log('📧 Raw response:', text);
      
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('🔹 Forgot Password response:', data);

      // FIX: Check both response status AND success flag
      if (response.ok && data.success) {
        setEmail(emailRef.current);
        setStep(2);
        Alert.alert('OTP Sent', 'Please check your email for the OTP code.');
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      Alert.alert(
        'Network Error',
        error.message || 'Cannot connect to server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
  if (!otpRef.current) {
    Alert.alert('Error', 'Please enter the OTP code');
    return;
  }

  if (otpRef.current.length < 4) {
    Alert.alert('Error', 'Please enter a valid OTP code');
    return;
  }

  setLoading(true);
  try {
    const body = { 
      email: email,
      otp: otpRef.current 
    };
    
    console.log('🔐 Verifying OTP:', body);

    const response = await fetch('http://172.168.17.209:8080/api/auth/verify-otp', {
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

    console.log('🔹 Verify OTP response:', data);

    // FIX: Check both response status AND the success flag from backend
    if (response.ok && data.success) {
      Alert.alert('Success', 'OTP verified successfully. You can now reset your password.');
      
      // Navigate to newPassword page with email and OTP as params
      router.push({
        pathname: '/(auth)/newPassword',
        params: { 
          email: email,
          otp: otpRef.current 
        }
      });
    } else {
      // Show backend error message or default message
      Alert.alert('Error', data.message || 'Invalid OTP. Please try again.');
    }
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    Alert.alert(
      'Network Error',
      error.message || 'Cannot connect to server. Please check your connection and try again.'
    );
  } finally {
    setLoading(false);
  }
};

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
        otp: otpRef.current,
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

      // FIX: Check both response status AND success flag
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

  const goBackToPreviousStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const body = { email: email };
      const response = await fetch('http://172.168.17.209:8080/api/auth/forgot-password', {
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

      // FIX: Check both response status AND success flag
      if (response.ok && data.success) {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
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
            <Text style={styles.welcomeText}>Reset Your</Text>
            <Text style={styles.welcomeText}>Password</Text>
          </View>

          <View style={styles.form}>
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                <Text style={styles.instructionText}>
                  Enter your email address and we'll send you an OTP to reset your password.
                </Text>

                <Input
                  leftIcon={<MaterialIcons name="email" size={22} color={theme.colors.text} />}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onChangeText={(v) => (emailRef.current = v)}
                />

                <Button 
                  title="Send OTP" 
                  loading={loading} 
                  onPress={handleSendOtp} 
                />
              </>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <>
                <Text style={styles.instructionText}>
                  We've sent a 6-digit OTP to {email}. Please enter it below.
                </Text>

                <Input
                  leftIcon={<MaterialIcons name="sms" size={22} color={theme.colors.text} />}
                  placeholder="Enter OTP code"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={(v) => (otpRef.current = v)}
                />

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <Pressable onPress={resendOtp}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </Pressable>
                </View>

                <Button 
                  title="Verify OTP" 
                  loading={loading} 
                  onPress={handleVerifyOtp} 
                />

                <Pressable 
                  style={styles.backButton}
                  onPress={goBackToPreviousStep}
                >
                  <Text style={styles.backButtonText}>
                    ← Back to Email
                  </Text>
                </Pressable>
              </>
            )}
            {/* Back to Login */}
            <Pressable 
              style={styles.backToLoginContainer}
              onPress={() => router.back()}
            >
              <Text style={styles.backToLoginText}>
                Back to Login
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password?</Text>
            <Pressable onPress={() => router.back()}>
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

export default Forgot;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#E6F0FA",
  },

  container: { 
    flex: 1, 
    gap: 45, 
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },

  welcomeText: { 
    fontSize: hp(4), 
    fontWeight: '700', 
    color: "#2C5784",
  },

  form: { 
    gap: 25,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#4A90E2",
  },

  instructionText: { 
    fontSize: hp(1.6), 
    color: "#2C5784",
    lineHeight: hp(2.2),
    marginBottom: hp(1),
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 12,
  },

  resendText: {
    fontSize: hp(1.5),
    color: "#2C5784",
  },

  resendLink: {
    fontSize: hp(1.5),
    color: "#4A90E2",
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: hp(1),
  },

  backButtonText: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: "#4A90E2",
  },

  backToLoginContainer: {
    alignItems: 'center',
    paddingVertical: hp(1.5),
  },

  backToLoginText: {
    fontSize: hp(1.6),
    fontWeight: '700',
    color: "#4A90E2",
  },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 6,
    marginTop: 'auto',
  },

  footerText: { 
    textAlign: 'center', 
    color: "#2C5784", 
    fontSize: hp(1.6),
  },
});
