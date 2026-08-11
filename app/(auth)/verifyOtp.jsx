import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../../components/Button';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/input';

import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import api from '../../utils/api';

const RESEND_COOLDOWN = 60; // seconds

const VerifyOtp = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const otp = useRef('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);

  // Countdown timer for the resend button
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const onVerify = async () => {
    if (!otp.current || otp.current.length !== 4) {
      return Alert.alert('Verify Email', 'Please enter the 4-digit code');
    }

    setLoading(true);
    try {
      const res = await api.post('/user/verifyOtp', {
        email,
        otp: otp.current,
      });

      Alert.alert(
        'Success',
        res.data.message || 'Email verified successfully',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data?.message || 'Verification failed');
      } else {
        Alert.alert('Error', 'Cannot reach server. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      const res = await api.post('/user/sendOtp', { email });
      Alert.alert('OTP Sent', res.data.message || 'A new code has been sent to your email');
      setSecondsLeft(RESEND_COOLDOWN); // restart cooldown
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data?.message || 'Could not resend OTP');
      } else {
        Alert.alert('Error', 'Cannot reach server. Check your connection.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a 4-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Enter OTP</Text>
            <Input
              placeholder="4-digit code"
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={(v) => (otp.current = v)}
            />

            <Button
              title="Verify"
              loading={loading}
              onPress={onVerify}
              buttonStyle={styles.button}
            />
          </View>

          <View style={styles.resendRow}>
            {secondsLeft > 0 ? (
              <Text style={styles.small}>
                Resend code in {secondsLeft}s
              </Text>
            ) : (
              <Pressable onPress={onResend} disabled={resending}>
                <Text style={[styles.small, styles.resendLink]}>
                  {resending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp(6),
    paddingTop: hp(6),
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: '#999',
    fontSize: hp(1.7),
    marginTop: 10,
    marginBottom: hp(3),
  },
  email: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  form: { gap: 8 },
  label: {
    fontSize: hp(1.5),
    color: theme.colors.text,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 30,
    height: hp(6.5),
  },
  resendRow: {
    alignItems: 'center',
    marginTop: hp(3),
  },
  small: {
    fontSize: hp(1.6),
    color: '#888',
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
